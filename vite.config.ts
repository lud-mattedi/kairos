import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  base: './',
  plugins: [react()],
  server: {
    host: true, // Permite acesso direto pela rede local no iPhone/iOS
    port: 5173,
    allowedHosts: true
  }
})
