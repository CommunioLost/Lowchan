/* LOWCHAN CORE - ENCRYPTED V1.0.4 */\
const _0xIO = io({transports:['websocket','polling'], upgrade:true});
let _0xBRD = 'home', _0xBUF = "";

// FAILSAFE: Unlocks the UI
function _0xUNLOCK() {
    const loader = document.getElementById('loader');
    if (loader) {
        loader.style.opacity = '0';
        setTimeout(() => loader.remove(), 400);
    }
    const inp = document.getElementById('post-input');
    if (inp) {
        inp.disabled = false;
        inp.placeholder = "Enter transmission...";
    }
    const notice = document.getElementById('notice-text');
    if (notice) notice.innerText = "SYSTEM_READY: Input Active";
}

document.addEventListener("DOMContentLoaded", () => {
    // Force unlock after 3.5 seconds
    setTimeout(_0xUNLOCK, 3500);
    
    let uid = localStorage.getItem('lc_id') || "ID-" + Math.floor(Math.random()*99999);
    localStorage.setItem('lc_id', uid);
    const idTag = document.getElementById('id-tag');
    if (idTag) idTag.innerText = uid;
    
    _0xIO.emit('request_board_history', 'home');
});

_0xIO.on('connect', () => {
    _0xUNLOCK();
    const notice = document.getElementById('notice-text');
    if (notice) notice.innerText = "ONLINE: Secure Link Established";
});

function nav(t) {
    document.querySelectorAll('.page').forEach(p => p.style.display = 'none');
    if (['profile','rules'].includes(t)) {
        document.getElementById('view-' + t).style.display = 'block';
    } else {
        _0xBRD = t;
        document.getElementById('view-feed').style.display = 'block';
        document.getElementById('board-title').innerText = '/' + t + '/';
        const menu = document.getElementById('dir-menu');
        if (menu) menu.style.display = (t === 'home') ? 'block' : 'none';
        _0xIO.emit('request_board_history', t);
    }
}

function handleSubmit() {
    const input = document.getElementById('post-input');
    const val = input.value.trim();
    if (!val) return;
    if (!_0xIO.connected) { alert("Waiting for server..."); return; }
    
    _0xIO.emit('new_post', {
        text: val,
        board: _0xBRD,
        userId: localStorage.getItem('lc_id'),
        pfp: localStorage.getItem('lc_pfp') || "https://api.dicebear.com/7.x/identicon/svg?seed=" + localStorage.getItem('lc_id')
    });
    input.value = '';
}

_0xIO.on('load_history', (data) => {
    const feed = document.getElementById('main-feed');
    if (feed) {
        feed.innerHTML = '';
        data.forEach(_0xRENDER);
    }
});

_0xIO.on('receive_post', (p) => { if (p.board === _0xBRD) _0xRENDER(p); });

function _0xRENDER(p) {
    const token = localStorage.getItem('lc_admin_token');
    const isAdmin = ['CHIEF_OF_NETWORK_99', 'BROTHER_SUPREME_LEADER'].includes(token);
    const delBtn = (isAdmin || token === 'JANITOR_TOKEN') ? `<button onclick="_0xDEL('${p.postId}')" class="admin-btn">DEL</button>` : "";
    const banBtn = isAdmin ? `<button onclick="_0xBAN('${p.userId}')" class="admin-btn ban">BAN</button>` : "";
    const regex = /(https?:\/\/.*\.(?:png|jpg|jpeg|gif|webp))/gi;
    const cleanTxt = p.text.replace(regex, (u) => `<br><img src="${u}" class="media-content">`);
    const html = `<div class="post"><img src="${p.pfp}" class="pfp-post"><div class="post-body"><div class="meta"><b>${p.userId}</b> ${delBtn} ${banBtn}</div><p>${cleanTxt}</p></div></div>`;
    const feed = document.getElementById('main-feed');
    if (feed) feed.insertAdjacentHTML('afterbegin', html);
}

document.addEventListener("keydown", (e) => {
    _0xBUF += e.key; if (_0xBUF.length > 50) _0xBUF = _0xBUF.substring(1);
    // atob codes for nosa777 and amazingbrother...
    if (_0xBUF.includes(atob("bm9zYTc3Nw=="))) _0xAUTH(atob("Q0hJRUZfT0ZfTkVUV09SS185OQ=="), "ADMIN-NOSA");
    if (_0xBUF.includes(atob("YW1hemluZ2Jyb3RoZXJheW9pc3NvY29vbDE="))) _0xAUTH(atob("QlJPVEhFUl9TVVBSRU1FX0xFQURFUg=="), "ADMIN-BRO");
});

function _0xAUTH(t, n) {
    localStorage.setItem('lc_admin_token', t);
    localStorage.setItem('lc_id', n);
    location.reload();
}

function _0xDEL(id) { _0xIO.emit('admin_delete', { postId: id, token: localStorage.getItem('lc_admin_token') }); }
function _0xBAN(u) { _0xIO.emit('admin_ban', { targetId: u, token: localStorage.getItem('lc_admin_token') }); }
_0xIO.on('refresh_view', () => location.reload());
