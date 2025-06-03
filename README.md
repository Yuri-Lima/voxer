# 🎯 Voxer Studio - Sistema Completo de Pesquisas

![Voxer Studio](https://img.shields.io/badge/voxer-blue?style=for-the-badge)
![Status](https://img.shields.io/badge/Status-Completo-success?style=for-the-badge)
![Version](https://img.shields.io/badge/Version-1.0.0-informational?style=for-the-badge)

Sistema completo de pesquisas e formulários dinâmicos com arquitetura de microserviços, desenvolvido com **NestJS**, **Angular**, **GraphQL** e **PostgreSQL**.

## 📋 Índice

- [Visão Geral](#-visão-geral)
- [Arquitetura](#-arquitetura)
- [Tecnologias](#-tecnologias)
- [Instalação](#-instalação)
- [Configuração](#-configuração)
- [Execução](#-execução)
- [Estrutura do Projeto](#-estrutura-do-projeto)
- [APIs e Endpoints](#-apis-e-endpoints)
- [Funcionalidades](#-funcionalidades)
- [Plugins](#-plugins)
- [Internacionalização](#-internacionalização)
- [Deployment](#-deployment)
- [Contribuição](#-contribuição)

## 🎯 Visão Geral

O **Voxer Studio** é uma plataforma completa para criação, gerenciamento e análise de pesquisas e formulários dinâmicos. O sistema oferece:

- **Painel Administrativo** para criação e gerenciamento de pesquisas
- **Interface Pública** para resposta de pesquisas
- **Sistema de Plugins** dinâmicos para extensibilidade
- **Microserviço** especializado para pesquisas de mercado
- **API GraphQL** robusta e tipada
- **Internacionalização** completa (pt-br, en, es)

## 🏗️ Arquitetura

```
┌─────────────────────────────────────────────────────────────┐
│                    Voxer Studio Platform                    │
├─────────────────────────────────────────────────────────────┤
│  Frontend Apps (Angular)          │  Backend Services       │
│  ├── survey-app (Público)         │  ├── api (NestJS)      │
│  └── survey-admin (Admin)         │  └── market-survey     │
├─────────────────────────────────────────────────────────────┤
│  Shared Libraries                 │  External Services      │
│  ├── @voxer/graphql               │  ├── PostgreSQL        │
│  ├── @voxer/i18n                  │  ├── SMTP Server       │
│  ├── @voxer/ui                    │  └── Redis (opcional)  │
│  └── @voxer/integrations          │                         │
├─────────────────────────────────────────────────────────────┤
│                    Plugin System                            │
│  └── plugins/ (Extensões dinâmicas)                        │
└─────────────────────────────────────────────────────────────┘
```

### Componentes Principais

1. **API Principal (apps/api)** - Backend NestJS com GraphQL
2. **Microserviço Market Survey (apps/market-survey)** - Serviço especializado
3. **App Público (apps/survey-app)** - Interface para responder pesquisas
4. **Painel Admin (apps/survey-admin)** - Interface administrativa
5. **Bibliotecas Compartilhadas (libs/)** - Código reutilizável
6. **Sistema de Plugins (plugins/)** - Extensões dinâmicas

## 🛠️ Tecnologias

### Backend
- **NestJS** - Framework Node.js
- **GraphQL** - API tipada e autodocumentada
- **TypeORM** - ORM para PostgreSQL
- **JWT** - Autenticação e autorização
- **Nodemailer** - Envio de emails
- **bcrypt** - Hash de senhas

### Frontend
- **Angular 17+** - Framework frontend
- **Apollo Client** - Cliente GraphQL
- **ngx-formly** - Formulários dinâmicos
- **ngx-translate** - Internacionalização
- **Tailwind CSS** - Framework CSS
- **Capacitor** - Apps híbridas

### Banco de Dados
- **PostgreSQL** - Banco principal
- **Redis** - Cache (opcional)

### DevOps
- **pnpm** - Gerenciador de pacotes
- **TypeScript** - Linguagem tipada
- **ESLint** - Linting
- **Prettier** - Formatação

## 🚀 Instalação

### Pré-requisitos

- **Node.js** 18+ 
- **pnpm** 8+
- **PostgreSQL** 14+
- **Git**

### 1. Clone o Repositório

```bash
git clone <repository-url>
cd voxer
```

### 2. Instale as Dependências

```bash
pnpm install
```

### 3. Configure o Banco de Dados

```bash
# Criar banco PostgreSQL
createdb voxer_studio

# Ou via psql
psql -c "CREATE DATABASE voxer_studio;"
```

## ⚙️ Configuração

### 1. Variáveis de Ambiente

Copie o arquivo de exemplo e configure as variáveis:

```bash
cp .env.example .env
```

Edite o arquivo `.env`:

```env
# Environment
NODE_ENV=development

# Database
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=your_password
DATABASE_NAME=voxer_studio

# JWT
JWT_SECRET=your-super-secret-jwt-key-here
JWT_REFRESH_SECRET=your-super-secret-refresh-key-here

# Email (SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# URLs
API_URL=http://localhost:3001
MARKET_SURVEY_URL=http://localhost:3002
FRONTEND_URL=http://localhost:4200
ADMIN_URL=http://localhost:4201
```

### 2. Configuração do Banco

O sistema criará automaticamente as tabelas na primeira execução.

## 🏃‍♂️ Execução

### Desenvolvimento

Execute todos os serviços em modo desenvolvimento:

```bash
# API Principal (porta 3001)
pnpm api:dev

# Microserviço Market Survey (porta 3002)
pnpm market-survey:dev

# App Público (porta 4200)
pnpm survey-app:dev

# Painel Admin (porta 4201)
pnpm survey-admin:dev
```

### Produção

```bash
# Build de todos os projetos
pnpm build

# Executar em produção
pnpm start
```

### URLs de Acesso

- **API GraphQL Playground**: http://localhost:3001/graphql
- **Market Survey API**: http://localhost:3002/graphql
- **App Público**: http://localhost:4200
- **Painel Admin**: http://localhost:4201

## 📁 Estrutura do Projeto

```
voxer/
├── apps/                          # Aplicações
│   ├── api/                       # API Principal (NestJS)
│   │   ├── src/
│   │   │   ├── modules/           # Módulos da aplicação
│   │   │   │   ├── auth/          # Autenticação
│   │   │   │   ├── survey/        # Pesquisas
│   │   │   │   ├── email/         # Email
│   │   │   │   └── plugin/        # Plugins
│   │   │   ├── entities/          # Entidades TypeORM
│   │   │   ├── common/            # Guards, decorators
│   │   │   └── main.ts            # Bootstrap
│   │   └── package.json
│   │
│   ├── market-survey/             # Microserviço
│   │   ├── src/
│   │   │   ├── modules/           # Módulos específicos
│   │   │   ├── services/          # Serviços
│   │   │   └── main.ts
│   │   └── package.json
│   │
│   ├── survey-app/                # App Público (Angular)
│   │   ├── src/
│   │   │   ├── app/
│   │   │   │   ├── pages/         # Páginas
│   │   │   │   ├── services/      # Serviços
│   │   │   │   └── components/    # Componentes
│   │   │   └── assets/i18n/       # Traduções
│   │   └── package.json
│   │
│   └── survey-admin/              # Painel Admin (Angular)
│       ├── src/
│       │   ├── app/
│       │   │   ├── pages/         # Páginas admin
│       │   │   ├── services/      # Serviços
│       │   │   ├── guards/        # Guards de rota
│       │   │   └── interceptors/  # Interceptors HTTP
│       │   └── assets/i18n/       # Traduções
│       └── package.json
│
├── libs/                          # Bibliotecas Compartilhadas
│   ├── graphql/                   # Tipos GraphQL
│   ├── i18n/                      # Internacionalização
│   ├── ui/                        # Componentes UI
│   └── integrations/              # Integrações
│       └── email/                 # Email
│
├── plugins/                       # Plugins Dinâmicos
│   └── market-survey-webhook/     # Plugin de exemplo
│
├── package.json                   # Configuração do workspace
├── pnpm-workspace.yaml           # Configuração pnpm
├── tsconfig.base.json             # TypeScript base
└── .env.example                   # Variáveis de ambiente
```

## 🔌 APIs e Endpoints

### API Principal (GraphQL)

**Endpoint**: `http://localhost:3001/graphql`

#### Autenticação

```graphql
# Login
mutation Login($input: LoginInput!) {
  login(input: $input) {
    accessToken
    refreshToken
    user {
      id
      email
      name
      role
    }
  }
}

# Registro
mutation Register($input: RegisterInput!) {
  register(input: $input) {
    accessToken
    refreshToken
    user {
      id
      email
      name
      role
    }
  }
}

# Usuário atual
query Me {
  me {
    id
    email
    name
    role
    isActive
  }
}
```

#### Pesquisas

```graphql
# Listar pesquisas
query GetSurveyTemplates {
  surveyTemplates {
    id
    title
    description
    schema
    isActive
    createdAt
  }
}

# Criar pesquisa
mutation CreateSurveyTemplate($input: CreateSurveyTemplateInput!) {
  createSurveyTemplate(input: $input) {
    id
    title
    description
    schema
  }
}

# Submeter resposta
mutation SubmitSurveyResponse($input: SubmitSurveyResponseInput!) {
  submitSurveyResponse(input: $input) {
    id
    responses
    submittedAt
  }
}
```

### Microserviço Market Survey

**Endpoint**: `http://localhost:3002/graphql`

```graphql
# Submeter pesquisa de mercado
mutation SubmitMarketSurvey($input: SubmitMarketSurveyInput!) {
  submitMarketSurvey(input: $input) {
    id
    responses
    submittedAt
  }
}

# Estatísticas
query GetSurveyStats($surveyId: ID!) {
  surveyStats(surveyId: $surveyId) {
    totalResponses
    averageRating
    responsesByDay {
      date
      count
    }
  }
}
```

## ✨ Funcionalidades

### 🔐 Sistema de Autenticação
- Login/registro com JWT
- Refresh tokens automáticos
- Reset de senha via email
- Proteção de rotas
- Controle de roles (ADMIN, USER)

### 📝 Gerenciamento de Pesquisas
- Criação visual com ngx-formly
- Formulários dinâmicos
- Múltiplos tipos de campo:
  - Texto simples
  - Email
  - Área de texto
  - Múltipla escolha
  - Escala de avaliação
- Validação automática
- Preview em tempo real

### 📊 Dashboard e Analytics
- Estatísticas em tempo real
- Gráficos de respostas
- Métricas de engajamento
- Exportação de dados

### 🌐 Interface Pública
- Design responsivo
- Modo escuro/claro
- Formulários acessíveis
- Experiência mobile otimizada

### 📧 Sistema de Email
- Templates profissionais
- Email de boas-vindas
- Reset de senha
- Notificações personalizadas

## 🔌 Plugins

O sistema suporta plugins dinâmicos para extensibilidade:

### Estrutura de Plugin

```javascript
// plugins/meu-plugin/package.json
{
  "name": "meu-plugin",
  "version": "1.0.0",
  "voxer": {
    "type": "webhook",
    "triggers": ["survey_submitted"],
    "config": {
      "url": "https://api.exemplo.com/webhook"
    }
  }
}

// plugins/meu-plugin/index.js
module.exports = {
  async execute(data, config) {
    // Lógica do plugin
    console.log('Plugin executado:', data);
    return { success: true };
  }
};
```

### Tipos de Plugin Suportados
- **webhook** - Envio de dados via HTTP
- **notification** - Notificações personalizadas
- **analytics** - Análise de dados
- **integration** - Integrações externas

## 🌍 Internacionalização

O sistema suporta múltiplos idiomas:

### Idiomas Suportados
- **Português Brasileiro** (pt-br) - Padrão
- **Inglês** (en)
- **Espanhol** (es)

### Estrutura de Traduções

```json
{
  "common": {
    "title": "Voxer Studio",
    "loading": "Carregando...",
    "submit": "Enviar"
  },
  "survey": {
    "title": "Pesquisas",
    "create": "Criar Pesquisa",
    "submit": "Enviar Resposta"
  }
}
```

### Adicionando Novos Idiomas

1. Crie arquivos de tradução em `libs/i18n/src/`
2. Adicione em `apps/*/src/assets/i18n/`
3. Configure no módulo de tradução

## 🚀 Deployment

### Docker (Recomendado)

```dockerfile
# Dockerfile
FROM node:18-alpine

WORKDIR /app
COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

EXPOSE 3001
CMD ["npm", "run", "start:prod"]
```

```yaml
# docker-compose.yml
version: '3.8'
services:
  api:
    build: .
    ports:
      - "3001:3001"
    environment:
      - DATABASE_URL=postgresql://user:pass@db:5432/voxer
    depends_on:
      - db
  
  db:
    image: postgres:14
    environment:
      POSTGRES_DB: voxer_studio
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: password
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

### Deploy Manual

```bash
# Build do projeto
pnpm build

# Configurar variáveis de produção
export NODE_ENV=production
export DATABASE_URL=postgresql://...

# Executar
pnpm start:prod
```

### Variáveis de Produção

```env
NODE_ENV=production
DATABASE_URL=postgresql://user:pass@host:5432/db
JWT_SECRET=production-secret-key
SMTP_HOST=smtp.sendgrid.net
FRONTEND_URL=https://app.voxerstudio.com
ADMIN_URL=https://admin.voxerstudio.com
```

## 🤝 Contribuição

### Desenvolvimento

1. Fork o projeto
2. Crie uma branch: `git checkout -b feature/nova-funcionalidade`
3. Commit: `git commit -m 'Adiciona nova funcionalidade'`
4. Push: `git push origin feature/nova-funcionalidade`
5. Abra um Pull Request

### Padrões de Código

- **TypeScript** para tipagem
- **ESLint** para linting
- **Prettier** para formatação
- **Conventional Commits** para mensagens

### Testes

```bash
# Testes unitários
pnpm test

# Testes e2e
pnpm test:e2e

# Coverage
pnpm test:cov
```

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para detalhes.

## 🆘 Suporte

- **Documentação**: [docs.voxerstudio.com](https://docs.voxerstudio.com)
- **Issues**: [GitHub Issues](https://github.com/voxer/issues)
- **Email**: suporte@voxerstudio.com

---

**Desenvolvido com ❤️ pela equipe Voxer Studio**

