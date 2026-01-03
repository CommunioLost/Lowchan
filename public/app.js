// app.js

// 1. The "Fake PHP" Loading Delay
window.onload = function() {
    setTimeout(() => {
        // Remove the loading text instantly (no fade out)
        document.getElementById('loading-state').style.display = 'none';
        
        // Snap content in
        renderThreads();
    }, 450); // 450ms is the sweet spot for "Server thinking"
};

// 2. The Content Generator
function renderThreads() {
    const container = document.getElementById('thread-container');
    
    // We generate "heavy" content: lots of text, IDs, dates
    const threadHTML = `
        <div class="thread" id="t10492">
            <div class="post-container op">
                <div class="file-info">File: <a href="#">image_192.jpg</a> (44KB, 600x600)</div>
                <div class="post-meta">
                    <span class="subject">Regarding the new API</span> 
                    <span class="name">Anonymous</span> 
                    <span>01/03/26(Sat)17:42:15</span> 
                    <span class="id-tag">ID: 8f92a1</span> 
                    <a href="#">No.10492</a>
                </div>
                <div class="post-message">
                    Is anyone else noticing the latency on the socket connection?<br>
                    <span class="greentext">>be me</span><br>
                    <span class="greentext">>try to upload payload</span><br>
                    <span class="greentext">>server hangs</span><br>
                    I think the node cluster is desyncing again.
                </div>
            </div>

            <div class="post-container">
                <div class="reply">
                    <div class="post-meta">
                        <span class="name">Anonymous</span> 
                        <span>01/03/26(Sat)17:44:02</span> 
                        <span class="id-tag">ID: b2c001</span> 
                        <a href="#">No.10495</a>
                    </div>
                    <div class="post-message">
                        <a href="#t10492" class="quote-link">>>10492</a><br>
                        It's working fine for me. Check your handshake headers.
                    </div>
                </div>
            </div>
        </div>
        <hr>
    `;

    // Duplicate for density
    container.innerHTML = threadHTML.repeat(4);
}

// 3. User Identity (Invisible to user, but distinct)
const userHash = Math.random().toString(36).substring(2, 8);
console.log("Your Session ID (Hidden):", userHash);
