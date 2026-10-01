# Realification

Realification adalah aplikasi pembelajaran interaktif untuk membantu pengguna memahami Sistem Bilangan Real melalui peta konsep, materi visual, tantangan, dan latihan penerapan.

## Fitur

- Dashboard dan ringkasan progres belajar.
- Peta konsep Sistem Bilangan Real.
- Empat bab modul: klasifikasi bilangan, sifat medan, sifat urutan, serta eksponen dan bentuk akar.
- Empat puluh soal kuis bab dengan umpan balik dan target penguasaan 80.
- Evaluasi akhir berisi 20 pilihan ganda dan 4 soal uraian.
- Contoh, aktivitas, rangkuman, refleksi, dan penerapan konsep.
- Concept Collection dengan filter status.
- Profil, pengaturan, dan penyimpanan progres lokal.
- Tampilan responsif untuk desktop dan perangkat seluler.

## Teknologi

- PHP 8.2 dan Laravel 12
- JavaScript
- CSS
- Vite

## Menjalankan proyek

Siapkan aplikasi untuk pertama kali:

```bash
composer run setup
```

Jalankan lingkungan pengembangan:

```bash
composer run dev
```

Kemudian buka alamat yang ditampilkan oleh Laravel, biasanya `http://127.0.0.1:8000`.

## Pemeriksaan kualitas

Jalankan pengujian:

```bash
composer test
```

Buat build produksi:

```bash
npm run build
```

## Struktur utama

- `resources/views/welcome.blade.php` — kerangka halaman aplikasi.
- `resources/js/app.js` — navigasi, state, dan interaksi pembelajaran.
- `resources/css/app.css` — desain dan tampilan responsif.
- `public/images/` — aset visual yang digunakan aplikasi.
- `routes/web.php` — route halaman utama.

Progres pembelajaran saat ini disimpan di `localStorage` browser dengan key `realification-state`.
