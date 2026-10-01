<!DOCTYPE html>
<html lang="id">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="theme-color" content="#172942">
        <title>Realification - Sistem Bilangan Real</title>
        @vite(['resources/css/app.css', 'resources/js/app.js'])
    </head>
    <body>
        <div class="app" id="app">
            <aside class="sidebar" id="sidebar">
                <button class="brand" data-page="dashboard" aria-label="Realification dashboard">
                    <span class="brand-icon">♧</span>
                    <span>REALIFICATION</span>
                </button>

                <nav class="main-nav" aria-label="Navigasi utama">
                    <button class="nav-item active" data-page="dashboard"><span>◆</span>Dashboard</button>
                    <button class="nav-item" data-page="map"><span>⌘</span>Peta Konsep</button>
                    <button class="nav-item" data-page="learn"><span>▤</span>Belajar</button>
                    <button class="nav-item" data-page="collection"><span>▣</span>Concept Collection</button>
                </nav>

                <div class="nav-divider"></div>

                <nav class="main-nav secondary-nav">
                    <button class="nav-item" data-page="profile"><span>●</span>Profil</button>
                    <button class="nav-item" data-page="settings"><span>⚙</span>Pengaturan</button>
                </nav>
            </aside>

            <header class="topbar">
                <button class="mobile-menu" id="menuButton" aria-label="Buka menu">☰</button>
                <div class="breadcrumbs" id="breadcrumbs"></div>
                <div class="user-tools">
                    <button class="notification" data-action="notifications" aria-label="Notifikasi">♧<i></i></button>
                    <span class="top-avatar">●</span>
                    <strong>Andi</strong>
                    <button class="user-caret" data-go="profile" aria-label="Buka profil">⌄</button>
                </div>
            </header>

            <main class="main" id="page" tabindex="-1"></main>
            <div class="scrim" id="scrim"></div>
            <div class="toast" id="toast" role="status" aria-live="polite"></div>
        </div>
    </body>
</html>
