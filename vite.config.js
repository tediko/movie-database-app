// vite.config.js
import { resolve } from 'path'
import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    manifest: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        login: resolve(__dirname, 'access/login.html'),
        register: resolve(__dirname, 'access/register.html'),
      },
    },
  },
  base: '',
})