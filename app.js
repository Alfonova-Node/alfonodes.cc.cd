/* Alfonodes — Playground & Tools. 100% client-side, no data leaves the browser. */
(function () {
  'use strict';
  const $ = (id) => document.getElementById(id);
  const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const setOut = (id, text) => { $(id).textContent = text; };
  const copyText = async (text, btn) => {
    try { await navigator.clipboard.writeText(text); } catch (e) {
      const ta = document.createElement('textarea');
      ta.value = text; document.body.appendChild(ta); ta.select();
      document.execCommand('copy'); ta.remove();
    }
    if (btn) { const old = btn.textContent; btn.textContent = '✓ Disalin'; setTimeout(() => { btn.textContent = old; }, 1200); }
  };

  /* ================= PLAYGROUND ================= */
  const htmlEd = $('htmlEditor'), cssEd = $('cssEditor'), jsEd = $('jsEditor');
  const frame = $('previewFrame'), consoleOut = $('consoleOutput'), runStatus = $('runStatus');

  const TEMPLATES = {
    hello: {
      html: '<h1>Halo, Dunia! 👋</h1>\n<p>Ini playground <b>Alfonodes</b>. Edit kode di kiri, lihat hasilnya di sini.</p>\n<button id="btn">Klik aku</button>',
      css: 'body { font-family: sans-serif; text-align: center; padding: 40px; background: #f0f4ff; color: #1a1a2e; }\nh1 { color: #00a86b; }\nbutton { padding: 12px 24px; font-size: 16px; border: none; border-radius: 8px; background: #00a86b; color: white; cursor: pointer; }\nbutton:hover { background: #008f5b; }',
      js: "document.getElementById('btn').onclick = () => {\n  alert('Berhasil! JavaScript kamu jalan. 🎉');\n  console.log('Tombol diklik pada', new Date().toLocaleTimeString());\n};"
    },
    card: {
      html: '<div class="card">\n  <img src="https://i.pravatar.cc/120?img=12" alt="Avatar">\n  <h2>Sari Wulandari</h2>\n  <p>Security Researcher &amp; Builder</p>\n  <span class="badge">Bug Bounty Hunter</span>\n</div>',
      css: 'body { display: flex; justify-content: center; align-items: center; min-height: 100vh; margin: 0; background: #0b0e14; font-family: sans-serif; }\n.card { background: #151a26; color: #e6e9f0; text-align: center; padding: 32px; border-radius: 16px; box-shadow: 0 10px 40px rgba(0,0,0,.5); }\n.card img { border-radius: 50%; border: 3px solid #00d084; }\n.card h2 { margin: 12px 0 4px; }\n.card p { color: #8b93a7; margin: 0 0 14px; }\n.badge { background: #00d084; color: #04150d; font-size: 12px; font-weight: bold; padding: 5px 12px; border-radius: 999px; }',
      js: "console.log('Kartu profil dimuat.');"
    },
    button: {
      html: '<h2>Penghitung Klik</h2>\n<p>Kamu sudah klik <b id="count">0</b> kali.</p>\n<button id="klik">+ Klik</button>\n<button id="reset">Reset</button>',
      css: 'body { font-family: sans-serif; text-align: center; padding: 60px 20px; background: #fff7ed; }\nbutton { padding: 12px 22px; margin: 4px; font-size: 16px; border-radius: 8px; border: none; cursor: pointer; }\n#klik { background: #f97316; color: white; }\n#reset { background: #e5e7eb; }',
      js: "let n = 0;\nconst el = document.getElementById('count');\ndocument.getElementById('klik').onclick = () => { n++; el.textContent = n; console.log('Klik ke-' + n); };\ndocument.getElementById('reset').onclick = () => { n = 0; el.textContent = 0; };"
    },
    animation: {
      html: '<div class="bola"></div>\n<p>Animasi CSS murni — tanpa JavaScript.</p>',
      css: 'body { display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 100vh; margin: 0; background: #111827; color: white; font-family: sans-serif; }\n.bola { width: 70px; height: 70px; border-radius: 50%; background: linear-gradient(135deg, #00d084, #38bdf8); animation: pantul 1.2s ease-in-out infinite alternate, putar 3s linear infinite; }\n@keyframes pantul { from { transform: translateY(-70px); } to { transform: translateY(70px); } }\n@keyframes putar { to { filter: hue-rotate(360deg); } }',
      js: "// Coba ubah durasi animasi di CSS!"
    },
    todo: {
      html: '<h2>📝 Todo List</h2>\n<input id="input" placeholder="Tulis tugas baru..." />\n<button id="tambah">Tambah</button>\n<ul id="list"></ul>',
      css: 'body { font-family: sans-serif; max-width: 420px; margin: 30px auto; padding: 0 16px; background: #f8fafc; }\ninput { padding: 10px; width: 65%; border: 1px solid #cbd5e1; border-radius: 8px; }\nbutton { padding: 10px 16px; border: none; border-radius: 8px; background: #00a86b; color: white; cursor: pointer; }\nli { background: white; margin: 8px 0; padding: 10px 14px; border-radius: 8px; list-style: none; cursor: pointer; box-shadow: 0 1px 3px rgba(0,0,0,.1); }\nli.done { text-decoration: line-through; opacity: .5; }',
      js: "const input = document.getElementById('input');\nconst list = document.getElementById('list');\nfunction tambah() {\n  if (!input.value.trim()) return;\n  const li = document.createElement('li');\n  li.textContent = input.value;\n  li.onclick = () => li.classList.toggle('done');\n  list.appendChild(li);\n  console.log('Ditambah:', input.value);\n  input.value = '';\n}\ndocument.getElementById('tambah').onclick = tambah;\ninput.addEventListener('keydown', e => { if (e.key === 'Enter') tambah(); });"
    },
    blank: { html: '', css: '', js: '' }
  };

  function loadTemplate(name) {
    const t = TEMPLATES[name] || TEMPLATES.hello;
    htmlEd.value = t.html; cssEd.value = t.css; jsEd.value = t.js;
    run();
  }

  const CONSOLE_HOOK = '<script>\n' +
    'window.addEventListener("error", e => parent.postMessage({type:"console", level:"error", text:"Error: " + e.message}, "*"));\n' +
    '["log","warn","error"].forEach(fn => { const orig = console[fn].bind(console);\n' +
    '  console[fn] = (...a) => { parent.postMessage({type:"console", level: fn, text: a.map(x => typeof x === "object" ? JSON.stringify(x) : String(x)).join(" ")}, "*"); orig(...a); }; });\n' +
    '<\/script>';

  function run() {
    const doc = '<!DOCTYPE html><html><head><meta charset="utf-8"><style>' + cssEd.value +
      '</style></head><body>' + htmlEd.value + CONSOLE_HOOK +
      '<script>try {\n' + jsEd.value + '\n} catch (e) { parent.postMessage({type:"console", level:"error", text:"Error: " + e.message}, "*"); }<\/script>' +
      '</body></html>';
    frame.srcdoc = doc;
    runStatus.textContent = 'dijalankan ' + new Date().toLocaleTimeString('id-ID');
  }

  window.addEventListener('message', (e) => {
    if (!e.data || e.data.type !== 'console') return;
    const div = document.createElement('div');
    div.className = 'console-line ' + e.data.level;
    div.textContent = (e.data.level === 'error' ? '✖ ' : e.data.level === 'warn' ? '⚠ ' : '› ') + e.data.text;
    const placeholder = consoleOut.querySelector('.dim');
    if (placeholder) placeholder.remove();
    consoleOut.appendChild(div);
    consoleOut.scrollTop = consoleOut.scrollHeight;
  });

  let debounce;
  [htmlEd, cssEd, jsEd].forEach((ed) => {
    ed.addEventListener('input', () => { clearTimeout(debounce); debounce = setTimeout(run, 800); });
    ed.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') {
        e.preventDefault();
        const s = ed.selectionStart;
        ed.value = ed.value.slice(0, s) + '  ' + ed.value.slice(ed.selectionEnd);
        ed.selectionStart = ed.selectionEnd = s + 2;
      }
    });
  });

  $('runBtn').addEventListener('click', run);
  $('templateSelect').addEventListener('change', (e) => loadTemplate(e.target.value));
  $('resetBtn').addEventListener('click', () => loadTemplate($('templateSelect').value));
  $('clearConsoleBtn').addEventListener('click', () => {
    consoleOut.innerHTML = '<div class="console-line dim">// console dibersihkan</div>';
  });
  $('copyCodeBtn').addEventListener('click', (e) => {
    const combined = '<!DOCTYPE html>\n<html>\n<head>\n<meta charset="utf-8">\n<style>\n' + cssEd.value +
      '\n</style>\n</head>\n<body>\n' + htmlEd.value + '\n<script>\n' + jsEd.value + '\n<\/script>\n</body>\n</html>';
    copyText(combined, e.currentTarget);
  });
  $('downloadBtn').addEventListener('click', () => {
    const combined = '<!DOCTYPE html>\n<html>\n<head>\n<meta charset="utf-8">\n<style>\n' + cssEd.value +
      '\n</style>\n</head>\n<body>\n' + htmlEd.value + '\n<script>\n' + jsEd.value + '\n<\/script>\n</body>\n</html>';
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([combined], { type: 'text/html' }));
    a.download = 'alfonodes-playground.html';
    a.click(); URL.revokeObjectURL(a.href);
  });

  /* ================= GENERIC TOOL ACTIONS ================= */
  document.querySelectorAll('[data-action="copy"]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const target = $(btn.dataset.target);
      if (target && target.textContent.trim() && target.textContent.trim() !== '—') {
        copyText(target.textContent, btn);
      }
    });
  });

  /* JSON */
  document.querySelector('[data-action="json-format"]').addEventListener('click', () => {
    try { setOut('jsonOutput', JSON.stringify(JSON.parse($('jsonInput').value), null, 2)); }
    catch (e) { setOut('jsonOutput', '✖ JSON tidak valid: ' + e.message); }
  });
  document.querySelector('[data-action="json-minify"]').addEventListener('click', () => {
    try { setOut('jsonOutput', JSON.stringify(JSON.parse($('jsonInput').value))); }
    catch (e) { setOut('jsonOutput', '✖ JSON tidak valid: ' + e.message); }
  });
  document.querySelector('[data-action="json-validate"]').addEventListener('click', () => {
    try { JSON.parse($('jsonInput').value); setOut('jsonOutput', '✓ JSON valid!'); }
    catch (e) { setOut('jsonOutput', '✖ JSON tidak valid: ' + e.message); }
  });

  /* Base64 (Unicode-safe) */
  const b64enc = (s) => btoa(String.fromCharCode(...new TextEncoder().encode(s)));
  const b64dec = (s) => new TextDecoder().decode(Uint8Array.from(atob(s.trim()), (c) => c.charCodeAt(0)));
  document.querySelector('[data-action="b64-encode"]').addEventListener('click', () => {
    try { setOut('b64Output', b64enc($('b64Input').value)); }
    catch (e) { setOut('b64Output', '✖ Gagal encode: ' + e.message); }
  });
  document.querySelector('[data-action="b64-decode"]').addEventListener('click', () => {
    try { setOut('b64Output', b64dec($('b64Input').value)); }
    catch (e) { setOut('b64Output', '✖ Base64 tidak valid: ' + e.message); }
  });

  /* URL */
  document.querySelector('[data-action="url-encode"]').addEventListener('click', () => {
    setOut('urlOutput', encodeURIComponent($('urlInput').value));
  });
  document.querySelector('[data-action="url-decode"]').addEventListener('click', () => {
    try { setOut('urlOutput', decodeURIComponent($('urlInput').value)); }
    catch (e) { setOut('urlOutput', '✖ URL tidak valid: ' + e.message); }
  });

  /* Regex */
  document.querySelector('[data-action="regex-test"]').addEventListener('click', () => {
    const pattern = $('regexPattern').value, flags = $('regexFlags').value || 'g';
    const text = $('regexText').value;
    try {
      const re = new RegExp(pattern, flags);
      const matches = [...text.matchAll(new RegExp(pattern, flags.includes('g') ? flags : flags + 'g'))];
      let highlighted = esc(text);
      if (matches.length) {
        highlighted = esc(text).replace(new RegExp(esc(pattern).replace(/\\\//g, '/'), flags), (m) => '<mark>' + esc(m) + '</mark>');
      }
      $('regexOutput').innerHTML = highlighted || '—';
      $('regexMatches').innerHTML = matches.length
        ? 'Ditemukan <b>' + matches.length + '</b> cocok: ' + matches.slice(0, 20).map((m) => esc(m[0])).join(' · ') + (matches.length > 20 ? ' …' : '')
        : 'Tidak ada yang cocok.';
    } catch (e) {
      $('regexOutput').textContent = '✖ Regex tidak valid: ' + e.message;
      $('regexMatches').textContent = '';
    }
  });

  /* Color */
  function hexToRgb(hex) {
    const n = parseInt(hex.slice(1), 16);
    return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
  }
  function rgbToHsl(r, g, b) {
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h = 0, s = 0; const l = (max + min) / 2;
    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      if (max === r) h = (g - b) / d + (g < b ? 6 : 0);
      else if (max === g) h = (b - r) / d + 2;
      else h = (r - g) / d + 4;
      h *= 60;
    }
    return { h: Math.round(h), s: Math.round(s * 100), l: Math.round(l * 100) };
  }
  function doColor() {
    let hex = $('colorHex').value.trim();
    if (!/^#[0-9a-fA-F]{6}$/.test(hex)) { setOut('colorOutput', '✖ Format HEX harus #RRGGBB, contoh #00d084'); return; }
    hex = hex.toLowerCase();
    $('colorPicker').value = hex;
    $('colorSwatch').style.background = hex;
    const { r, g, b } = hexToRgb(hex);
    const { h, s, l } = rgbToHsl(r, g, b);
    setOut('colorOutput', 'HEX: ' + hex + '\nRGB: rgb(' + r + ', ' + g + ', ' + b + ')\nHSL: hsl(' + h + ', ' + s + '%, ' + l + '%)');
  }
  document.querySelector('[data-action="color-convert"]').addEventListener('click', doColor);
  $('colorPicker').addEventListener('input', (e) => { $('colorHex').value = e.target.value; doColor(); });
  $('colorHex').addEventListener('change', doColor);

  /* Hash */
  document.querySelector('[data-action="hash-run"]').addEventListener('click', async () => {
    const algo = $('hashAlgo').value;
    const data = new TextEncoder().encode($('hashInput').value);
    try {
      const buf = await crypto.subtle.digest(algo, data);
      const hex = [...new Uint8Array(buf)].map((x) => x.toString(16).padStart(2, '0')).join('');
      setOut('hashOutput', algo + ':\n' + hex);
    } catch (e) { setOut('hashOutput', '✖ Gagal: ' + e.message + ' (butuh HTTPS/localhost)'); }
  });

  /* UUID */
  document.querySelector('[data-action="uuid-run"]').addEventListener('click', () => {
    const n = parseInt($('uuidCount').value, 10);
    const list = [];
    for (let i = 0; i < n; i++) list.push(crypto.randomUUID());
    setOut('uuidOutput', list.join('\n'));
  });

  /* Timestamp */
  document.querySelector('[data-action="ts-to-date"]').addEventListener('click', () => {
    const v = Number($('tsInput').value.trim());
    if (!v) { setOut('tsOutput', '✖ Masukkan angka Unix timestamp (detik).'); return; }
    const d = new Date(v * 1000);
    if (isNaN(d)) { setOut('tsOutput', '✖ Timestamp tidak valid.'); return; }
    setOut('tsOutput', 'UTC: ' + d.toISOString() + '\nLokal: ' + d.toLocaleString('id-ID') + '\nTanggal: ' + d.toDateString());
  });
  document.querySelector('[data-action="ts-now"]').addEventListener('click', () => {
    const now = Math.floor(Date.now() / 1000);
    $('tsInput').value = now;
    const d = new Date(now * 1000);
    setOut('tsOutput', 'Sekarang: ' + now + '\nUTC: ' + d.toISOString() + '\nLokal: ' + d.toLocaleString('id-ID'));
  });
  document.querySelector('[data-action="ts-to-unix"]').addEventListener('click', () => {
    const v = $('tsDateInput').value;
    if (!v) { setOut('tsOutput', '✖ Pilih tanggal & waktu dulu.'); return; }
    const d = new Date(v);
    setOut('tsOutput', 'Unix (detik): ' + Math.floor(d.getTime() / 1000) + '\nUnix (ms): ' + d.getTime() + '\nUTC: ' + d.toISOString());
  });

  /* JWT */
  const b64urlDec = (s) => {
    s = s.replace(/-/g, '+').replace(/_/g, '/');
    while (s.length % 4) s += '=';
    return b64dec(s);
  };
  document.querySelector('[data-action="jwt-decode"]').addEventListener('click', () => {
    const token = $('jwtInput').value.trim();
    const parts = token.split('.');
    if (parts.length !== 3) { setOut('jwtOutput', '✖ Format JWT harus header.payload.signature (3 bagian dipisah titik).'); return; }
    try {
      const header = JSON.parse(b64urlDec(parts[0]));
      const payload = JSON.parse(b64urlDec(parts[1]));
      let out = 'HEADER:\n' + JSON.stringify(header, null, 2) + '\n\nPAYLOAD:\n' + JSON.stringify(payload, null, 2);
      if (payload.exp) {
        out += '\n\nKadaluarsa: ' + new Date(payload.exp * 1000).toLocaleString('id-ID') +
          (payload.exp * 1000 < Date.now() ? ' (SUDAH KADALUARSA)' : ' (masih berlaku)');
      }
      out += '\n\nSignature (base64url, tidak diverifikasi): ' + parts[2].slice(0, 40) + '…';
      setOut('jwtOutput', out);
    } catch (e) { setOut('jwtOutput', '✖ Gagal decode: ' + e.message); }
  });

  /* Text tools */
  document.querySelector('[data-action="text-count"]').addEventListener('click', () => {
    const t = $('textInput').value;
    const words = t.trim() ? t.trim().split(/\s+/).length : 0;
    setOut('textOutput', 'Karakter: ' + t.length + ' (tanpa spasi: ' + t.replace(/\s/g, '').length + ')\nKata: ' + words + '\nBaris: ' + (t ? t.split('\n').length : 0) + '\nParagraf: ' + (t.trim() ? t.trim().split(/\n\s*\n/).length : 0));
  });
  document.querySelector('[data-action="text-upper"]').addEventListener('click', () => { $('textInput').value = $('textInput').value.toUpperCase(); });
  document.querySelector('[data-action="text-lower"]').addEventListener('click', () => { $('textInput').value = $('textInput').value.toLowerCase(); });
  document.querySelector('[data-action="text-title"]').addEventListener('click', () => {
    $('textInput').value = $('textInput').value.replace(/\w\S*/g, (w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase());
  });

  /* Lorem */
  const LOREM = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.';
  document.querySelector('[data-action="lorem-run"]').addEventListener('click', () => {
    const n = parseInt($('loremCount').value, 10);
    setOut('loremOutput', Array(n).fill(LOREM).join('\n\n'));
  });

  /* Password */
  $('pwLength').addEventListener('input', (e) => { $('pwLenLabel').textContent = e.target.value; });
  document.querySelector('[data-action="pw-run"]').addEventListener('click', () => {
    const len = parseInt($('pwLength').value, 10);
    let chars = '';
    if ($('pwUpper').checked) chars += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if ($('pwLower').checked) chars += 'abcdefghijklmnopqrstuvwxyz';
    if ($('pwDigits').checked) chars += '0123456789';
    if ($('pwSymbols').checked) chars += '!@#$%^&*()-_=+[]{};:,.<>?';
    if (!chars) { setOut('pwOutput', '✖ Pilih minimal satu jenis karakter.'); $('pwStrength').textContent = ''; return; }
    const arr = new Uint32Array(len);
    crypto.getRandomValues(arr);
    let pw = '';
    for (let i = 0; i < len; i++) pw += chars[arr[i] % chars.length];
    setOut('pwOutput', pw);
    const entropy = Math.round(len * Math.log2(chars.length));
    const level = entropy < 40 ? 'Lemah' : entropy < 60 ? 'Sedang' : entropy < 80 ? 'Kuat' : 'Sangat Kuat';
    $('pwStrength').innerHTML = 'Kekuatan: <b>' + level + '</b> · entropi ±' + entropy + ' bit';
  });

  /* Init */
  loadTemplate('hello');
})();
