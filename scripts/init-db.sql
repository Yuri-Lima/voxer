-- Script de Inicialização do Banco de Dados
-- Voxer Studio - Produção

-- Criar extensões necessárias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Criar usuário para a aplicação (se não existir)
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'voxer_app') THEN
        CREATE ROLE voxer_app WITH LOGIN PASSWORD 'voxer_app_password';
    END IF;
END
$$;

-- Conceder permissões
GRANT CONNECT ON DATABASE voxer_studio TO voxer_app;
GRANT USAGE ON SCHEMA public TO voxer_app;
GRANT CREATE ON SCHEMA public TO voxer_app;

-- Criar tabelas básicas (se não existirem)

-- Tabela de usuários
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'ADMIN',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de templates de pesquisa
CREATE TABLE IF NOT EXISTS survey_templates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    questions JSONB NOT NULL,
    settings JSONB DEFAULT '{}',
    is_active BOOLEAN DEFAULT true,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de respondentes
CREATE TABLE IF NOT EXISTS respondents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255),
    name VARCHAR(255),
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de respostas
CREATE TABLE IF NOT EXISTS survey_responses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    survey_template_id UUID REFERENCES survey_templates(id),
    respondent_id UUID REFERENCES respondents(id),
    responses JSONB NOT NULL,
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ip_address INET,
    user_agent TEXT
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_survey_templates_active ON survey_templates(is_active);
CREATE INDEX IF NOT EXISTS idx_survey_templates_created_by ON survey_templates(created_by);
CREATE INDEX IF NOT EXISTS idx_survey_responses_template ON survey_responses(survey_template_id);
CREATE INDEX IF NOT EXISTS idx_survey_responses_respondent ON survey_responses(respondent_id);
CREATE INDEX IF NOT EXISTS idx_survey_responses_submitted ON survey_responses(submitted_at);
CREATE INDEX IF NOT EXISTS idx_respondents_email ON respondents(email);

-- Trigger para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Aplicar trigger nas tabelas
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at 
    BEFORE UPDATE ON users 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_survey_templates_updated_at ON survey_templates;
CREATE TRIGGER update_survey_templates_updated_at 
    BEFORE UPDATE ON survey_templates 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Inserir usuário admin padrão (se não existir)
INSERT INTO users (email, password, role) 
SELECT 'admin@voxerstudio.com', crypt('admin123', gen_salt('bf')), 'ADMIN'
WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = 'admin@voxerstudio.com');

-- Conceder permissões nas tabelas para voxer_app
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO voxer_app;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO voxer_app;

-- Configurações de performance
ALTER SYSTEM SET shared_preload_libraries = 'pg_stat_statements';
ALTER SYSTEM SET max_connections = 200;
ALTER SYSTEM SET shared_buffers = '256MB';
ALTER SYSTEM SET effective_cache_size = '1GB';
ALTER SYSTEM SET maintenance_work_mem = '64MB';
ALTER SYSTEM SET checkpoint_completion_target = 0.9;
ALTER SYSTEM SET wal_buffers = '16MB';
ALTER SYSTEM SET default_statistics_target = 100;

-- Recarregar configurações
SELECT pg_reload_conf();

-- Log de inicialização
INSERT INTO survey_templates (title, description, questions, created_by)
SELECT 
    'Template de Exemplo',
    'Template de pesquisa de exemplo criado durante a inicialização',
    '[{"type":"text","question":"Qual é o seu nome?","required":true},{"type":"email","question":"Qual é o seu email?","required":true},{"type":"rating","question":"Como você avalia nosso serviço?","scale":5,"required":false}]'::jsonb,
    (SELECT id FROM users WHERE email = 'admin@voxerstudio.com' LIMIT 1)
WHERE NOT EXISTS (SELECT 1 FROM survey_templates WHERE title = 'Template de Exemplo');

-- Estatísticas finais
SELECT 
    'Inicialização concluída' as status,
    (SELECT COUNT(*) FROM users) as total_users,
    (SELECT COUNT(*) FROM survey_templates) as total_templates,
    CURRENT_TIMESTAMP as initialized_at;

