# Financial Planner - Sistema de Planejamento Financeiro

Sistema completo de planejamento financeiro desenvolvido com Node.js, TypeScript, Next.js e PostgreSQL.

## 🏗️ Arquitetura

### Backend
- **Framework**: Fastify 4 com TypeScript
- **ORM**: Prisma ORM
- **Database**: PostgreSQL 15
- **Validação**: Zod v4
- **Autenticação**: JWT (roles: advisor, viewer)
- **Testes**: Jest + Supertest (>80% coverage)
- **Documentação**: Swagger/OpenAPI

### Frontend
- **Framework**: Next.js 14 (App Router)
- **UI**: ShadCN/UI (dark mode padrão)
- **State Management**: TanStack Query
- **Forms**: React Hook Form + Zod
- **Charts**: Recharts
- **HTTP Client**: Axios

### Infraestrutura
- **Containerização**: Docker + Docker Compose
- **Database**: PostgreSQL 15
- **Reverse Proxy**: Nginx (produção)

## 🚀 Funcionalidades

### 1. Gestão de Clientes
- ✅ CRUD completo (nome, email, idade, status, perfil familiar)
- ✅ Busca e filtros
- ✅ Visualização detalhada
- ✅ Controle de acesso por usuário

### 2. Planejamento & Alinhamento
- ✅ Registro de metas (aposentadoria, objetivos com valor e data-alvo)
- ✅ Carteira atual (classes de ativos e percentuais)
- ✅ Cálculo automático de alinhamento
- ✅ Categorização por cores:
  - 🟢 **> 90%** - Verde (bem alinhado)
  - 🟡 **90% a 70%** - Amarelo claro (moderado)
  - 🟠 **70% a 50%** - Amarelo escuro (pouco alinhado)
  - 🔴 **< 50%** - Vermelho (desalinhado)

### 3. Motor de Projeção Patrimonial ⭐
**Implementação robusta com testes extensivos**

#### Características Técnicas:
- **Taxa Composta Mensal**: `(1 + taxa_anual)^(1/12) - 1`
- **Capitalização Mensal**: Maior precisão nos cálculos
- **Eventos Suportados**:
  - 🔄 **Recorrentes**: Mensais e anuais
  - ⚡ **Únicos**: Aplicados apenas uma vez
  - 📅 **Período Definido**: Com data de início e fim
- **Projeção**: Até 2060 por padrão
- **Precisão**: Arredondamento para 2 casas decimais

#### Suposições Documentadas:
- Movimentações aplicadas no início de cada período
- Eventos únicos aplicados apenas no ano especificado
- Eventos recorrentes respeitam data de início e fim
- Taxa real composta padrão: 4% a.a.

### 4. Movimentações & Eventos
- ✅ CRUD de eventos financeiros
- ✅ Tipos: Aporte, Retirada, Mudança de Renda, Bonificação
- ✅ Frequências: Única, Mensal, Anual
- ✅ Impacto nas projeções

### 5. Histórico de Simulações
- ✅ Salvar versões de simulações
- ✅ Listagem histórica
- ✅ Visualização de gráficos
- ✅ Comparação de cenários

### 6. Sugestões Automáticas
- ✅ Análise de distância da meta
- ✅ Sugestões personalizadas
- ✅ Cálculo de aportes necessários
- ✅ Priorização por urgência

### 7. Perfis de Seguro
- ✅ Registro de seguros (vida, invalidez, saúde, patrimonial)
- ✅ Controle de coberturas e prêmios
- ✅ Visualização de distribuição

## 🛠️ Instalação e Execução

### Pré-requisitos
- Docker e Docker Compose
- Node.js 20+ (para desenvolvimento local)
- PostgreSQL 15+ (para desenvolvimento local)

### Execução com Docker (Recomendado)

\`\`\`bash
# Clone o repositório
git clone <repository-url>
cd financial-planner

# Inicie todos os serviços
docker-compose up -d

# Aguarde os serviços iniciarem (healthchecks)
docker-compose logs -f

# Acesse as aplicações
# Frontend: http://localhost:3000
# Backend API: http://localhost:3001
# Swagger Docs: http://localhost:3001/docs
\`\`\`

### Desenvolvimento Local

#### Backend
\`\`\`bash
cd backend

# Instalar dependências
npm install

# Configurar ambiente
cp .env.example .env
# Edite o .env com suas configurações

# Executar migrações
npm run db:migrate

# Executar seed (dados de exemplo)
npm run db:push

# Iniciar em desenvolvimento
npm run dev

# Executar testes
npm test

# Executar testes com coverage
npm run test:coverage
\`\`\`

#### Frontend
\`\`\`bash
cd frontend

# Instalar dependências
npm install

# Iniciar em desenvolvimento
npm run dev

# Build para produção
npm run build
\`\`\`

## 🧪 Testes

### Backend - Cobertura > 80%
\`\`\`bash
cd backend

# Testes unitários
npm test

# Testes com coverage
npm run test:coverage

# Testes em modo watch
npm run test:watch

# Testes de integração
npm run test:integration
\`\`\`

### Prioridade: Motor de Projeção
O motor de projeção possui **testes extensivos** cobrindo:
- ✅ Projeções simples sem eventos
- ✅ Eventos únicos, mensais e anuais
- ✅ Datas de início e fim
- ✅ Eventos negativos (retiradas)
- ✅ Edge cases (patrimônio zero, taxa zero)
- ✅ Precisão de arredondamento
- ✅ Conversão de taxas anuais para mensais

## 📊 API Endpoints

### Autenticação
- `POST /api/auth/register` - Registrar usuário
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Dados do usuário logado

### Clientes
- `GET /api/clients` - Listar clientes (paginado)
- `POST /api/clients` - Criar cliente
- `GET /api/clients/:id` - Obter cliente
- `PUT /api/clients/:id` - Atualizar cliente
- `DELETE /api/clients/:id` - Remover cliente
- `GET /api/clients/:id/alignment` - Calcular alinhamento

### Simulações
- `POST /api/simulations` - Criar simulação
- `GET /api/simulations/client/:clientId` - Histórico do cliente
- `GET /api/simulations/:id` - Obter simulação
- `POST /api/simulations/test` - Testar motor de projeção

## 🔧 Configuração

### Variáveis de Ambiente

#### Backend (.env)
\`\`\`env
DATABASE_URL="postgresql://planner:plannerpw@localhost:5432/plannerdb"
JWT_SECRET="your-super-secret-jwt-key-change-in-production"
PORT=3001
NODE_ENV=development
\`\`\`

#### Frontend (.env.local)
\`\`\`env
NEXT_PUBLIC_API_URL=http://localhost:3001
\`\`\`

## 📈 Commits e Desenvolvimento

### Estratégia de Commits
- ✅ **Commits pequenos e objetivos**
- ✅ Mensagens descritivas em português
- ✅ Foco em funcionalidades específicas
- ✅ Testes incluídos em cada commit relevante

### Exemplos de Commits
\`\`\`
feat: implementa motor de projeção patrimonial

- Adiciona função simulateWealthCurve com capitalização mensal
- Suporte a eventos únicos, mensais e anuais
- Testes extensivos cobrindo edge cases
- Documentação das suposições no código

test: adiciona testes para eventos recorrentes

- Testa eventos mensais e anuais
- Valida datas de início e fim
- Cobertura de casos extremos

docs: documenta suposições do motor de projeção

- Taxa composta mensal
- Aplicação de eventos no início do período
- Precisão de arredondamento
\`\`\`

## 🚀 Deploy

### Produção com Docker
\`\`\`bash
# Build das imagens
docker-compose -f docker-compose.prod.yml build

# Deploy
docker-compose -f docker-compose.prod.yml up -d

# Verificar logs
docker-compose -f docker-compose.prod.yml logs -f
\`\`\`

### Variáveis de Produção
- Alterar `JWT_SECRET` para valor seguro
- Configurar `DATABASE_URL` para instância de produção
- Definir `NODE_ENV=production`
- Configurar domínio em `NEXT_PUBLIC_API_URL`

## 📋 Roadmap

### Próximas Funcionalidades
- [ ] SSE para importação de CSV
- [ ] Relatórios em PDF
- [ ] Dashboard executivo
- [ ] Integração com APIs de cotações
- [ ] Notificações por email
- [ ] Backup automático

### Melhorias Técnicas
- [ ] Cache Redis
- [ ] Rate limiting
- [ ] Logs estruturados
- [ ] Monitoramento (Prometheus)
- [ ] CI/CD pipeline

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-funcionalidade`)
3. Commit suas mudanças (`git commit -m 'feat: adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para detalhes.

---

**Desenvolvido com ❤️ para planejamento financeiro eficiente**
# case-fullstack-junior
