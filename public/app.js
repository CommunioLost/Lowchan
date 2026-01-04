// GLOBAL LOGIC
document.addEventListener("DOMContentLoaded", () => {
    // 1. Generate/Retrieve Student ID
    let studentId = localStorage.getItem('lowchan_user_id');
    if (!studentId) {
        studentId = "STD-" + Math.floor(10000 + Math.random() * 90000);
        localStorage.setItem('lowchan_user_id', studentId);
    }
    
    const idDisplay = document.getElementById("user-id");
    if(idDisplay) idDisplay.innerText = studentId;

    // 2. Initialize the Feed
    displayPosts();

    // 3. Hide loading bar
    setTimeout(() => {
        const bar = document.getElementById('loading-bar');
        if(bar) bar.style.opacity = '0';
    }, 500);
});

// POSTING SYSTEM LOGIC
function displayPosts() {
    const container = document.getElementById('postsContainer');
    if(!container) return;

    const posts = JSON.parse(localStorage.getItem('lowchan_posts')) || [];
    
    if (posts.length === 0) {
        container.innerHTML = '<p style="text-align:center; opacity:0.5;">No network activity detected.</p>';
        return;
    }

    container.innerHTML = posts.map(post => `
        <div style="background:rgba(255,255,255,0.1); padding:15px; margin-bottom:12px; border-left:4px solid #fff; border-radius:0 4px 4px 0;">
            <div style="font-size:11px; opacity:0.7; margin-bottom:8px;">
                <span style="font-weight:bold; color:#fff;">Anonymous</span> 
                • ${post.date} 
                • ID: ${post.userId}
            </div>
            <div style="font-size:14px; line-height:1.5; white-space: pre-wrap;">${post.text}</div>
        </div>
    `).reverse().join('');
}

function submitPost() {
    const input = document.getElementById('postInput');
    const text = input.value.trim();
    const userId = localStorage.getItem('lowchan_user_id') || "STD-00000";

    if(!text) {
        alert("System Error: Cannot broadcast empty payload.");
        return;
    }

    const posts = JSON.parse(localStorage.getItem('lowchan_posts')) || [];
    const newPost = {
        text: text,
        date: new Date().toLocaleString(),
        userId: userId,
        timestamp: Date.now()
    };

    posts.push(newPost);
    
    // Keep only the last 50 posts to keep it fast
    if(posts.length > 50) posts.shift();

    localStorage.setItem('lowchan_posts', JSON.stringify(posts));
    
    input.value = ''; // Clear the box
    displayPosts();   // Refresh the view
}
