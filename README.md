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
- Tombol progres contoh dan atur ulang untuk menyiapkan demo dengan cepat.
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

## Alur demo untuk presentasi

1. Buka **Pengaturan → Muat Contoh**, lalu setujui konfirmasi. Tindakan ini mengganti progres pada browser yang sedang dipakai. Bab Klasifikasi Bilangan akan terlihat selesai (skor 9/10), sedangkan bab Sifat-Sifat Medan berada di soal kuis ketiga.
2. Buka **Dashboard** untuk menunjukkan ringkasan, lalu **Peta Konsep** dan **Koleksi Konsep** untuk melihat status kedua bab tersebut.
3. Klik **Lanjutkan Belajar** dan tunjukkan bahwa kuis bab Sifat-Sifat Medan berlanjut dari posisi terakhir. Muat ulang halaman untuk membuktikan progres tetap tersimpan.
4. Untuk memperlihatkan pengalaman siswa baru, buka **Pengaturan → Atur Ulang**, lalu setujui konfirmasi. Tindakan ini menghapus jawaban dan progres belajar di browser serta mengembalikan data server ke kondisi awal.
5. Dari kondisi awal, buka bab pertama, pelajari materi, jawab kuis, lalu lanjutkan ke penerapan. Evaluasi akhir menyediakan pilihan ganda dan kolom jawaban uraian; nilai uraian tidak dihitung otomatis.

Proyek demo ini belum memakai akun. Progres dikaitkan dengan browser yang digunakan, jadi pakai browser/profil yang sama saat menunjukkan penyimpanan dan pemulihan progres.

## Pemeriksaan kualitas

Jalankan pengujian:

```bash
composer test
npm test
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
- `resources/js/learning-state.js` — aturan progres bab, jawaban kuis, dan data contoh yang diuji otomatis.
- `tests/js/` — tes alur bab, kuis, skor, dan reset progres.
- `resources/css/app.css` — desain dan tampilan responsif.
- `public/images/` — aset visual yang digunakan aplikasi.
- `app/Http/Controllers/` — controller halaman dan progres pembelajaran.
- `app/Models/LearningProgress.php` — model progres belajar.
- `routes/web.php` — route halaman utama dan endpoint progres.

Progres pembelajaran disimpan di tabel `learning_progresses`. `localStorage` dengan key `realification-state` tetap digunakan sebagai cadangan ketika koneksi ke server terganggu.
Tahap terakhir setiap bab juga disimpan sehingga tombol lanjut belajar membuka posisi terakhir. Penilaian otomatis hanya berlaku untuk pilihan ganda; jawaban uraian memerlukan penilaian pengajar.
