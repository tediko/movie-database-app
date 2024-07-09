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
        app: resolve(__dirname, 'app/index.html'),
      },
    },
  },
  plugins: [
    {
      name: 'rewrite-middleware',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          if (req.url.startsWith('/app')) {
            req.url = '/app/index.html';
          }
          next();
        });
      },
    },
  ],
  server: {
    open: '/index.html',
  },
  base: '',
})