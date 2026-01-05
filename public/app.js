const socket = io();
let currentBoard = 'home';
let secretBuffer = "";

// 1. THE UNLOCKER (Fixes the "Can't write" issue)
function unlockSystem() {
    const loader = document.getElementById('loader');
    if (loader) loader.style.display = 'none';

    const input = document.getElementById('post-input');
    if (input) {
        input.disabled = false;
        input.placeholder = "Write a message...";
    }
    
    const notice = document.getElementById('notice-text');
    if (notice) notice.innerText = "Connected to Lowchan Node";
}

// 2. INITIALIZE
document.addEventListener("DOMContentLoaded", () => {
    // If server is slow, force unlock after 3 seconds
    setTimeout(unlockSystem, 3000);

    let myID = localStorage.getItem('lc_id') || "ID-" + Math.floor(Math.random() * 9999);
    localStorage.setItem('lc_id', myID);
    
    const idTag = document.getElementById('id-tag');
    if (idTag) idTag.innerText = myID;

    socket.emit('request_board_history', 'home');
});

socket.on('connect', () => {
    unlockSystem();
});

// 3. NAVIGATION
function nav(target) {
    currentBoard = target;
    const title = document.getElementById('board-title');
    if (title) title.innerText = "/" + target + "/";
    
    // Clear feed and request new history
    const feed = document.getElementById('main-feed');
    if (feed) feed.innerHTML = "Loading transmissions...";
    
    socket.emit('request_board_history', target);
}

// 4. POSTING
function handleSubmit() {
    const input = document.getElementById('post-input');
    const val = input.value.trim();
    
    if (!val) return;
    if (!socket.connected) {
        alert("Server is still waking up. Try again in 5 seconds.");
        return;
    }

    socket.emit('new_post', {
        text: val,
        board: currentBoard,
        userId: localStorage.getItem('lc_id'),
        pfp: "https://api.dicebear.com/7.x/identicon/svg?seed=" + localStorage.getItem('lc_id')
    });
    input.value = "";
}

// 5. RENDERING
socket.on('load_history', (data) => {
    const feed = document.getElementById('main-feed');
    if (feed) {
        feed.innerHTML = "";
        data.forEach(renderPost);
    }
});

socket.on('receive_post', (post) => {
    if (post.board === currentBoard) renderPost(post);
});

function renderPost(p) {
    const feed = document.getElementById('main-feed');
    if (!feed) return;

    const html = `
        <div style="border-bottom:1px solid #222; padding:10px; margin-bottom:5px;">
            <b style="color:#7c3aed;">${p.userId}</b>: 
            <span>${p.text}</span>
        </div>`;
    feed.insertAdjacentHTML('afterbegin', html);
}

// 6. ADMIN CODES (nosa777)
document.addEventListener("keydown", (e) => {
    secretBuffer += e.key;
    if (secretBuffer.length > 20) secretBuffer = secretBuffer.substring(1);
    
    if (secretBuffer.includes("nosa777")) {
        localStorage.setItem('lc_admin_token', 'CHIEF_OF_NETWORK_99');
        localStorage.setItem('lc_id', 'ADMIN-NOSA');
        alert("ACCESS GRANTED");
        location.reload();
    }
});
