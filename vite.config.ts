import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  base: './', // Permet de déployer dans un sous-dossier (ex: WebEtu /~login/ddd/)
  plugins: [
    react(),
    tailwindcss(),
  ],
})
