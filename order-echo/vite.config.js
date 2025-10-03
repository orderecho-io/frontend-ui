import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// Get version from environment or use current date
const version = process.env.VITE_VERSION || new Date().toISOString().split('T')[0].replace(/-/g, '')

// Plugin to add version query string to HTML references
function versionPlugin() {
  return {
    name: 'html-version-transform',
    transformIndexHtml(html) {
      // Add version query string to all asset references in HTML
      return html.replace(
        /(href|src)="([^"]+\.(js|css|png|jpg|jpeg|svg|gif|webp))"/g,
        `$1="$2?v=${version}"`
      )
    }
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), versionPlugin()],
  server: {
    allowedHosts: true,
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
    },
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
