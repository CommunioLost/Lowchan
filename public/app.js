const socket = io();
let activeBoard = 'home';
let inputBuffer = "";
const SECRET_WORD = "nosa777"; // TYPE THIS TO UNLOCK ADMIN

document.addEventListener("DOMContentLoaded", () => {
    setTimeout(() => { document.getElementById('loader').style.display='none'; }, 2000);

    let id = localStorage.getItem('lc_id') || "ID-" + Math.floor(Math.random()*99999);
    localStorage.setItem('lc_id', id);
    document.getElementById('id-tag').innerText = id;

    document.documentElement.setAttribute('data-theme', localStorage.getItem('lc_theme') || 'blue');
});

// Admin Unlock Logic
document.addEventListener("keydown", (e) => {
    inputBuffer += e.key;
    if (inputBuffer.length > 15) inputBuffer = inputBuffer.substring(1);
    if (inputBuffer.includes(SECRET_WORD)) {
        localStorage.setItem('lc_admin_token', 'CHIEF_OF_NETWORK_99');
        localStorage.setItem('lc_id', 'ADMIN-NOSA');
        alert("ADMIN_ACCESS_UNLOCKED");
        location.reload();
    }
});

function nav(target) {
    document.querySelectorAll('.page').forEach(p => p.style.display = 'none');
    
    if(['math','sci','cs','v','a','mu'].includes(target)) {
        activeBoard = target;
        document.getElementById('view-board').style.display = 'block';
        document.getElementById('board-title').innerText = `/${target}/`;
        socket.emit('request_board_history', target);
    } else {
        activeBoard = 'home';
        document.getElementById('view-home').style.display = 'block';
        socket.emit('request_board_history', 'home');
    }
}

function send() {
    const val = document.getElementById('msg').value.trim();
    if(!val) return;
    socket.emit('new_post', { text: val, board: 'home', userId: localStorage.getItem('lc_id') });
    document.getElementById('msg').value = '';
}

function sendBoardPost() {
    const val = document.getElementById('boardMsg').value.trim();
    if(!val) return;
    socket.emit('new_post', { text: val, board: activeBoard, userId: localStorage.getItem('lc_id') });
    document.getElementById('boardMsg').value = '';
}

socket.on('receive_post', (p) => {
    if(p.board === activeBoard) render(p);
});

socket.on('load_history', (h) => {
    const targetFeed = activeBoard === 'home' ? 'feed' : 'boardFeed';
    document.getElementById(targetFeed).innerHTML = '';
    h.forEach(render);
});

socket.on('refresh_view', () => { location.reload(); });

function render(p) {
    const isMeAdmin = localStorage.getItem('lc_admin_token') === 'CHIEF_OF_NETWORK_99';
    const isAdminPost = p.userId === "ADMIN-NOSA";
    const targetFeed = activeBoard === 'home' ? 'feed' : 'boardFeed';
    
    const deleteBtn = isMeAdmin ? 
        `<button onclick="deletePost('${p.postId}')" class="del-btn">[DEL]</button>` : "";

    const html = `
        <div class="post" style="${isAdminPost ? 'border-left: 4px solid #ff4b4b;' : ''}">
            <div class="post-meta">
                <b style="${isAdminPost ? 'color: #ff4b4b;' : ''}">${isAdminPost ? "⚠️ ADMIN" : p.userId}</b> 
                <small>${p.date}</small>
                ${deleteBtn}
            </div>
            <p>${p.text}</p>
        </div>`;
    document.getElementById(targetFeed).insertAdjacentHTML('afterbegin', html);
}

function deletePost(postId) {
    socket.emit('admin_delete', { postId: postId, token: localStorage.getItem('lc_admin_token') });
}
