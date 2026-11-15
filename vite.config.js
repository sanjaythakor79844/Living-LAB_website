import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  const getOrigin = (urlStr) => {
    try {
      const u = new URL(urlStr);
      return u.origin;
    } catch (_) {
      return '';
    }
  };

  const mainTarget = getOrigin(env.VITE_API_BASE_URL);
  const featureTarget = getOrigin(env.VITE_FEATURE_API_BASE_URL);

  const proxy = {};
  if (mainTarget) {
    proxy['/proxy-main'] = {
      target: mainTarget,
      changeOrigin: true,
      secure: false,
      rewrite: (path) => path.replace(/^\/proxy-main/, ''),
    };
  }
  if (featureTarget) {
    proxy['/proxy-feature'] = {
      target: featureTarget,
      changeOrigin: true,
      secure: false,
      rewrite: (path) => path.replace(/^\/proxy-feature/, ''),
    };
  }

  return {
    plugins: [react()],
    server: {
      proxy,
    },
  };
});
