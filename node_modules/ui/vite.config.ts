import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import { nodePolyfills } from 'vite-plugin-node-polyfills';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [nodePolyfills(), react()],
  resolve: {
    alias: {
      '@components': path.resolve(__dirname, 'src/components'),
    },
  },
  build: {
    outDir: 'build', // 빌드된 파일이 저장되는 폴더
  },
});
