# Dockerfile para Survey App (Frontend Público)
FROM node:20-alpine AS base

# Instalar dependências do sistema
RUN apk add --no-cache libc6-compat
RUN apk update

# Configurar diretório de trabalho
WORKDIR /app

# Copiar arquivos de configuração
COPY package.json pnpm-lock.yaml* ./
COPY pnpm-workspace.yaml ./
COPY tsconfig.base.json ./

# Instalar pnpm
RUN npm install -g pnpm

# Copiar código fonte
COPY apps/survey-app ./apps/survey-app
COPY libs ./libs

# Instalar dependências
RUN pnpm install --frozen-lockfile

# Build da aplicação
WORKDIR /app/apps/survey-app
RUN pnpm build

# Estágio de produção com Nginx
FROM nginx:alpine AS production

# Copiar configuração customizada do Nginx
COPY apps/survey-app/nginx.conf /etc/nginx/conf.d/default.conf

# Copiar build da aplicação
COPY --from=base /app/apps/survey-app/dist/survey-app /usr/share/nginx/html

# Expor porta
EXPOSE 80

# Comando de inicialização
CMD ["nginx", "-g", "daemon off;"]

