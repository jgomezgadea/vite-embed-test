import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/static': {
        target: 'http://127.0.0.1:8002',
        changeOrigin: true,
      },
      '/free_dashboard': {
        target: 'http://127.0.0.1:8002',
        changeOrigin: true,
      },
      '/ps-dashboard': {
        target: 'http://127.0.0.1:8002',
        changeOrigin: true,
      },
    },
  },
})
