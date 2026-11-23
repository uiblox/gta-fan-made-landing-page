import process from 'node:process'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

// https://vite.dev/config/
// GitHub Pages serves a project site from /<repo-name>/. Set BASE=/ when building for a custom domain or a user site.
export default defineConfig({
  base: process.env.BASE ?? '/gta-fan-made-landing-page/',
  plugins: [react(), tailwindcss()],
})
