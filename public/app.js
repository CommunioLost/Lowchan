const socket = io();
let currentBoard = 'home';
let isStaff = localStorage.getItem('isStaff') === 'true';

// Check Staff Status on Load
if(isStaff) {
    document.getElementById('admin-tab').style.display = 'inline';
}

document.addEventListener("DOMContentLoaded", () => {
    // FIX: Listen for clicks on the Submit button directly
    document.getElementById('post-btn').addEventListener('click', () => {
        const img = document.getElementById('img-input').value;
        const msg = document.getElementById('text-input').value;
        
        if(!msg) return alert("Message is required to post.");

        socket.emit('new_post', {
            board: currentBoard,
            text: msg,
            img: img || null, // Image is now optional
            userId: localStorage.getItem('lc_id') || "Anon"
        });

        // Clear inputs
        document.getElementById('img-input').value = "";
        document.getElementById('text-input').value = "";
    });

    socket.emit('request_threads', 'home');
});

// NAVIGATION
function nav(board) {
    if(board === 'admin' && !isStaff) return alert("Unauthorized");
    
    currentBoard = board;
    document.querySelectorAll('.page').forEach(p => p.style.display = 'none');
    
    if(board === 'home') {
        document.getElementById('view-home').style.display = 'flex';
    } else if(board === 'admin') {
        document.getElementById('view-admin').style.display = 'flex';
    } else {
        document.getElementById('view-board').style.display = 'block';
        document.getElementById('board-title').innerText = `/${board}/`;
        socket.emit('request_threads', board);
    }
}

// ADMIN FUNCTIONS
function openAdminModal() { document.getElementById('admin-modal').style.display = 'flex'; }
function closeAdminModal() { document.getElementById('admin-modal').style.display = 'none'; }

function handleLogin() {
    const pass = document.getElementById('admin-pass').value;
    // STRONG PASSWORD
    if(pass === "LC-99-Global-Admin-Secure-777") {
        localStorage.setItem('isStaff', 'true');
        alert("ACCESS GRANTED");
        location.reload();
    } else {
        alert("INVALID KEY");
    }
}

// RECEIVING DATA
socket.on('load_threads', (threads) => {
    const container = document.getElementById('catalog-container');
    container.innerHTML = "";
    threads.forEach(t => {
        const imgHtml = t.img ? `<img src="${t.img}" class="thumb">` : `<div class="no-img">NO_IMAGE</div>`;
        const card = `
            <div class="thread-card terminal-border">
                ${imgHtml}
                <div class="post-info">
                    <b>${t.userId}</b>
                    <p>${t.text}</p>
                    ${isStaff ? `<button onclick="deletePost('${t.id}')">DEL</button>` : ""}
                </div>
            </div>`;
        container.insertAdjacentHTML('beforeend', card);
    });
});
