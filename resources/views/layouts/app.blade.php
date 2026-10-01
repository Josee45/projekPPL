<!DOCTYPE html>
<html lang="id">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="theme-color" content="#172b4d">
        <meta name="csrf-token" content="{{ csrf_token() }}">
        <meta name="description" content="Realification adalah ruang belajar interaktif untuk memahami Sistem Bilangan Real melalui materi, peta konsep, latihan, dan evaluasi.">
        <title>@yield('title', 'Realification')</title>
        @vite(['resources/css/app.css', 'resources/js/app.js'])
        @stack('head')
    </head>
    <body>
        <a class="skip-link" href="#page">Lewati ke konten utama</a>

        @yield('content')

        <noscript>
            <div class="noscript-notice" role="alert">
                JavaScript diperlukan untuk membuka materi interaktif Realification. Aktifkan JavaScript, lalu muat ulang halaman ini.
            </div>
        </noscript>
    </body>
</html>
