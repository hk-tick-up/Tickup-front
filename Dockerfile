# 1. Next.js 빌드 스테이지
FROM node:22 AS builder

WORKDIR /app

# 패키지 설치
COPY package*.json ./
RUN npm ci --verbose

# 소스 복사 및 빌드
COPY . .
ENV NEXT_TELEMETRY_DISABLED 1
ENV NODE_ENV production
RUN npm run build
# RUN NEXT_PRIVATE_STANDALONE=true npm run build


FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

# 필요한 파일들만 복사
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

EXPOSE 3000
ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]



# 2. Nginx 실행 스테이지
FROM nginx:alpine

# Nginx 설정 파일 복사
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Next.js 빌드 결과물 복사
COPY --from=builder /app/.next/static /usr/share/nginx/html/_next/static
COPY --from=builder /app/public /usr/share/nginx/html/public

# Next.js 서버 복사
COPY --from=builder /app/.next/standalone /app
COPY --from=builder /app/.next/static /app/.next/static

# Node.js 설치
RUN apk add --no-cache nodejs

# 포트 설정
EXPOSE 80

# 시작 스크립트
COPY start.sh /start.sh
RUN chmod +x /start.sh

CMD ["/start.sh"]