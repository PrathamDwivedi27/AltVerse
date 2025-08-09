import Message from '../models/messageSchema.js';
import Event from '../models/eventSchema.js';
import Universe from '../models/universeSchema.js';
import logger from '../utils/logger.js';

// In-memory storage for real-time data
const onlineUsers = new Map(); // Maps userId -> { socketId, username }
const gameRooms = {}; // Maps universeId -> { state, prompts, votes, timers, etc. }

export default function socketHandler(io) {
    io.on('connection', (socket) => {
        // 1. USER AUTHENTICATION & CONNECTION
        socket.on('authenticate', (user) => {
            logger.info(`User authenticated: ${user.username} with socket ${socket.id}`);
            onlineUsers.set(user._id.toString(), { socketId: socket.id, username: user.username });
            socket.userId = user._id.toString(); // Attach userId to the socket object
        });

        // 2. JOINING & LEAVING ROOMS
        socket.on('join-room', async ({ universeId, user }) => {
            socket.join(universeId);
            io.to(universeId).emit('user-joined', `${user.username} has entered the universe.`);
            logger.info(`${user.username} joined room: ${universeId}`);
        });

        socket.on('leave-room', ({ universeId, user }) => {
            socket.leave(universeId);
            io.to(universeId).emit('user-left', `${user.username} has left the universe.`);
            logger.info(`${user.username} left room: ${universeId}`);
        });

        // --- NEW: Typing Indicator Logic ---
        socket.on('start-typing', ({ universeId, user }) => {
            // Broadcast to everyone else in the room that this user is typing
            socket.to(universeId).emit('user-is-typing', { username: user.username });
        });

        socket.on('stop-typing', ({ universeId }) => {
            // Broadcast to everyone else that the user has stopped typing
            socket.to(universeId).emit('user-stopped-typing');
        });

        // 4. KICK PLAYER NOTIFICATION
        socket.on('force-kick', ({ universeId, kickedUserId }) => {
            const kickedUserSocket = onlineUsers.get(kickedUserId.toString());
            if (kickedUserSocket) {
                io.to(kickedUserSocket.socketId).emit('you-were-kicked', { universeId });
            }
        });

        // 5. GAME ROUND LOGIC
        socket.on('start-round', async ({ universeId, userId }) => {
            try {
                if (gameRooms[universeId] && gameRooms[universeId].state !== 'finished') {
                    return; // Round already in progress
                }

                const universe = await Universe.findById(universeId).lean();
                if (!universe) {
                    return; // Universe not found
                }

                const creatorIsOnline = onlineUsers.has(universe.creator.toString());

                // Authorization check
                if (creatorIsOnline && universe.creator.toString() !== userId) {
                    // Optionally emit an error back to the user who tried to start
                    socket.emit('round-error', { message: "Only the creator can start the round while they are online." });
                    return;
                }

                // Initialize game state for the room
                gameRooms[universeId] = {
                    state: 'prompting',
                    prompts: [], // Stores { prompt, userId, username }
                    votes: {},   // Stores promptOwnerId -> [voterId]
                    timers: {},
                    roundStarter: socket.id // Keep track of who started the round
                };

                io.to(universeId).emit('round-started');
                logger.info(`Round started in universe ${universeId}`);

                // --- Prompting Phase Timer ---
                gameRooms[universeId].timers.promptTimer = setTimeout(() => {
                    const room = gameRooms[universeId];
                    if (!room || room.state !== 'prompting') return;

                    room.state = 'voting';
                    io.to(universeId).emit('voting-started', room.prompts);
                    logger.info(`Voting started in universe ${universeId}`);

                    // --- Voting Phase Timer ---
                    room.timers.voteTimer = setTimeout(async () => {
                        if (!room || room.state !== 'voting') return;
                        
                        let winningPrompt = null;
                        let maxVotes = -1;

                        const voteCounts = {};
                        room.prompts.forEach(p => {
                            const count = room.votes[p.userId] ? room.votes[p.userId].length : 0;
                            voteCounts[p.userId] = count;
                        });

                        // Find the winner (first submitted in case of a tie)
                        for (const prompt of room.prompts) {
                            if (voteCounts[prompt.userId] > maxVotes) {
                                maxVotes = voteCounts[prompt.userId];
                                winningPrompt = prompt;
                            }
                        }

                        // If there's a winner, trigger the event creation on the client-side
                        if (winningPrompt) {
                            // The client of the person who started the round is responsible for calling the API
                            io.to(room.roundStarter).emit('create-event-from-prompt', {
                                universeId: universeId,
                                prompt: winningPrompt.prompt,
                                submittedBy: winningPrompt.userId
                            });
                            logger.info(`Winning prompt selected for ${universeId}. Notifying round starter to create event.`);
                        } else {
                            io.to(universeId).emit('round-ended-no-winner', { message: "No prompts were submitted or voted on." });
                        }

                        // Clean up room state
                        delete gameRooms[universeId];

                    }, 30000); // 30 seconds for voting
                }, 30000); // 30 seconds for prompting

            } catch (error) {
                logger.error("Error in 'start-round' handler:", error);
                socket.emit('round-error', { message: "A server error occurred while starting the round." });
            }
        });

        socket.on('submit-prompt', ({ universeId, prompt, user }) => {
            const room = gameRooms[universeId];
            // Check if prompting is active and if user has already submitted
            if (room && room.state === 'prompting' && !room.prompts.some(p => p.userId === user._id)) {
                const newPrompt = { prompt, userId: user._id, username: user.username };
                room.prompts.push(newPrompt);
                // Broadcast the new prompt to everyone in the room immediately
                io.to(universeId).emit('new-prompt-submitted', newPrompt);
            }
        });

        socket.on('cast-vote', ({ universeId, promptOwnerId, voterId }) => {
            const room = gameRooms[universeId];
            if (room && room.state === 'voting') {
                // Ensure user hasn't voted yet in this round
                const hasVoted = Object.values(room.votes).flat().includes(voterId);
                if (hasVoted) return;

                if (!room.votes[promptOwnerId]) {
                    room.votes[promptOwnerId] = [];
                }
                room.votes[promptOwnerId].push(voterId);
                
                // Broadcast updated vote counts for the live voting feature
                const currentVoteCount = room.votes[promptOwnerId].length;
                io.to(universeId).emit('vote-update', { promptOwnerId, count: currentVoteCount });
            }
        });

        // 6. DISCONNECTION
        socket.on('disconnect', () => {
            if (socket.userId) {
                onlineUsers.delete(socket.userId);
                logger.info(`User disconnected: ${socket.userId}`);
            }
        });
    });
}