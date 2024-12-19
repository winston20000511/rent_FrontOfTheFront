import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': '/src', // 將 `@` 別名映射到 `src` 目錄
    },
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8080', // 後端 API 的地址
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''), // 重寫路徑，可選
      },
    },
  },
});
