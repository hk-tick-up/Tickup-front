#!/bin/sh

# Next.js 서버 시작
cd /app && node server.js &

# Nginx 시작
nginx -g 'daemon off;'