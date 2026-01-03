const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const path = require('path');

app.use(express.static(path.join(__dirname, 'public')));

// Global Store (This makes it real, not a simulation)
let posts = []; 

io.on('connection', (socket) => {
    // When a student opens a board, send them the REAL existing posts
    socket.on('join-board', (boardCode) => {
        socket.join(boardCode);
        const boardPosts = posts.filter(p => p.board === boardCode);
        socket.emit('load-initial-posts', boardPosts);
    });

    // When a student actually clicks "Post"
    socket.on('new-post', (data) => {
        const newPost = {
            id: Date.now(),
            board: data.board,
            user: data.user,
            text: data.text,
            time: new Date().toLocaleTimeString()
        };
        posts.push(newPost);
        // Broadcast to everyone currently looking at that board
        io.to(data.board).emit('render-post', newPost);
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`System Online on ${PORT}`));
