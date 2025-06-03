# 🚀 Guia de Instalação - Voxer Studio

Este guia fornece instruções detalhadas para configurar o Voxer Studio em diferentes ambientes.

## 📋 Índice

- [Pré-requisitos](#-pré-requisitos)
- [Instalação Rápida](#-instalação-rápida)
- [Instalação Detalhada](#-instalação-detalhada)
- [Configuração do Banco](#-configuração-do-banco)
- [Configuração de Email](#-configuração-de-email)
- [Verificação da Instalação](#-verificação-da-instalação)
- [Solução de Problemas](#-solução-de-problemas)

## 🔧 Pré-requisitos

### Software Necessário

| Software   | Versão Mínima | Recomendada | Download                                 |
| ---------- | ------------- | ----------- | ---------------------------------------- |
| Node.js    | 18.0.0        | 20.x LTS    | [nodejs.org](https://nodejs.org)         |
| pnpm       | 8.0.0         | 8.x latest  | `npm install -g pnpm`                    |
| PostgreSQL | 14.0          | 15.x        | [postgresql.org](https://postgresql.org) |
| Git        | 2.30.0        | latest      | [git-scm.com](https://git-scm.com)       |

### Verificação dos Pré-requisitos

```bash
# Verificar Node.js
node --version  # Deve ser >= 18.0.0

# Verificar pnpm
pnpm --version  # Deve ser >= 8.0.0

# Verificar PostgreSQL
psql --version  # Deve ser >= 14.0

# Verificar Git
git --version   # Deve ser >= 2.30.0
```

## ⚡ Instalação Rápida

Para desenvolvedores experientes:

```bash
# 1. Clone e instale
git clone <repository-url> voxer
cd voxer
pnpm install

# 2. Configure banco
createdb voxer_studio

# 3. Configure ambiente
cp .env.example .env
# Edite .env com suas configurações

# 4. Execute
pnpm api:dev &
pnpm market-survey:dev &
pnpm survey-app:dev &
pnpm survey-admin:dev &
```

## 📖 Instalação Detalhada

### 1. Clone do Repositório

```bash
# Via HTTPS
git clone https://github.com/voxer/voxer.git
cd voxer

# Via SSH (recomendado para contribuidores)
git clone git@github.com:voxer/voxer.git
cd voxer
```

### 2. Instalação de Dependências

```bash
# Instalar todas as dependências do workspace
pnpm install

# Verificar instalação
pnpm list --depth=0
```

### 3. Configuração do Ambiente

```bash
# Copiar arquivo de exemplo
cp .env.example .env

# Editar configurações (use seu editor preferido)
nano .env
# ou
code .env
```

#### Configurações Essenciais

```env
# Banco de Dados
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=sua_senha_aqui
DATABASE_NAME=voxer_studio

# JWT (IMPORTANTE: Use chaves seguras em produção)
JWT_SECRET=sua-chave-jwt-super-secreta-aqui-min-32-chars
JWT_REFRESH_SECRET=sua-chave-refresh-super-secreta-aqui-min-32-chars

# Email (Configure com seu provedor SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=seu-email@gmail.com
SMTP_PASS=sua-senha-de-app
```

## 🗄️ Configuração do Banco

### PostgreSQL Local

#### Instalação no Ubuntu/Debian

```bash
# Atualizar repositórios
sudo apt update

# Instalar PostgreSQL
sudo apt install postgresql postgresql-contrib

# Iniciar serviço
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

#### Instalação no macOS

```bash
# Via Homebrew
brew install postgresql
brew services start postgresql

# Via PostgreSQL.app
# Download em: https://postgresapp.com/
```

#### Instalação no Windows

1. Download do instalador: https://www.postgresql.org/download/windows/
2. Execute o instalador
3. Configure senha do usuário `postgres`

### Configuração do Banco

```bash
# Conectar como usuário postgres
sudo -u postgres psql

# Criar banco de dados
CREATE DATABASE voxer_studio;

# Criar usuário (opcional)
CREATE USER voxer_user WITH PASSWORD 'senha_segura';
GRANT ALL PRIVILEGES ON DATABASE voxer_studio TO voxer_user;

# Sair
\q
```

### Usando Docker (Alternativa)

```bash
# Executar PostgreSQL em container
docker run --name voxer-postgres \
  -e POSTGRES_DB=voxer_studio \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=password \
  -p 5432:5432 \
  -d postgres:15

# Verificar se está rodando
docker ps
```

## 📧 Configuração de Email

### Gmail (Recomendado para desenvolvimento)

1. **Ativar 2FA** na sua conta Google
2. **Gerar senha de app**:
   - Acesse: https://myaccount.google.com/security
   - Clique em "Senhas de app"
   - Selecione "Outro" e digite "Voxer Studio"
   - Use a senha gerada no `.env`

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=seu-email@gmail.com
SMTP_PASS=senha-de-app-gerada
```

### SendGrid (Recomendado para produção)

```env
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASS=sua-api-key-sendgrid
```

### Outros Provedores

| Provedor | Host                  | Porta | Segurança |
| -------- | --------------------- | ----- | --------- |
| Outlook  | smtp-mail.outlook.com | 587   | STARTTLS  |
| Yahoo    | smtp.mail.yahoo.com   | 587   | STARTTLS  |
| Mailgun  | smtp.mailgun.org      | 587   | STARTTLS  |

## ✅ Verificação da Instalação

### 1. Executar Serviços

```bash
# Terminal 1 - API Principal
pnpm api:dev

# Terminal 2 - Microserviço
pnpm market-survey:dev

# Terminal 3 - App Público
pnpm survey-app:dev

# Terminal 4 - Painel Admin
pnpm survey-admin:dev
```

### 2. Verificar URLs

Aguarde alguns segundos e acesse:

- ✅ **API GraphQL**: http://localhost:3001/graphql
- ✅ **Market Survey**: http://localhost:3002/graphql
- ✅ **App Público**: http://localhost:4200
- ✅ **Painel Admin**: http://localhost:4201

### 3. Teste Básico

#### Teste da API

```bash
# Teste de health check
curl http://localhost:3001/health

# Teste GraphQL
curl -X POST http://localhost:3001/graphql \
  -H "Content-Type: application/json" \
  -d '{"query": "query { __schema { types { name } } }"}'
```

#### Teste do Frontend

1. Acesse http://localhost:4200
2. Deve carregar a página inicial
3. Teste navegação entre páginas

#### Teste do Admin

1. Acesse http://localhost:4201
2. Deve redirecionar para login
3. Registre um novo usuário
4. Acesse o dashboard

## 🔧 Solução de Problemas

### Problemas Comuns

#### 1. Erro de Conexão com Banco

```
Error: connect ECONNREFUSED 127.0.0.1:5432
```

**Soluções:**
- Verificar se PostgreSQL está rodando: `sudo systemctl status postgresql`
- Verificar configurações no `.env`
- Testar conexão: `psql -h localhost -U postgres -d voxer_studio`

#### 2. Erro de Dependências

```
ERR_PNPM_PEER_DEP_ISSUES
```

**Soluções:**
```bash
# Limpar cache
pnpm store prune

# Reinstalar
rm -rf node_modules
rm pnpm-lock.yaml
pnpm install
```

#### 3. Erro de Porta em Uso

```
Error: listen EADDRINUSE :::3001
```

**Soluções:**
```bash
# Encontrar processo usando a porta
lsof -i :3001

# Matar processo
kill -9 <PID>

# Ou usar porta diferente no .env
API_PORT=3005
```

#### 4. Erro de JWT

```
JsonWebTokenError: invalid signature
```

**Soluções:**
- Verificar `JWT_SECRET` no `.env`
- Usar chave com pelo menos 32 caracteres
- Reiniciar servidor após alterar

#### 5. Erro de Email

```
Error: Invalid login: 535-5.7.8 Username and Password not accepted
```

**Soluções:**
- Verificar credenciais SMTP
- Usar senha de app (Gmail)
- Verificar configurações de segurança

### Logs e Debug

#### Habilitar Logs Detalhados

```env
# No .env
NODE_ENV=development
LOG_LEVEL=debug
```

#### Verificar Logs

```bash
# API Principal
pnpm api:dev --verbose

# Com logs específicos
DEBUG=voxer:* pnpm api:dev
```

### Comandos Úteis

```bash
# Verificar status dos serviços
pnpm run status

# Limpar cache e reinstalar
pnpm run clean
pnpm install

# Executar testes
pnpm test

# Verificar lint
pnpm lint

# Build de produção
pnpm build
```

### Suporte Adicional

Se os problemas persistirem:

1. **Verifique a documentação**: [docs.voxerstudio.com](https://docs.voxerstudio.com)
2. **Procure issues similares**: [GitHub Issues](https://github.com/voxer/issues)
3. **Crie uma nova issue** com:
   - Versões do software
   - Sistema operacional
   - Logs de erro completos
   - Passos para reproduzir

---

**Próximo**: [Guia de Desenvolvimento](DEVELOPMENT.md)

