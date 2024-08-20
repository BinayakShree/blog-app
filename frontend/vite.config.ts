import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173, // Ensure this is the port you're using
    host: '0.0.0.0',
    strictPort: true, // Fail if port is already in use
  },
});
