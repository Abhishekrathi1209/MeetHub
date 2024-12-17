const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const meetingRoutes = require('./meetingRoutes');
const socketHandler = require('./socket');

const app = express();
const server = http.createServer(app);

app.use((req, res, next) => {
    res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
    res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp');
    next();
  });  


const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST'],
    },
});

app.use(cors());
app.use(express.json());

app.use('/api/meetings', meetingRoutes);

socketHandler(io);

const PORT = 5000;
server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
