const socket = io();
let currentUser = {
    pfp: 'anon.png',
    style: 'border: 2px solid cyan;',
    hasSeenTutorial: localStorage.getItem('lowchan_tut')
};

// --- ROUTING SYSTEM ---
function navigate(path) {
    const container = document.getElementById('view-container');
    
    if (path === '/') {
        container.innerHTML = `<h1>Welcome Home</h1><p>Select a community to start.</p>`;
    } 
    else if (path.startsWith('/c/')) {
        const board = path.split('/')[2];
        renderBoard(board);
    } 
    else if (path === '/donate') {
        container.innerHTML = `
            <div class="glass card">
                <h2>Support Lowchan</h2>
                <p>We are 100% anonymous. Help us stay online.</p>
                <a href="https://paypal.me/yourlink" class="btn">Donate via PayPal</a>
            </div>`;
    } 
    else {
        // 404 PAGE
        container.innerHTML = `<h1>404</h1><p>This board doesn't exist... yet.</p>`;
    }
}

// --- TUTORIAL LOGIC ---
window.onload = () => {
    // Hide loading screen after 1.5s
    setTimeout(() => {
        document.getElementById('loading-screen').classList.add('hidden');
        if (!currentUser.hasSeenTutorial) {
            document.getElementById('tutorial').classList.remove('hidden');
        }
    }, 1500);
    navigate(window.location.pathname);
};

function nextTutStep() {
    localStorage.setItem('lowchan_tut', 'true');
    document.getElementById('tutorial').classList.add('hidden');
}
