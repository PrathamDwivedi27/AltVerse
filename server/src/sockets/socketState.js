// In-memory storage for real-time data
export const onlineUsers = new Map(); // Maps userId -> { socketId, username }
export const gameRooms = {}; // Maps universeId -> { state, prompts, votes, timers, etc. }
