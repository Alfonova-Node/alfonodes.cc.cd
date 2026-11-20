# Alfonodes — Playground & Tools untuk Programmer

Website statis (HTML + CSS + JavaScript murni, tanpa build step, tanpa backend) untuk
**alfonodes.cc.cd**.

## Isi

- **Live Playground** — editor HTML/CSS/JS dengan live preview (iframe `srcdoc`),
  console capture, 6 template, salin & unduh kode sebagai satu file `.html`.
- **12 tools client-side** (semua proses di browser, tanpa data keluar):
  JSON Formatter, Base64, URL Encode/Decode, Regex Tester, Color Converter,
  Hash Generator (SHA-1/256/384/512), UUID Generator, Timestamp Converter,
  JWT Decoder, Text Tools, Lorem Ipsum, Password Generator.

## Menjalankan lokal

```bash
cd alfonodes-site
python3 -m http.server 8080
# buka http://localhost:8080
```

## Deploy (GitHub Pages)

Repo: `Alfonova-Node/alfonodes.cc.cd` (branch `main`, folder `/`).
File `CNAME` berisi `alfonodes.cc.cd` supaya GitHub Pages memakai domain kustom.
DNS di Cloudflare: `CNAME alfonodes.cc.cd → alfonova-node.github.io` (proxied boleh).
HTTPS diaktifkan otomatis oleh GitHub setelah DNS mengarah.
