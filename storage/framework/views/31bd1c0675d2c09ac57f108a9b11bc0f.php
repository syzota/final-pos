<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">

    <meta
        name="viewport"
        content="width=device-width, initial-scale=1.0"
    >

    <title>Posyandu Loa Duri Ulu</title>

    <link rel="icon" type="image/svg+xml" href="<?php echo e(asset('favicon.svg')); ?>?v=3">
    <link rel="apple-touch-icon" href="<?php echo e(asset('favicon.svg')); ?>?v=3">

    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>

    <link
        href="https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&family=Plus+Jakarta+Sans:ital,wght@0,200..800;1,200..800&display=swap"
        rel="stylesheet"
    >

    <?php echo app('Illuminate\Foundation\Vite')->reactRefresh(); ?>
    <?php echo app('Illuminate\Foundation\Vite')('resources/js/main.jsx'); ?>
</head>

<body>
    <div id="root"></div>
</body>
</html><?php /**PATH /app/resources/views/app.blade.php ENDPATH**/ ?>