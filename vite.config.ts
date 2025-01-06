import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // proxy: {
    //   '/register': 'http://localhost:3300',
    //   '/verify-registration': 'http://localhost:3300',
    //   '/login': 'http://localhost:3300',
    //   '/verify-login': 'http://localhost:3300',
    // },
  },
  define: {
    'process.env': {},
  },
});
