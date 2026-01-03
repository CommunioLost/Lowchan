// app.js
document.addEventListener("DOMContentLoaded", () => {
    
    // 1. Generate Student ID (The "Anon" ID)
    const studentId = "STD-" + Math.floor(Math.random() * 99999);
    document.getElementById("user-id").innerText = studentId;

    // 2. Check if we are on a specific board page
    const params = new URLSearchParams(window.location.search);
    const boardCode = params.get("b");

    if (boardCode) {
        // We are on a board page! Change title dynamically
        document.title = `/${boardCode}/ - Lowchan Student Net`;
        // In a real app, you would fetch posts for 'boardCode' here
        console.log(`Loading posts for board: ${boardCode}`);
    }
});
