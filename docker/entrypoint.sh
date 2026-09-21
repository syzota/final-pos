#!/bin/bash
set -e

# Buat direktori storage & bootstrap/cache jika belum ada
mkdir -p /var/www/html/storage/framework/{sessions,views,cache}
mkdir -p /var/www/html/storage/logs
mkdir -p /var/www/html/bootstrap/cache

# Atur izin kepemilikan folder storage dan cache
chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache
chmod -R 775 /var/www/html/storage /var/www/html/bootstrap/cache

# Cek apakah berkas .env tersedia
if [ ! -f /var/www/html/.env ]; then
    if [ -f /var/www/html/.env.docker ]; then
        cp /var/www/html/.env.docker /var/www/html/.env
    elif [ -f /var/www/html/.env.example ]; then
        cp /var/www/html/.env.example /var/www/html/.env
    fi
fi

# Buat symlink storage jika belum ada
if [ ! -L /var/www/html/public/storage ]; then
    php /var/www/html/artisan storage:link || true
fi

exec "$@"
