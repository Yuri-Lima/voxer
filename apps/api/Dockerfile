# Dockerfile para API Principal
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
COPY apps/api ./apps/api
COPY libs ./libs

# Instalar dependências
RUN pnpm install --frozen-lockfile

# Build da aplicação
RUN pnpm --filter api build

# Estágio de produção
FROM node:20-alpine AS production

WORKDIR /app

# Instalar pnpm
RUN npm install -g pnpm

# Copiar arquivos necessários
COPY package.json pnpm-lock.yaml* ./
COPY pnpm-workspace.yaml ./
COPY apps/api/package.json ./apps/api/
COPY libs ./libs

# Instalar apenas dependências de produção
RUN pnpm install --frozen-lockfile --prod

# Copiar build da aplicação
COPY --from=base /app/apps/api/dist ./apps/api/dist

# Criar usuário não-root
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nestjs

# Mudar ownership dos arquivos
RUN chown -R nestjs:nodejs /app
USER nestjs

# Expor porta
EXPOSE 3001

# Variáveis de ambiente
ENV NODE_ENV=production
ENV PORT=3001

# Comando de inicialização
CMD ["node", "apps/api/dist/apps/api/src/main.js"]

