import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react';
import path from "node:path";
import process from "node:process";

// https://vite.dev/config/
export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            '@/': path.resolve(process.cwd(), 'src'),
            '@/api': path.resolve(process.cwd(), 'src/api'),
            '@/app': path.resolve(process.cwd(), 'src/app'),
            '@/components': path.resolve(process.cwd(), 'src/components'),
            '@/ducks': path.resolve(process.cwd(), 'src/ducks'),
            '@/slices': path.resolve(process.cwd(), 'src/slices'),
        }
    },
    base: "/apps/shopify-payouts/",
    build: {
        manifest: true,
        sourcemap: true,
        rolldownOptions: {
            output: {
                codeSplitting: {
                    groups: [
                        {test: /node_modules/, name: 'vendor'}
                    ]
                }
            }
        },
    },
    server: {
        port: 8080,
        host: 'localhost',
        proxy: {
            '/api': {
                target: 'http://localhost:8081',
                changeOrigin: true,
            }
        }
    }
})
