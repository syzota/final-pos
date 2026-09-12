<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">

    <!-- Primary Meta Tags -->
    <title>Posyandu Loa Duri Ulu | Layanan Kesehatan Masyarakat</title>
    <meta name="title" content="Posyandu Loa Duri Ulu | Layanan Kesehatan Masyarakat">
    <meta name="description" content="Layanan digital resmi Posyandu Desa Loa Duri Ulu, Kutai Kartanegara. Informasi jadwal penimbangan balita, pemantauan status gizi, artikel kesehatan keluarga, dan kontak darurat medis.">
    <meta name="keywords" content="Posyandu, Loa Duri Ulu, Kutai Kartanegara, kesehatan balita, status gizi, jadwal posyandu, kontak darurat, rekam medis posyandu">
    <meta name="author" content="Pemerintah Desa Loa Duri Ulu">
    <meta name="robots" content="index, follow">
    <meta name="theme-color" content="#008080">
    <meta name="mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-status-bar-style" content="default">

    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="website">
    <meta property="og:url" content="{{ url('/') }}">
    <meta property="og:title" content="Posyandu Loa Duri Ulu - Layanan Kesehatan Masyarakat">
    <meta property="og:description" content="Pusat pelayanan kesehatan primer terpadu bagi keluarga di Desa Loa Duri Ulu, Kecamatan Kutai Kartanegara. Melayani balita, remaja, ibu hamil, hingga lansia.">
    <meta property="og:image" content="{{ asset('favicon.svg') }}">
    <meta property="og:locale" content="id_ID">

    <!-- Twitter -->
    <meta property="twitter:card" content="summary_large_image">
    <meta property="twitter:url" content="{{ url('/') }}">
    <meta property="twitter:title" content="Posyandu Loa Duri Ulu - Layanan Kesehatan Masyarakat">
    <meta property="twitter:description" content="Pusat pelayanan kesehatan primer terpadu bagi keluarga di Desa Loa Duri Ulu.">
    <meta property="twitter:image" content="{{ asset('favicon.svg') }}">

    <!-- Favicon & Icons -->
    <link rel="icon" type="image/svg+xml" href="{{ asset('favicon.svg') }}?v=4">
    <link rel="icon" type="image/x-icon" href="{{ asset('favicon.ico') }}?v=4">
    <link rel="apple-touch-icon" href="{{ asset('favicon.svg') }}?v=4">

    <!-- Google Fonts Preconnect & Stylesheet -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link
        href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,400;1,600;1,700;1,800;1,900&family=Quicksand:wght@400;500;600;700&display=swap"
        rel="stylesheet"
    >

    @viteReactRefresh
    @vite('resources/js/main.jsx')
</head>

<body>
    <div id="root"></div>
</body>
</html>