const socket = io();
let currentBoard = 'home';

document.addEventListener("DOMContentLoaded", () => {
    // 1. Loading Screen Timeout
    setTimeout(() => { document.getElementById('app-loader').style.display = 'none'; }, 1600);

    // 2. Identity
    let id = localStorage.getItem('lowchan_id') || "STD-" + Math.floor(10000 + Math.random()*90000);
    localStorage.setItem('lowchan_id', id);
    document.getElementById('user-id').innerText = id;
    document.getElementById('settings-id').innerText = id;

    // 3. Theme
    changeTheme(localStorage.getItem('lowchan_theme') || 'blue');
});

function navigateTo(view) {
    document.querySelectorAll('.page-view').forEach(v => v.style.display = 'none');
    
    if(['math', 'sci', 'cs', 'v', 'a'].includes(view)) {
        currentBoard = view;
        document.getElementById('view-board').style.display = 'block';
        document.getElementById('active-board-title').innerText = `/${view}/`;
        socket.emit('request_board_history', view);
    } else {
        document.getElementById('view-' + view).style.display = 'block';
    }
}

function changeTheme(t) {
    document.documentElement.setAttribute('data-theme', t);
    localStorage.setItem('lowchan_theme', t);
}

function submitPost() {
    const text = document.getElementById('postInput').value;
    if(!text) return;
    
    socket.emit('new_post', {
        text: text,
        board: currentBoard,
        userId: localStorage.getItem('lowchan_id')
    });
    document.getElementById('postInput').value = '';
}

socket.on('receive_post', (data) => {
    if(data.board === currentBoard) addPostToUI(data);
});

socket.on('load_history', (history) => {
    const container = document.getElementById('postsContainer');
    container.innerHTML = '';
    history.filter(p => p.board === currentBoard).forEach(addPostToUI);
});

function addPostToUI(p) {
    const html = `<div class="post-card" style="background:var(--panel); padding:15px; margin-top:10px; border-left:3px solid var(--accent);">
        <small>${p.userId} • ${p.date}</small>
        <p>${p.text}</p>
    </div>`;
    document.getElementById('postsContainer').insertAdjacentHTML('afterbegin', html);
}
