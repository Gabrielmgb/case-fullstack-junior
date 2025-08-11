# Financial Planner Backend

Sistema de planejamento financeiro desenvolvido com Node.js, TypeScript, Fastify e Prisma.

## Arquitetura

### Stack Tecnológica
- **Runtime**: Node.js 20
- **Framework**: Fastify 4
- **ORM**: Prisma ORM
- **Database**: PostgreSQL 15
- **Validação**: Zod v4
- **Autenticação**: JWT
- **Testes**: Jest + Supertest
- **Linter**: ESLint

### Estrutura do Projeto
\`\`\`
backend/
├── src/
│   ├── controllers/     # Controladores das rotas
│   ├── services/        # Lógica de negócio
│   ├── models/          # Schemas Zod
│   ├── utils/           # Utilitários
│   ├── types/           # Tipos TypeScript
│   └── server.ts        # Servidor principal
├── prisma/
│   └── schema.prisma    # Schema do banco
├── tests/               # Testes
└── docker/              # Configurações Docker
\`\`\`

## Funcionalidades Principais

### 1. Motor de Projeção Patrimonial
Implementa a função `simulateWealthCurve(initialState, events, rate)` que:
- Calcula crescimento composto mensal
- Considera movimentações recorrentes e únicas
- Retorna projeção ano a ano até 2060

**Suposições do Motor de Projeção:**
- Taxa real composta padrão: 4% a.a.
- Capitalização mensal: `(1 + taxa_anual)^(1/12) - 1`
- Movimentações aplicadas no início de cada período
- Eventos únicos aplicados apenas no ano especificado
- Eventos recorrentes aplicados todos os anos/meses conforme frequência

### 2. Sistema de Alinhamento
Categoriza clientes baseado no percentual de alinhamento:
- **> 90%**: Verde (bem alinhado)
- **90% a 70%**: Amarelo claro (moderadamente alinhado)
- **70% a 50%**: Amarelo escuro (pouco alinhado)
- **< 50%**: Vermelho (desalinhado)

### 3. Sugestões Automáticas
Analisa distância do plano e gera sugestões personalizadas baseadas em:
- Gap entre patrimônio atual e meta
- Tempo restante até a data-alvo
- Capacidade de contribuição estimada

## Comandos

### Desenvolvimento
\`\`\`bash
npm run dev          # Inicia servidor em modo desenvolvimento
npm run build        # Compila TypeScript
npm run start        # Inicia servidor em produção
\`\`\`

### Testes
\`\`\`bash
npm test             # Executa todos os testes
npm run test:watch   # Executa testes em modo watch
npm run test:coverage # Executa testes com coverage (mín. 80%)
\`\`\`

### Database
\`\`\`bash
npm run db:generate  # Gera cliente Prisma
npm run db:push      # Aplica schema ao banco
npm run db:migrate   # Cria e aplica migrações
npm run db:studio    # Abre Prisma Studio
\`\`\`

### Linting
\`\`\`bash
npm run lint         # Verifica código
npm run lint:fix     # Corrige problemas automaticamente
\`\`\`

## Docker

\`\`\`bash
# Desenvolvimento
docker-compose up -d

# Produção
docker build -t financial-planner-backend .
docker run -p 3001:3001 financial-planner-backend
\`\`\`

## Variáveis de Ambiente

Copie `.env.example` para `.env` e configure:

- `DATABASE_URL`: String de conexão PostgreSQL
- `JWT_SECRET`: Chave secreta para JWT
- `PORT`: Porta do servidor (padrão: 3001)
- `NODE_ENV`: Ambiente (development/production)

## API Documentation

Acesse `/docs` para visualizar a documentação Swagger completa.

## Commits e Desenvolvimento

### Estratégia de Commits
- Commits pequenos e objetivos
- Mensagens descritivas em português
- Foco em funcionalidades específicas por commit

### Prioridades de Teste
1. **Motor de Projeção**: Testes unitários e de integração extensivos
2. **Endpoints críticos**: CRUD de clientes, metas e simulações
3. **Autenticação**: Testes de segurança e autorização
4. **Validações**: Schemas Zod e regras de negócio
