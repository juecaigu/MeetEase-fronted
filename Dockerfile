FROM node:22-alpine AS builder

WORKDIR /app

ENV PNPM_REGISTRY=https://registry.npmmirror.com

RUN npm install -g pnpm
RUN pnpm config set registry $PNPM_REGISTRY 

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile
    
FROM builder AS runner

COPY . .

RUN pnpm run build

FROM nginx:1.29.1-alpine AS production

COPY --from=runner /app/dist /usr/share/nginx/html

COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]