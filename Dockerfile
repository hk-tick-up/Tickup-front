# 빌드 스테이지
FROM node:22-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production
RUN npm run build

# 최종 스테이지
FROM nginx:alpine
WORKDIR /app

# Node.js 설치
RUN apk add --no-cache nodejs npm

# Next.js 애플리케이션 복사
COPY --from=builder /app/next.config.ts ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/.next/standalone ./

# Nginx 설정 복사
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 시작 스크립트 생성
WORKDIR /
RUN printf '#!/bin/sh\ncd /app && node server.js &\nnginx -g "daemon off;"\n' > /start.sh && \
chmod +x /start.sh

WORKDIR /app
EXPOSE 80 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["/start.sh"]