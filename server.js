const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const path = require('path');

app.use(express.static(path.join(__dirname, 'public')));

let boardData = {
    home: [], math: [], sci: [], cs: [], v: [], a: [], mu: [], tech: [], news: []
};

let onlineUsers = 0;
const ADMIN_TOKEN = "CHIEF_OF_NETWORK_99"; 

io.on('connection', (socket) => {
    onlineUsers++;
    io.emit('user_count', onlineUsers);

    socket.on('request_board_history', (board) => {
        if (boardData[board]) socket.emit('load_history', boardData[board]);
    });

    socket.on('new_post', (data) => {
        const post = {
            postId: "PID-" + Date.now(),
            text: data.text,
            userId: data.userId,
            board: data.board || 'home',
            date: new Date().toLocaleTimeString()
        };
        if (boardData[post.board]) {
            boardData[post.board].push(post);
            if (boardData[post.board].length > 100) boardData[post.board].shift();
            io.emit('receive_post', post);
        }
    });

    socket.on('admin_delete', (req) => {
        if (req.token === ADMIN_TOKEN) {
            Object.keys(boardData).forEach(b => {
                boardData[b] = boardData[b].filter(p => p.postId !== req.postId);
            });
            io.emit('refresh_view');
        }
    });

    socket.on('disconnect', () => {
        onlineUsers--;
        io.emit('user_count', onlineUsers);
    });
});

http.listen(process.env.PORT || 3000, () => console.log('Network Active'));
