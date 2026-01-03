// app.js
const UI = {
    boot() {
        this.simulateBoot();
        this.startClock();
        this.generateContent();
    },

    simulateBoot() {
        const stream = document.getElementById('boot-stream');
        const bar = document.getElementById('boot-bar');
        const logs = [
            "CHECKING_STORAGE_SHARDS...", "CONNECTING_PEERS...",
            "DECRYPTING_COMMUNITY_MANIFEST...", "MOUNTING_FILESYSTEM...",
            "SUCCESS: LOWCHAN_CORE_ONLINE"
        ];

        let i = 0;
        const interval = setInterval(() => {
            if (i < logs.length) {
                stream.innerHTML += `<div>> ${logs[i]}</div>`;
                bar.style.width = `${(i + 1) * 20}%`;
                i++;
            } else {
                clearInterval(interval);
                setTimeout(() => document.getElementById('boot-shroud').style.display = 'none', 500);
            }
        }, 300);
    },

    generateContent() {
        const feed = document.getElementById('feed');
        // Pre-populate with dummy "busy" data
        for (let i = 0; i < 15; i++) {
            feed.innerHTML += `
                <article class="post-item">
                    <div class="post-meta">
                        <span class="p-id">ID: ${Math.random().toString(16).substr(2, 6)}</span>
                        <span class="p-date">2026-01-03 16:59:13</span>
                    </div>
                    <div class="post-title">SECURE_IMAGE_TRANSFER_NODE_${i}</div>
                    <div class="post-preview">Information density test... [REDACTED] ... encrypted_payload.bin</div>
                    <div class="post-footer">REPLIES: ${Math.floor(Math.random()*50)} | VIEWS: ${Math.floor(Math.random()*1000)}</div>
                </article>
            `;
        }
    },

    startClock() {
        setInterval(() => {
            const now = new Date();
            document.getElementById('clock').innerText = 
                `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}:${Math.floor(Math.random()*99)}`;
        }, 100);
    }
};

window.onload = () => UI.boot();
