#!/bin/bash

# =================================
# VOXER STUDIO - SCRIPT DE SETUP
# =================================

echo "🎯 Iniciando setup do Voxer Studio..."
echo "======================================"

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Função para imprimir mensagens coloridas
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Verificar se Node.js está instalado
check_nodejs() {
    print_status "Verificando Node.js..."
    if command -v node &> /dev/null; then
        NODE_VERSION=$(node --version)
        print_success "Node.js encontrado: $NODE_VERSION"
        
        # Verificar se a versão é 18 ou superior
        NODE_MAJOR_VERSION=$(echo $NODE_VERSION | cut -d'.' -f1 | sed 's/v//')
        if [ "$NODE_MAJOR_VERSION" -ge 18 ]; then
            print_success "Versão do Node.js é compatível (18+)"
        else
            print_error "Node.js versão 18 ou superior é necessário. Versão atual: $NODE_VERSION"
            exit 1
        fi
    else
        print_error "Node.js não encontrado. Por favor, instale Node.js 18+ antes de continuar."
        exit 1
    fi
}

# Verificar se pnpm está instalado
check_pnpm() {
    print_status "Verificando pnpm..."
    if command -v pnpm &> /dev/null; then
        PNPM_VERSION=$(pnpm --version)
        print_success "pnpm encontrado: $PNPM_VERSION"
    else
        print_warning "pnpm não encontrado. Instalando..."
        npm install -g pnpm
        if [ $? -eq 0 ]; then
            print_success "pnpm instalado com sucesso"
        else
            print_error "Falha ao instalar pnpm"
            exit 1
        fi
    fi
}

# Verificar se PostgreSQL está instalado
check_postgresql() {
    print_status "Verificando PostgreSQL..."
    if command -v psql &> /dev/null; then
        POSTGRES_VERSION=$(psql --version)
        print_success "PostgreSQL encontrado: $POSTGRES_VERSION"
    else
        print_warning "PostgreSQL não encontrado."
        print_warning "Por favor, instale PostgreSQL antes de continuar."
        print_warning "Download: https://www.postgresql.org/download/"
        
        read -p "Continuar mesmo assim? (y/N): " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            exit 1
        fi
    fi
}

# Instalar dependências
install_dependencies() {
    print_status "Instalando dependências do projeto..."
    
    if [ -f "package.json" ]; then
        pnpm install
        if [ $? -eq 0 ]; then
            print_success "Dependências instaladas com sucesso"
        else
            print_error "Falha ao instalar dependências"
            exit 1
        fi
    else
        print_error "package.json não encontrado. Certifique-se de estar no diretório correto."
        exit 1
    fi
}

# Configurar arquivo .env
setup_env() {
    print_status "Configurando arquivo de ambiente..."
    
    if [ ! -f ".env" ]; then
        if [ -f ".env.example" ]; then
            cp .env.example .env
            print_success "Arquivo .env criado a partir do .env.example"
        else
            print_warning ".env.example não encontrado. Criando .env básico..."
            cat > .env << EOF
# Database
DATABASE_URL="postgresql://voxer_user:voxer_password@localhost:5432/voxer_studio"

# JWT
JWT_SECRET="your-super-secret-jwt-key-change-this"
JWT_REFRESH_SECRET="your-super-secret-refresh-key-change-this"

# Email
SMTP_HOST="smtp.gmail.com"
SMTP_PORT=587
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"
SMTP_FROM="your-email@gmail.com"

# URLs
API_URL="http://localhost:3001"
MARKET_SURVEY_URL="http://localhost:3002"
FRONTEND_URL="http://localhost:4200"
ADMIN_URL="http://localhost:4201"
EOF
        fi
        
        print_warning "⚠️  IMPORTANTE: Edite o arquivo .env com suas configurações!"
        print_warning "   - Configure as credenciais do banco PostgreSQL"
        print_warning "   - Configure as credenciais de email SMTP"
        print_warning "   - Altere os secrets JWT para valores seguros"
    else
        print_success "Arquivo .env já existe"
    fi
}

# Criar banco de dados PostgreSQL
setup_database() {
    print_status "Configurando banco de dados..."
    
    read -p "Deseja criar o banco de dados PostgreSQL automaticamente? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        print_status "Criando banco de dados..."
        
        # Tentar criar banco com usuário padrão
        createdb voxer_studio 2>/dev/null
        if [ $? -eq 0 ]; then
            print_success "Banco de dados 'voxer_studio' criado"
        else
            print_warning "Não foi possível criar o banco automaticamente"
            print_warning "Execute manualmente:"
            print_warning "  createdb voxer_studio"
            print_warning "  ou use pgAdmin/psql para criar o banco"
        fi
    else
        print_warning "Lembre-se de criar o banco de dados manualmente:"
        print_warning "  CREATE DATABASE voxer_studio;"
    fi
}

# Verificar se as portas estão disponíveis
check_ports() {
    print_status "Verificando portas disponíveis..."
    
    PORTS=(3001 3002 4200 4201)
    for port in "${PORTS[@]}"; do
        if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null 2>&1; then
            print_warning "Porta $port está em uso"
        else
            print_success "Porta $port disponível"
        fi
    done
}

# Executar testes básicos
run_tests() {
    read -p "Deseja executar os testes para verificar a instalação? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        print_status "Executando testes..."
        pnpm test
        if [ $? -eq 0 ]; then
            print_success "Todos os testes passaram"
        else
            print_warning "Alguns testes falharam, mas a instalação pode estar OK"
        fi
    fi
}

# Mostrar próximos passos
show_next_steps() {
    echo
    echo "======================================"
    print_success "🎉 Setup concluído com sucesso!"
    echo "======================================"
    echo
    echo "📋 Próximos passos:"
    echo
    echo "1. 📝 Edite o arquivo .env com suas configurações:"
    echo "   nano .env"
    echo
    echo "2. 🗄️  Configure o banco de dados PostgreSQL"
    echo
    echo "3. 🚀 Execute os serviços:"
    echo "   pnpm api:dev          # API Principal (porta 3001)"
    echo "   pnpm market-survey:dev # Microserviço (porta 3002)"
    echo "   pnpm survey-app:dev    # App Público (porta 4200)"
    echo "   pnpm survey-admin:dev  # Painel Admin (porta 4201)"
    echo
    echo "4. 🌐 Acesse as aplicações:"
    echo "   API GraphQL: http://localhost:3001/graphql"
    echo "   App Público: http://localhost:4200"
    echo "   Painel Admin: http://localhost:4201"
    echo
    echo "📚 Documentação completa: README.md"
    echo "🆘 Problemas? Consulte: INSTALACAO_LOCAL.md"
    echo
}

# Função principal
main() {
    echo "🎯 Voxer Studio - Setup Automatizado"
    echo "======================================"
    echo
    
    # Verificações de pré-requisitos
    check_nodejs
    check_pnpm
    check_postgresql
    
    echo
    print_status "Iniciando instalação..."
    echo
    
    # Instalação
    install_dependencies
    setup_env
    setup_database
    check_ports
    
    echo
    run_tests
    
    # Finalização
    show_next_steps
}

# Executar script principal
main

