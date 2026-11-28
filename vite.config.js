import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5173,
    // In dev the browser talks to Vite, which forwards /api to the admin API.
    proxy: { '/api': process.env.VITE_API_TARGET || 'http://localhost:4000' },
  },
})
