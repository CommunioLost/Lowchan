const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const path = require('path');

// Serve public files
app.use(express.static(path.join(__dirname, 'public')));

// GLOBAL MEMORY (This stores posts on the server while it is running)
// If the server restarts, this wipes (normal for simple imageboards)
let globalPosts = [];

io.on('connection', (socket) => {
    console.log('A student connected');

    // 1. When someone joins, send them the current history
    socket.emit('load_history', globalPosts);

    // 2. When someone sends a post
    socket.on('new_post', (postData) => {
        // Add timestamp server-side to prevent faking
        postData.date = new Date().toLocaleString();
        
        // Save to server memory
        globalPosts.push(postData);

        // Keep memory clean (only keep last 100 posts)
        if (globalPosts.length > 100) globalPosts.shift();

        // BROADCAST: Send this post to EVERYONE immediately
        io.emit('receive_post', postData);
    });
});

// Handle 404s
app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, 'public', '404.html'));
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Lowchan Real-Time Server running on port ${PORT}`);
});
