import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [
        laravel({
            input: [
                'resources/js/main.jsx',
            ],
            refresh: true,
        }),

        react(),
    ],

    server: {
        host: true,
        hmr: {
            host: '192.168.18.12',
        },
        cors: true,
    },
});
