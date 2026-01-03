const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const path = require('path');

// 1. Serve "public" folder files explicitly
// This allows board.html, style.css, etc. to load correctly
app.use(express.static(path.join(__dirname, 'public')));

// 2. Default Route (The Homepage)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// 3. Socket.io Logic (Keep your existing socket logic here)
io.on('connection', (socket) => {
    console.log('A student connected');
    socket.on('chat message', (msg) => {
        io.emit('chat message', msg);
    });
});

// 4. Start Server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Lowchan Student Network running on port ${PORT}`);
});
