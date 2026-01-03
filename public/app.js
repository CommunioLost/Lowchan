document.addEventListener("DOMContentLoaded", () => {
    
    // 1. Generate Fake Student ID
    const studentId = "STD-" + Math.floor(Math.random() * 99999);
    const idSpan = document.getElementById("user-id");
    if(idSpan) idSpan.innerText = studentId;

    // 2. CHECK: Are we on the Board Page?
    const params = new URLSearchParams(window.location.search);
    const boardCode = params.get("b");

    if (boardCode) {
        // We are on board.html!
        setupBoard(boardCode);
    }
});

function setupBoard(code) {
    // Dictionary of board names
    const boards = {
        'math': 'Mathematics',
        'sci': 'Science & Biology',
        'lit': 'Literature',
        'v': 'Video Games',
        'a': 'Anime & Manga',
        'fit': 'Fitness & Health',
        'b': 'Random'
    };

    const boardName = boards[code] || 'Unknown Board';
    
    // Update Title
    document.title = `/${code}/ - ${boardName}`;
    document.getElementById('board-name-display').innerText = `/${code}/`;
    document.getElementById('board-title').innerText = `/${code}/ - ${boardName}`;

    // Inject Fake Posts (Simulation)
    const container = document.getElementById('thread-stream');
    container.innerHTML = ''; // Clear loading text

    for(let i=0; i<5; i++) {
        container.innerHTML += `
            <div style="background: rgba(255,255,255,0.1); padding: 15px; margin-bottom: 15px; border: 1px solid rgba(255,255,255,0.2);">
                <div style="font-size: 11px; opacity: 0.7; margin-bottom: 5px;">
                    <span style="color: #89cff0; font-weight: bold;">Anonymous</span> 
                    • 01/03/26(Sat)14:${Math.floor(Math.random()*60)} 
                    • No.${Math.floor(Math.random()*999999)}
                </div>
                <div style="font-size: 14px;">
                    <span style="color: #a0c0ff; font-weight: bold;">Topic ${i+1}:</span> 
                    This is a sample thread on the /${code}/ board. 
                    Does anyone have the notes for next week's exam?
                </div>
            </div>
        `;
    }
}
