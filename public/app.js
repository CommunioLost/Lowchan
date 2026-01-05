const socket = io();
let currentBoard = 'home';
let isStaff = localStorage.getItem('isStaff') === 'true';

// ATTACH EVENT LISTENERS SAFELY
document.addEventListener("DOMContentLoaded", () => {
    const postBtn = document.getElementById('post-btn');
    if(postBtn) {
        postBtn.onclick = () => {
            const img = document.getElementById('img-input').value;
            const msg = document.getElementById('text-input').value;
            if(!msg) return alert("Text required");
            
            socket.emit('new_post', {
                board: currentBoard,
                text: msg,
                img: img,
                userId: localStorage.getItem('lc_id') || "Anon"
            });
            document.getElementById('img-input').value = "";
            document.getElementById('text-input').value = "";
        };
    }
});

// NAVIGATION
function nav(board) {
    document.querySelectorAll('.page').forEach(p => p.style.display = 'none');
    if(board === 'home') {
        document.getElementById('view-home').style.display = 'flex';
    } else {
        currentBoard = board;
        document.getElementById('view-board').style.display = 'block';
        document.getElementById('board-title').innerText = `/${board}/`;
        socket.emit('request_threads', board);
    }
}

// LOGIN SYSTEM
function handleLogin() {
    const pass = document.getElementById('admin-pass').value;
    if(pass === "your_password_here") { // Change this!
        localStorage.setItem('isStaff', 'true');
        alert("Staff Authenticated");
        location.reload();
    } else {
        alert("Invalid Passkey");
    }
}

// UPVOTE / DOWNVOTE
function castVote(id, type) {
    socket.emit('vote', { id, type });
}

// RENDERING CATALOG
socket.on('load_threads', (threads) => {
    const container = document.getElementById('catalog-container');
    container.innerHTML = "";
    threads.forEach(t => {
        const card = `
            <div class="thread-card terminal-border">
                <img src="${t.img || 'https://via.placeholder.com/150'}" class="thumb">
                <div class="vote-controls">
                    <span onclick="castVote('${t.id}', 'up')">▲</span>
                    <b>${t.score || 0}</b>
                    <span onclick="castVote('${t.id}', 'down')">▼</span>
                </div>
                <p>${t.text.substring(0, 30)}...</p>
                ${isStaff ? `<button onclick="openMod('${t.userId}')">BAN</button>` : ""}
            </div>`;
        container.insertAdjacentHTML('beforeend', card);
    });
});
