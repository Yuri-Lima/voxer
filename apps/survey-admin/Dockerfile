# Dockerfile para Survey Admin (Painel Administrativo)
FROM node:20-alpine AS builder

# Definir diretório de trabalho
WORKDIR /app

# Copiar arquivos de configuração
COPY package.json pnpm-lock.yaml ./
COPY apps/survey-admin/package.json ./apps/survey-admin/
COPY libs/ ./libs/

# Instalar pnpm e dependências
RUN npm install -g pnpm
RUN pnpm install --frozen-lockfile

# Copiar código fonte
COPY apps/survey-admin/ ./apps/survey-admin/
COPY tsconfig.base.json ./

# Build da aplicação
WORKDIR /app/apps/survey-admin
RUN pnpm build

# Estágio de produção com Nginx
FROM nginx:alpine

# Copiar arquivos buildados
COPY --from=builder /app/apps/survey-admin/dist/survey-admin /usr/share/nginx/html

# Copiar configuração customizada do Nginx
COPY apps/survey-admin/nginx.conf /etc/nginx/conf.d/default.conf

# Expor porta 80
EXPOSE 80

# Comando para iniciar Nginx
CMD ["nginx", "-g", "daemon off;"]

