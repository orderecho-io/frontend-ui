import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// Get version from environment or use current date
const version = process.env.VITE_VERSION || new Date().toISOString().split('T')[0].replace(/-/g, '')

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: true,
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
    },
  },
  build: {
    // Add version query string to all assets for cache busting
    rollupOptions: {
      output: {
        // Add version to chunk file names
        entryFileNames: `assets/[name]-[hash].js?v=${version}`,
        chunkFileNames: `assets/[name]-[hash].js?v=${version}`,
        assetFileNames: `assets/[name]-[hash].[ext]?v=${version}`,
      }
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
    extensions: ['.mjs', '.js', '.jsx', '.ts', '.tsx', '.json']
  },
  optimizeDeps: {
    esbuildOptions: {
      loader: {
        '.js': 'jsx',
      },
    },
  },
}) 
