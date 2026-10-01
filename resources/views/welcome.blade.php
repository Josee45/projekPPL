@extends('layouts.app')

@section('title', 'Realification - Sistem Bilangan Real')

@section('content')
    <div class="app" id="app">
        @include('partials.sidebar')
        @include('partials.topbar')

        <main class="main" id="page" tabindex="-1">
            <section class="app-loading" aria-label="Memuat ruang belajar">
                <span class="loading-mark">ℝ</span>
                <div>
                    <strong>Menyiapkan ruang belajar…</strong>
                    <p>Materi dan progresmu sedang dimuat.</p>
                </div>
            </section>
        </main>

        <button class="scrim" id="scrim" type="button" aria-label="Tutup menu"></button>
        <div class="toast" id="toast" role="status" aria-live="polite"></div>
    </div>
@endsection
