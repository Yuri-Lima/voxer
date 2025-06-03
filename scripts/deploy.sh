#!/bin/bash

# Script de Deploy para Produção - Voxer Studio
# =============================================

set -e

echo "🚀 Iniciando deploy do Voxer Studio..."

# Verificar se Docker está instalado
if ! command -v docker &> /dev/null; then
    echo "❌ Docker não encontrado. Instalando..."
    curl -fsSL https://get.docker.com -o get-docker.sh
    sh get-docker.sh
    sudo usermod -aG docker $USER
    echo "✅ Docker instalado. Faça logout e login novamente."
    exit 1
fi

# Verificar se Docker Compose está instalado
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose não encontrado. Instalando..."
    sudo curl -L "https://github.com/docker/compose/releases/download/v2.20.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    sudo chmod +x /usr/local/bin/docker-compose
    echo "✅ Docker Compose instalado."
fi

# Verificar se arquivo .env.production existe
if [ ! -f ".env.production" ]; then
    echo "❌ Arquivo .env.production não encontrado!"
    echo "📝 Copie .env.production.example e configure as variáveis."
    exit 1
fi

# Copiar arquivo de produção
cp .env.production .env

echo "📦 Fazendo build das imagens Docker..."

# Build das imagens
docker-compose build --no-cache

echo "🗄️ Configurando banco de dados..."

# Parar containers existentes
docker-compose down

# Iniciar apenas o PostgreSQL primeiro
docker-compose up -d postgres redis

# Aguardar PostgreSQL estar pronto
echo "⏳ Aguardando PostgreSQL..."
sleep 30

# Executar migrações (se existirem)
# docker-compose exec postgres psql -U postgres -d voxer_studio -f /docker-entrypoint-initdb.d/init-db.sql

echo "🚀 Iniciando todos os serviços..."

# Iniciar todos os serviços
docker-compose up -d

echo "⏳ Aguardando serviços iniciarem..."
sleep 60

# Verificar status dos serviços
echo "📊 Status dos serviços:"
docker-compose ps

# Verificar health checks
echo "🏥 Verificando health checks..."
for i in {1..10}; do
    if curl -f http://localhost:3001/health > /dev/null 2>&1; then
        echo "✅ API está saudável!"
        break
    else
        echo "⏳ Aguardando API... (tentativa $i/10)"
        sleep 10
    fi
done

# Mostrar logs dos últimos 50 linhas
echo "📝 Logs recentes:"
docker-compose logs --tail=50

echo ""
echo "🎉 Deploy concluído com sucesso!"
echo ""
echo "📍 URLs disponíveis:"
echo "   🌐 App Público: http://localhost:4200"
echo "   👨‍💼 Painel Admin: http://localhost:4201"
echo "   🔗 API GraphQL: http://localhost:3001/graphql"
echo "   📊 Market Survey: http://localhost:3002/graphql"
echo ""
echo "🔧 Comandos úteis:"
echo "   docker-compose logs -f [serviço]  # Ver logs em tempo real"
echo "   docker-compose restart [serviço] # Reiniciar serviço"
echo "   docker-compose down              # Parar todos os serviços"
echo "   docker-compose up -d             # Iniciar todos os serviços"
echo ""

