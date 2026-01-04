const socket = io(); // Connects to the real-time server

document.addEventListener("DOMContentLoaded", () => {
    let studentId = localStorage.getItem('lowchan_user_id');
    if (!studentId) {
        studentId = "STD-" + Math.floor(10000 + Math.random() * 90000);
        localStorage.setItem('lowchan_user_id', studentId);
    }
    const idDisplay = document.getElementById("user-id");
    if(idDisplay) idDisplay.innerText = studentId;

    setTimeout(() => {
        const bar = document.getElementById('loading-bar');
        if(bar) bar.style.opacity = '0';
    }, 500);
});

// Load the server history when joining
socket.on('load_history', (history) => {
    const container = document.getElementById('postsContainer');
    if(container) {
        container.innerHTML = '';
        history.forEach(post => addPostToScreen(post));
    }
});

// Listen for new posts from ANYONE
socket.on('receive_post', (postData) => {
    addPostToScreen(postData);
});

function submitPost() {
    const input = document.getElementById('postInput');
    const text = input.value.trim();
    const userId = localStorage.getItem('lowchan_user_id') || "STD-00000";

    if(!text) return alert("Write something first!");

    const postPackage = {
        text: text,
        userId: userId
    };

    socket.emit('new_post', postPackage);
    input.value = '';
}

function addPostToScreen(post) {
    const container = document.getElementById('postsContainer');
    if(!container) return;

    const html = `
        <div style="background:rgba(255,255,255,0.1); padding:15px; margin-bottom:12px; border-left:4px solid #fff; border-radius:0 4px 4px 0;">
            <div style="font-size:11px; opacity:0.7; margin-bottom:8px;">
                <span style="font-weight:bold; color:#fff;">Anonymous</span> 
                • ${post.date} • ID: ${post.userId}
            </div>
            <div style="font-size:14px; line-height:1.5;">${post.text}</div>
        </div>
    `;
    container.insertAdjacentHTML('afterbegin', html);
}
