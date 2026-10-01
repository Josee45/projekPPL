<!DOCTYPE html>
<html lang="id">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="theme-color" content="#172b4d">
        <meta name="robots" content="noindex">
        <title>@yield('title') - Realification</title>
        @vite('resources/css/app.css')
    </head>
    <body class="error-body">
        <main class="error-page">
            <a class="error-brand" href="{{ route('home') }}" aria-label="Kembali ke Realification">
                <span aria-hidden="true">ℝ</span>
                REALIFICATION
            </a>
            <section class="error-card">
                <span class="error-code">@yield('code')</span>
                <h1>@yield('heading')</h1>
                <p>@yield('message')</p>
                <a class="btn btn-primary" href="{{ route('home') }}">Kembali ke Dashboard</a>
            </section>
        </main>
    </body>
</html>
