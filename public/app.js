/* LOWCHAN CORE - ENCRYPTED V1.0.4 */\
const socket = io();
let currentBoard = 'home';

document.addEventListener("DOMContentLoaded", () => {
    // Immediate unlock after 2 seconds
    setTimeout(() => {
        const loader = document.getElementById('loader');
        if(loader) loader.style.display = 'none';
        const input = document.getElementById('post-input');
        if(input) {
            input.disabled = false;
            input.placeholder = "Enter transmission...";
        }
    }, 2000);

    let id = localStorage.getItem('lc_id') || "ID-" + Math.floor(Math.random()*9999);
    localStorage.setItem('lc_id', id);
    document.getElementById('id-tag').innerText = id;
    
    socket.emit('request_board_history', 'home');
});

function handleSubmit() {
    const input = document.getElementById('post-input');
    if(!input.value.trim()) return;
    
    socket.emit('new_post', {
        text: input.value,
        board: currentBoard,
        userId: localStorage.getItem('lc_id'),
        pfp: localStorage.getItem('lc_pfp') || "https://api.dicebear.com/7.x/identicon/svg?seed=" + localStorage.getItem('lc_id')
    });
    input.value = '';
}

socket.on('load_history', (data) => {
    const feed = document.getElementById('main-feed');
    feed.innerHTML = '';
    data.forEach(p => {
        const html = `<div class="post"><b>${p.userId}:</b> <p>${p.text}</p></div>`;
        feed.insertAdjacentHTML('afterbegin', html);
    });
});
