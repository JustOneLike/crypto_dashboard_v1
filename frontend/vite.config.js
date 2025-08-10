import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Vite essaiera 5173 puis 5174, 5175, ... si le port est occupé.
// Pareil pour `vite preview`.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    strictPort: false, // <— important: autorise le fallback automatique
    open: true         // ouvre le navigateur au démarrage
  },
  preview: {
    port: 4173,
    strictPort: false
  }
})
