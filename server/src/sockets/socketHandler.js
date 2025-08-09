import Message from '../models/messageSchema.js';
import Event from '../models/eventSchema.js';
import Universe from '../models/universeSchema.js';

// In-memory storage for real-time data
const onlineUsers = new Map(); // Maps userId -> { socketId, username }
const gameRooms = {}; // Maps universeId -> { state, prompts, votes, timers, etc. }

export default function socketHandler(io) {
    io.on('connection', (socket) => {
        // 1. USER AUTHENTICATION & CONNECTION
        socket.on('authenticate', (user) => {
            console.log(`User authenticated: ${user.username} with socket ${socket.id}`);
            onlineUsers.set(user._id.toString(), { socketId: socket.id, username: user.username });
            socket.userId = user._id.toString(); // Attach userId to the socket object
        });

        // 2. JOINING & LEAVING ROOMS
        socket.on('join-room', async ({ universeId, user }) => {
            socket.join(universeId);
            io.to(universeId).emit('user-joined', `${user.username} has entered the universe.`);
            console.log(`${user.username} joined room: ${universeId}`);
        });

        socket.on('leave-room', ({ universeId, user }) => {
            socket.leave(universeId);
            io.to(universeId).emit('user-left', `${user.username} has left the universe.`);
            console.log(`${user.username} left room: ${universeId}`);
        });

        // 3. CHAT FEATURE
        socket.on('send-message', async (msg) => {
            // The HTML test sends 'content', but the schema needs 'text'.
            const { universeId, senderId, type, content } = msg;
            
            // --- FIX: Match the new messageSchema ---
            const newMessage = new Message({ 
                universeId, 
                sender: senderId, 
                type: "text", // Hardcoding for this test
                text: content // Map the 'content' from the client to the 'text' field
            });
            await newMessage.save();

            // Populate sender info for the client
            const populatedMessage = await Message.findById(newMessage._id).populate('sender', 'username profilePicture');
            
            // Broadcast to the room
            io.to(universeId).emit('new-message', populatedMessage);
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
        // --- END: Typing Indicator Logic ---

        // 4. KICK PLAYER NOTIFICATION
        socket.on('force-kick', ({ universeId, kickedUserId }) => {
            const kickedUserSocket = onlineUsers.get(kickedUserId.toString());
            if (kickedUserSocket) {
                io.to(kickedUserSocket.socketId).emit('you-were-kicked', { universeId });
            }
        });

        // 5. GAME ROUND LOGIC
        socket.on('start-round', async ({ universeId, userId }) => {
            if (gameRooms[universeId] && gameRooms[universeId].state !== 'finished') {
                return; // Round already in progress
            }

            const universe = await Universe.findById(universeId);
            const creatorIsOnline = onlineUsers.has(universe.creator.toString());

            // Authorization check: only creator can start if online, otherwise anyone can.
            if (creatorIsOnline && universe.creator.toString() !== userId) {
                return; // Creator is online, but someone else tried to start.
            }

            // Initialize game state for the room
            gameRooms[universeId] = {
                state: 'prompting', // States: 'prompting', 'voting', 'finished'
                prompts: [], // { prompt, userId, username }
                votes: {}, // promptId -> [userId]
                timers: {},
            };

            io.to(universeId).emit('round-started');

            // --- Prompting Phase ---
            gameRooms[universeId].timers.promptTimer = setTimeout(() => {
                const room = gameRooms[universeId];
                if (!room || room.state !== 'prompting') return;

                room.state = 'voting';
                io.to(universeId).emit('voting-started', room.prompts);

                // --- Voting Phase ---
                room.timers.voteTimer = setTimeout(async () => {
                    if (!room || room.state !== 'voting') return;
                    
                    // --- Determine Winner ---
                    let winningPrompt = null;
                    let maxVotes = -1;

                    // Find the prompt(s) with the most votes
                    const voteCounts = {};
                    for (const prompt of room.prompts) {
                        const promptId = prompt.userId; // Using userId as a unique prompt ID for the round
                        voteCounts[promptId] = room.votes[promptId] ? room.votes[promptId].length : 0;
                    }

                    // In case of a tie, the first submitted prompt wins. `prompts` array is already in order.
                    for (const prompt of room.prompts) {
                        const promptId = prompt.userId;
                        if (voteCounts[promptId] > maxVotes) {
                            maxVotes = voteCounts[promptId];
                            winningPrompt = prompt;
                        }
                    }

                    // Save the winning event to the database
                    if (winningPrompt) {
                        // This is where you would call your AI to get the outcome and mapEffect
                        const aiGeneratedOutcome = {
                            content: `As a result of "${winningPrompt.prompt}", alien forces attacked the Southern Citadel, leaving it in ruins.`,
                            resultType: "chaotic",
                            mapEffect: {
                                type: 'pulse_effect',
                                coordinates: [450, 800], // These coordinates would ideally come from the AI or a lookup
                                description: `Alien Attack on Southern Citadel (Year ${new Date().getFullYear()})`,
                                icon: 'explosion'
                            }
                        };

                        const newEvent = new Event({
                            universeId: universeId,
                            prompt: winningPrompt.prompt,
                            submittedBy: winningPrompt.userId,
                            aiOutcome: aiGeneratedOutcome
                        });
                        await newEvent.save();
                        
                        await Universe.findByIdAndUpdate(universeId, { $push: { timeline: newEvent._id } });

                        io.to(universeId).emit('round-ended', { winner: winningPrompt, event: newEvent });
                        
                        // --- BROADCAST THE MAP UPDATE ---
                        io.to(universeId).emit('map-update', newEvent);
                        // --- END BROADCAST ---

                    } else {
                        io.to(universeId).emit('round-ended', { winner: null, message: "No prompts were submitted or voted on." });
                    }

                    // Clean up room state
                    delete gameRooms[universeId];

                }, 30000); // 30 seconds for voting

            }, 30000); // 30 seconds for prompting
        });

        socket.on('submit-prompt', ({ universeId, prompt, user }) => {
            const room = gameRooms[universeId];
            if (room && room.state === 'prompting' && !room.prompts.some(p => p.userId === user._id)) {
                room.prompts.push({ prompt, userId: user._id, username: user.username });
                io.to(universeId).emit('prompt-received', { username: user.username });
            }
        });

        socket.on('cast-vote', ({ universeId, promptOwnerId, voterId }) => {
            const room = gameRooms[universeId];
            if (room && room.state === 'voting') {
                // Ensure user hasn't voted yet
                const hasVoted = Object.values(room.votes).flat().includes(voterId);
                if (hasVoted) return;

                if (!room.votes[promptOwnerId]) {
                    room.votes[promptOwnerId] = [];
                }
                room.votes[promptOwnerId].push(voterId);
                
                // Broadcast updated vote counts
                const voteCounts = {};
                for (const prompt of room.prompts) {
                    const pId = prompt.userId;
                    voteCounts[pId] = room.votes[pId] ? room.votes[pId].length : 0;
                }
                io.to(universeId).emit('vote-update', voteCounts);
            }
        });

        // 6. DISCONNECTION
        socket.on('disconnect', () => {
            if (socket.userId) {
                onlineUsers.delete(socket.userId);
                console.log(`User disconnected: ${socket.userId}`);
                // You can optionally emit a 'user-offline' event to all rooms they were in
            }
        });
    });
}