import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import { nodePolyfills } from 'vite-plugin-node-polyfills';
import path from 'path';

import { VitePWA } from 'vite-plugin-pwa';

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    outDir: 'dist',
  },
  plugins: [
    nodePolyfills(),
    react(),
    VitePWA({
      registerType: 'autoUpdate', // 서비스 워커가 자동으로 업데이트됨.
      /**
       * manifest
       * PWA가 모바일 & 데스크톱에서 앱처럼 동작하도록 하는 설정 정보.
       * 브라우저가 이 파일을 참조하여, 홈 화면에 설치 가능한지 판단함.
       */
      manifest: {
        name: 'MyProject', // 앱의 전체 이름
        short_name: 'MyPWA', // 홈 화면에서 보이는 짧은 이름
        description: 'This is my PWA-enabled web app', // 앱의 설명
        theme_color: '#ffffff', // 앱의 기본 색상
        background_color: '#ffffff', // 앱 실행 시 배경 색상
        display: 'standalone', // 앱 실행 방식 (standalone → 웹 브라우저 UI 없이 실행)
        start_url: '/', // 앱 실행 시 기본으로 열리는 URL
        /**
         * icons
         * PWA 앱 아이콘을 설정.
         * 일반적으로 192x192와 512x512 크기의 아이콘이 필요함.
         */
        icons: [
          {
            src: '/icons/icon-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: '/icons/icon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
        screenshots: [
          {
            src: '/screenshots/screenshot1.png',
            sizes: '1080x1920',
            type: 'image/png',
          },
        ],
      },
      // workbox - (서비스 워커 캐싱 설정)
      workbox: {
        // runtimeCaching - (캐싱 정책 정의) - 이 설정은 정적인 파일뿐만 아니라 API 요청도 캐싱할 수 있도록 함.
        runtimeCaching: [
          {
            // urlPattern - 캐싱할 URL 패턴 (정규식)
            urlPattern: /^https:\/\/myproject-ui\.onrender\.com\/.*/, // 배포된 URL에 맞게 수정
            // handler- 캐싱 방식 (CacheFirst → 캐시 먼저 사용)
            handler: 'CacheFirst', // CacheFirst → 캐시 먼저 사용
            options: {
              cacheName: 'myproject-cache', // 캐시 저장소 이름
              expiration: {
                maxEntries: 50, // 캐시에 저장할 최대 항목 수
                maxAgeSeconds: 60 * 60 * 24 * 30, // 30일
              },
            },
          },
        ],
      },
    }),
  ],
  resolve: {
    alias: {
      '@components': path.resolve(__dirname, 'src/components'),
    },
  },
});
