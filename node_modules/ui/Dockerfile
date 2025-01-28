# 1. Node.js 기반으로 빌드 스테이지 설정
FROM node:18-alpine AS builder

# 2. 작업 디렉토리 설정
WORKDIR /app

# 3. package.json 복사 (package-lock.json 없이 진행)
COPY package.json ./

# 4. npm install 실행 (package-lock.json 없이 패키지 설치)
RUN npm install --legacy-peer-deps

# 5. 소스 코드 복사
COPY . .

# 6. Vite 빌드 실행
RUN npm run build

# 7. nginx를 사용하여 정적 파일 제공
FROM nginx:alpine

# 8. 빌드된 정적 파일을 nginx로 복사
COPY --from=builder /app/dist /usr/share/nginx/html

# 9. nginx 포트 오픈
EXPOSE 80

# 10. nginx 실행
CMD ["nginx", "-g", "daemon off;"]