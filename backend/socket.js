const socketHandler = (io) => {
    io.on('connection', (socket) => {
        console.log('A user connected:', socket.id);

        // Join a meeting
        socket.on('join-meeting', ({ meetingCode, userId }) => {
            socket.join(meetingCode);
            socket.to(meetingCode).emit('user-joined', { userId });
        });

        // Handle video/audio toggle
        socket.on('toggle-media', ({ meetingCode, userId, mediaType, state }) => {
            socket.to(meetingCode).emit('media-toggled', { userId, mediaType, state });
        });

        // Real-time chat
        socket.on('send-message', ({ meetingCode, message, userId }) => {
            socket.to(meetingCode).emit('receive-message', { message, userId });
        });

        // Disconnect
        socket.on('disconnect', () => {
            console.log('A user disconnected:', socket.id);
        });
    });
};

module.exports = socketHandler;
