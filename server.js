const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const path = require('path');

app.use(express.static(path.join(__dirname, 'public')));

// Board Database
let boardData = {
    home: [], math: [], sci: [], cs: [], v: [], a: [], mu: [], tech: [], news: [], media: []
};

// Admin & Ban Database
let bans = {}; // Format: { userId: { reason: "", expires: timestamp } }
const ADMIN_TOKENS = ["CHIEF_OF_NETWORK_99", "BROTHER_SUPREME_LEADER"];

io.on('connection', (socket) => {
    // 1. Check if user is banned
    socket.on('check_auth', (userId) => {
        if (bans[userId] && bans[userId].expires > Date.now()) {
            socket.emit('banned', bans[userId]);
        }
    });

    // 2. Load History
    socket.on('request_board_history', (board) => {
        if (boardData[board]) socket.emit('load_history', boardData[board]);
    });

    // 3. Handle Posts (With auto-cleanup)
    socket.on('new_post', (data) => {
        if (bans[data.userId] && bans[data.userId].expires > Date.now()) return;

        const post = {
            postId: "PID-" + Date.now(),
            text: data.text,
            userId: data.userId,
            board: data.board || 'home',
            pfp: data.pfp || '',
            date: new Date().toLocaleTimeString()
        };

        if (boardData[post.board]) {
            boardData[post.board].push(post);
            if (boardData[post.board].length > 100) boardData[post.board].shift();
            io.emit('receive_post', post);
        }
    });

    // 4. Admin: Ban User
    socket.on('admin_ban', (req) => {
        if (ADMIN_TOKENS.includes(req.token)) {
            bans[req.targetId] = {
                reason: req.reason,
                expires: Date.now() + (req.hours * 3600000)
            };
            io.emit('force_refresh', req.targetId);
        }
    });

    // 5. Admin: Delete
    socket.on('admin_delete', (req) => {
        if (ADMIN_TOKENS.includes(req.token)) {
            Object.keys(boardData).forEach(b => {
                boardData[b] = boardData[b].filter(p => p.postId !== req.postId);
            });
            io.emit('refresh_view');
        }
    });
});

http.listen(process.env.PORT || 3000, () => console.log('Systems Online'));
