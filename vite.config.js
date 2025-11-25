import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Inventario Casita',
        short_name: 'Inventario',
        description: 'Gestion de inventario del hogar',
        theme_color: '#4CAF50',
        background_color: '#ffffff',
        display: 'standalone', // Esto quita la barra del navegador
        icons: [
          {
            src: 'https://cdn-icons-png.flaticon.com/512/2897/2897785.png', // Un icono de casita temporal
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'https://cdn-icons-png.flaticon.com/512/2897/2897785.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ],
})