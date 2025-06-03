# 🚀 Guia de Deploy em Produção - Voxer Studio

## 📋 Pré-requisitos

### Servidor
- **OS:** Ubuntu 20.04+ ou CentOS 8+
- **RAM:** Mínimo 4GB (Recomendado 8GB+)
- **CPU:** 2+ cores
- **Disco:** 50GB+ SSD
- **Rede:** Conexão estável com internet

### Software
- Docker 20.10+
- Docker Compose 2.0+
- Git
- Nginx (opcional, já incluído no Docker)

## 🔧 Configuração Inicial

### 1. Preparar Servidor

```bash
# Atualizar sistema
sudo apt update && sudo apt upgrade -y

# Instalar dependências
sudo apt install -y curl wget git unzip

# Instalar Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh
sudo usermod -aG docker $USER

# Instalar Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/download/v2.20.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Logout e login novamente para aplicar permissões
```

### 2. Clonar Projeto

```bash
git clone <seu-repositorio> voxer-studio
cd voxer-studio
```

### 3. Configurar Variáveis de Ambiente

```bash
# Copiar arquivo de exemplo
cp .env.production .env

# Editar configurações
nano .env
```

**⚠️ IMPORTANTE:** Altere as seguintes variáveis:

- `DB_PASSWORD`: Senha segura para PostgreSQL
- `JWT_SECRET`: Chave secreta para JWT (256 bits)
- `JWT_REFRESH_SECRET`: Chave secreta para refresh tokens
- `SMTP_*`: Configurações do seu provedor de email
- `CORS_ORIGIN`: Domínios permitidos

## 🚀 Deploy

### Deploy Automático

```bash
# Executar script de deploy
./scripts/deploy.sh
```

### Deploy Manual

```bash
# 1. Build das imagens
docker-compose build --no-cache

# 2. Iniciar serviços
docker-compose up -d

# 3. Verificar status
docker-compose ps
docker-compose logs
```

## 🌐 Configuração de Domínio

### 1. DNS
Configure os seguintes registros DNS:

```
A     yourdomain.com        -> IP_DO_SERVIDOR
A     admin.yourdomain.com  -> IP_DO_SERVIDOR
A     api.yourdomain.com    -> IP_DO_SERVIDOR
```

### 2. SSL/TLS

#### Opção 1: Let's Encrypt (Recomendado)

```bash
# Instalar Certbot
sudo apt install certbot python3-certbot-nginx

# Obter certificados
sudo certbot --nginx -d yourdomain.com -d admin.yourdomain.com -d api.yourdomain.com

# Configurar renovação automática
sudo crontab -e
# Adicionar: 0 12 * * * /usr/bin/certbot renew --quiet
```

#### Opção 2: Certificado Próprio

```bash
# Criar diretório SSL
mkdir -p nginx/ssl

# Gerar certificado (desenvolvimento)
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout nginx/ssl/key.pem \
  -out nginx/ssl/cert.pem
```

### 3. Atualizar Nginx

Edite `nginx/nginx.conf` e substitua `yourdomain.com` pelo seu domínio real.

## 📊 Monitoramento

### Health Checks

```bash
# API Principal
curl http://localhost:3001/health

# Survey App
curl http://localhost:4200

# Survey Admin
curl http://localhost:4201
```

### Logs

```bash
# Ver logs de todos os serviços
docker-compose logs -f

# Ver logs de um serviço específico
docker-compose logs -f api
docker-compose logs -f postgres
```

### Métricas

```bash
# Status dos containers
docker-compose ps

# Uso de recursos
docker stats

# Espaço em disco
df -h
docker system df
```

## 🔄 Manutenção

### Backup

```bash
# Backup do banco de dados
docker-compose exec postgres pg_dump -U postgres voxer_studio > backup_$(date +%Y%m%d_%H%M%S).sql

# Backup dos uploads (se houver)
tar -czf uploads_backup_$(date +%Y%m%d_%H%M%S).tar.gz uploads/
```

### Atualizações

```bash
# Parar serviços
docker-compose down

# Atualizar código
git pull origin main

# Rebuild e restart
docker-compose build --no-cache
docker-compose up -d
```

### Limpeza

```bash
# Remover imagens não utilizadas
docker image prune -a

# Remover volumes não utilizados
docker volume prune

# Limpeza completa
docker system prune -a
```

## 🔒 Segurança

### Firewall

```bash
# Configurar UFW
sudo ufw enable
sudo ufw allow ssh
sudo ufw allow 80
sudo ufw allow 443
sudo ufw deny 3001  # Bloquear acesso direto à API
sudo ufw deny 5432  # Bloquear acesso direto ao PostgreSQL
```

### Atualizações de Segurança

```bash
# Configurar atualizações automáticas
sudo apt install unattended-upgrades
sudo dpkg-reconfigure -plow unattended-upgrades
```

## 🆘 Troubleshooting

### Problemas Comuns

1. **Porta já em uso**
   ```bash
   sudo lsof -i :3001
   sudo kill -9 <PID>
   ```

2. **Erro de permissão Docker**
   ```bash
   sudo usermod -aG docker $USER
   # Logout e login novamente
   ```

3. **Banco de dados não conecta**
   ```bash
   docker-compose logs postgres
   docker-compose restart postgres
   ```

4. **SSL não funciona**
   - Verificar se certificados estão no local correto
   - Verificar configuração do Nginx
   - Verificar DNS

### Comandos Úteis

```bash
# Reiniciar serviço específico
docker-compose restart api

# Acessar container
docker-compose exec api bash
docker-compose exec postgres psql -U postgres

# Ver configuração atual
docker-compose config

# Parar tudo
docker-compose down

# Parar e remover volumes
docker-compose down -v
```

## 📞 Suporte

Para suporte técnico:
- 📧 Email: support@voxerstudio.com
- 📚 Documentação: https://docs.voxerstudio.com
- 🐛 Issues: https://github.com/voxerstudio/issues

---

**🎉 Parabéns! Seu Voxer Studio está pronto para produção!**

