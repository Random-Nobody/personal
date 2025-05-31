import { defineConfig } from 'vite';
import { VitePluginNode } from 'vite-plugin-node';

export default defineConfig({
  server: {
    port: 3000
  },
  build: {
    target: 'esnext',
    outDir: 'dist',
    rollupOptions: {
      external: [
        // Mark node built-ins as external
        /^node:.*$/,
        // Dependencies that should be external in production
        'express',
        'cors',
        'socket.io',
        'mongoose',
        'redis',
        'winston',
        '@socket.io/admin-ui'
      ]
    }
  },
  optimizeDeps: {
    // node_modules that are ESM-only
    exclude: ['@socket.io/admin-ui']
  },
  plugins: [
    ...VitePluginNode({
      adapter: 'express',
      appPath: './src/index.ts',
      exportName: 'app',
      tsCompiler: 'esbuild'
    })
  ]
});
