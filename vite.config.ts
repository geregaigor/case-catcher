import { fileURLToPath, URL } from 'node:url';

import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import VueDevTools from 'vite-plugin-vue-devtools';

export default defineConfig({
    publicDir: "./src",
    plugins: [
        vue(),
        vueJsx(),
        VueDevTools()
    ],
    resolve: {
        alias: {
            '@content': fileURLToPath(new URL('./content', import.meta.url))
        }
    },
    appType: 'custom',
    build: {
        outDir: 'dist',
        emptyOutDir: true,
        rollupOptions: {
            input: {
                main: 'content/main.ts',
            },
            output: {
                entryFileNames: 'content.js',
                chunkFileNames: '[name].js',
                assetFileNames: '[name].[ext]'
            }
        },
    }
});
