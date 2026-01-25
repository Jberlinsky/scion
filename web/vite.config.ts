import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
    root: '.',
    publicDir: 'public',
    build: {
        outDir: 'dist/client',
        emptyOutDir: true,
        rollupOptions: {
            input: {
                main: resolve(__dirname, 'src/client/main.ts'),
            },
            output: {
                // Use consistent naming for SSR compatibility
                entryFileNames: 'assets/[name].js',
                chunkFileNames: 'assets/[name]-[hash].js',
                assetFileNames: 'assets/[name]-[hash].[ext]',
            },
        },
        sourcemap: true,
        // Ensure Lit components are properly bundled
        target: 'esnext',
        minify: 'esbuild',
    },
    server: {
        port: 3000,
        strictPort: true,
    },
    resolve: {
        alias: {
            '@': resolve(__dirname, 'src'),
        },
    },
    // Ensure decorators work correctly
    esbuild: {
        target: 'esnext',
    },
    // Optimize Lit dependency
    optimizeDeps: {
        include: ['lit', '@vaadin/router'],
    },
});
