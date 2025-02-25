import path from "path"

import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: process.env.NODE_ENV === 'production' ? "/game-time/" : "/game-time",
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
