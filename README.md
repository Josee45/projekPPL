# Realification

Realification adalah aplikasi pembelajaran interaktif untuk membantu pengguna memahami Sistem Bilangan Real melalui peta konsep, materi visual, tantangan, dan latihan penerapan.

## Fitur

- Dashboard dan ringkasan progres belajar.
- Peta konsep Sistem Bilangan Real.
- Empat bab modul: klasifikasi bilangan, sifat medan, sifat urutan, serta eksponen dan bentuk akar.
- Empat puluh soal kuis bab dengan umpan balik dan target penguasaan 80.
- Evaluasi akhir berisi 20 pilihan ganda dan 4 soal uraian dengan kolom jawaban tersimpan otomatis.
- Contoh, aktivitas, rangkuman, refleksi, dan penerapan konsep.
- Koleksi Konsep dengan filter status yang mengikuti progres belajar.
- Profil, pengaturan, dan sinkronisasi progres ke database dengan cadangan lokal.
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

- `resources/views/welcome.blade.php` — konten shell aplikasi pembelajaran.
- `resources/views/layouts/` — layout utama aplikasi dan halaman error.
- `resources/views/partials/` — sidebar dan topbar yang dapat dirawat terpisah.
- `resources/views/errors/` — halaman 404, 419, dan 500 khusus Realification.
- `resources/js/app.js` — navigasi, state, interaksi, dan sinkronisasi progres.
- `resources/css/app.css` — desain dan tampilan responsif.
- `public/images/` — aset visual yang digunakan aplikasi.
- `app/Http/Controllers/` — controller halaman dan progres pembelajaran.
- `app/Models/LearningProgress.php` — model progres belajar.
- `routes/web.php` — route halaman utama dan endpoint progres.

Progres pembelajaran disimpan di tabel `learning_progresses`. `localStorage` dengan key `realification-state` tetap digunakan sebagai cadangan ketika koneksi ke server terganggu.
Tahap terakhir setiap bab juga disimpan sehingga tombol lanjut belajar membuka posisi terakhir. Penilaian otomatis hanya berlaku untuk pilihan ganda; jawaban uraian memerlukan penilaian pengajar.
