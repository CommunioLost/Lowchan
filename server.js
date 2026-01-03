const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static('public'));

// Catch-all to serve index.html for all routes (SPA Routing)
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

io.on('connection', (socket) => {
    socket.on('join-room', (room) => {
        socket.join(room);
    });

    socket.on('send-post', (data) => {
        // Broadcoast to specific community room
        io.to(data.room).emit('new-render', {
            id: Date.now(),
            text: data.text,
            style: data.userStyle,
            pfp: data.pfp
        });
    });
});

server.listen(process.env.PORT || 3000);
