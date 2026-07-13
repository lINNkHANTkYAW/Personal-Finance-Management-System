import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {
        // Ignore the runtime data store so writes to it never trigger a
        // full-page reload (which would create a refresh loop with the API).
        ignored: ['**/data/**'],
      },
    },
    // Tailwind v4 is handled by the @tailwindcss/vite plugin above, so we
    // explicitly set an empty PostCSS pipeline. This prevents Vite from
    // climbing to a stray postcss.config.mjs in a parent directory.
    css: {
      postcss: {},
    },
  };
});
