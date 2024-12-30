import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import Components from 'unplugin-vue-components/vite';
import { PrimeVueResolver } from '@primevue/auto-import-resolver';

export default defineConfig({
  plugins: [vue(),Components({
    resolvers: [PrimeVueResolver()],
  })],
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
