import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  const mainTarget = env.VITE_API_BASE_URL || 'https://aaha-api-405281288207.asia-south1.run.app/api/v2';
  const featureTarget = env.VITE_FEATURE_API_BASE_URL || 'https://aaha-feature-backend.onrender.com/api/v2';

  return {
    plugins: [react()],
    server: {
      proxy: {
        '/api-proxy-main': {
          target: mainTarget,
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path.replace(/^\/api-proxy-main/, ''),
        },
        '/api-proxy-feature': {
          target: featureTarget,
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path.replace(/^\/api-proxy-feature/, ''),
        },
      },
    },
  };
});
