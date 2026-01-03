// app.js
const UI = {
    boot() {
        this.runBootSequence();
        this.initClock();
        this.renderInitialState();
    },

    async runBootSequence() {
        const bar = document.getElementById('load-bar');
        const log = document.getElementById('boot-log');
        const steps = ["MAPPING_DOM", "ESTABLISHING_SOCKET", "SYNCING_THREADS"];
        
        for (let i = 0; i <= 100; i += 10) {
            bar.style.width = `${i}%`;
            if (i % 30 === 0) log.innerHTML += `<p>> [OK] ${steps[i/30] || 'READY'}</p>`;
            await new Promise(r => setTimeout(r, 100));
        }
        document.getElementById('loader').style.opacity = '0';
        setTimeout(() => document.getElementById('loader').remove(), 500);
    },

    generateAnonID() {
        // Creates a consistent but anonymous visual hash for the user
        const fingerprint = navigator.userAgent.length + window.screen.width;
        return `anon_${Math.abs(fingerprint % 9999).toString(16).padStart(4, '0')}`;
    },

    renderPost(data) {
        const template = `
            <article class="post-card" id="p-${data.id}" data-author="${data.authorID}">
                <header class="post-meta">
                    <span class="anon-id" style="color: ${this.getHashColor(data.authorID)}">
                        ID: ${data.authorID}
                    </span>
                    <time>${new Date().toLocaleTimeString()}</time>
                </header>
                <section class="post-body">
                    ${data.content}
                </section>
                <footer class="post-actions">
                    <button class="text-btn">REPLY</button>
                    <button class="text-btn">REPORT</button>
                </footer>
            </article>
        `;
        document.getElementById('thread-container').insertAdjacentHTML('afterbegin', template);
    },

    getHashColor(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) hash = str.charCodeAt(i) + ((hash << 5) - hash);
        return `hsl(${hash % 360}, 70%, 70%)`;
    }
};

UI.boot();
window.UI = UI; // Expose to HTML listeners
