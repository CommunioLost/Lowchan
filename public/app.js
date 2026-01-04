// Connect to the server
const socket = io();

document.addEventListener("DOMContentLoaded", () => {
    // 1. Generate ID if missing
    let studentId = localStorage.getItem('lowchan_user_id');
    if (!studentId) {
        studentId = "STD-" + Math.floor(10000 + Math.random() * 90000);
        localStorage.setItem('lowchan_user_id', studentId);
    }
    const idDisplay = document.getElementById("user-id");
    if(idDisplay) idDisplay.innerText = studentId;

    // 2. Hide loading bar after a moment
    setTimeout(() => {
        const bar = document.getElementById('loading-bar');
        if(bar) bar.style.opacity = '0';
    }, 500);
});

// --- REAL TIME SOCKET LOGIC ---

// A. LISTEN: When the server sends the full history (on load)
socket.on('load_history', (history) => {
    const container = document.getElementById('postsContainer');
    if(container) {
        container.innerHTML = ''; // Clear current view
        // Loop through history and add them
        history.forEach(post => addPostToScreen(post));
    }
});

// B. LISTEN: When ANYONE (including you) sends a new post
socket.on('receive_post', (postData) => {
    addPostToScreen(postData);
});

// C. ACTION: Submit a post to the server
function submitPost() {
    const input = document.getElementById('postInput');
    const text = input.value.trim();
    const userId = localStorage.getItem('lowchan_user_id') || "STD-00000";

    if(!text) return alert("Cannot send empty data.");

    // Create package
    const postPackage = {
        text: text,
        userId: userId,
        board: window.location.pathname // Tells server which page we are on
    };

    // FIRE TO SERVER
    socket.emit('new_post', postPackage);
    
    // Clear input
    input.value = '';
}

// Helper function to draw the post HTML
function addPostToScreen(post) {
    const container = document.getElementById('postsContainer');
    if(!container) return;

    // Create the HTML string
    const html = `
        <div style="background:rgba(255,255,255,0.1); padding:15px; margin-bottom:12px; border-left:4px solid #fff; border-radius:0 4px 4px 0; animation: flash 1s;">
            <div style="font-size:11px; opacity:0.7; margin-bottom:8px;">
                <span style="font-weight:bold; color:#fff;">Anonymous</span> 
                • ${post.date} 
                • ID: ${post.userId}
            </div>
            <div style="font-size:14px; line-height:1.5; white-space: pre-wrap;">${post.text}</div>
        </div>
    `;

    // Add to top of list
    container.insertAdjacentHTML('afterbegin', html);
}
