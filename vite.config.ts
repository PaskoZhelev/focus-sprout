import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  // Relative asset paths work under any GitHub Pages sub-path (/<repo>/).
  base: './',
  plugins: [react()],
})
