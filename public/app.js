const socket = io();
let currentBoard = 'home';
let isAdmin = false;

// 1. Navigation & Catalog
function nav(board) {
    document.querySelectorAll('.page').forEach(p => p.style.display = 'none');
    if (board === 'home') {
        document.getElementById('view-home').style.display = 'block';
    } else {
        currentBoard = board;
        document.getElementById('view-board').style.display = 'block';
        document.getElementById('board-header').innerText = `/${board}/`;
        socket.emit('request_threads', board);
    }
}

// 2. Voting System
function vote(postId, type) {
    socket.emit('cast_vote', { postId, type });
}

// 3. Rendering Catalog Style
socket.on('thread_list', (threads) => {
    const container = document.getElementById('thread-container');
    container.innerHTML = '';
    threads.forEach(t => {
        const card = `
            <div class="thread-card">
                <img src="${t.img}" class="thread-img">
                <div class="thread-info">
                    <div class="vote-bar">
                        <span onclick="vote('${t.id}', 'up')">▲</span>
                        <span>${t.score || 0}</span>
                        <span onclick="vote('${t.id}', 'down')">▼</span>
                    </div>
                    <p class="thread-excerpt">${t.text.substring(0, 50)}...</p>
                    ${isAdmin ? `<button onclick="openMod('${t.userId}')">BAN</button> <button onclick="del('${t.id}')">DEL</button>` : ''}
                </div>
            </div>`;
        container.insertAdjacentHTML('beforeend', card);
    });
});

// 4. Moderation Panel
function openAdminPanel() {
    document.getElementById('admin-modal').style.display = 'flex';
}

function tryAdmin() {
    const pass = document.getElementById('admin-pass').value;
    // Replace this with your actual secure check
    if (pass === "your_secure_password") {
        isAdmin = true;
        localStorage.setItem('is_mod', 'true');
        alert("Logged in as Staff");
        location.reload();
    }
}

function openMod(uid) {
    document.getElementById('target-uid').innerText = uid;
    document.getElementById('mod-popup').style.display = 'flex';
}

function executeBan() {
    const uid = document.getElementById('target-uid').innerText;
    const reason = document.getElementById('ban-reason').value;
    const duration = document.getElementById('ban-duration').value;
    
    socket.emit('admin_ban', { uid, reason, duration });
    closeModal();
}

function closeModal() {
    document.querySelectorAll('.modal').forEach(m => m.style.display = 'none');
}
