-- Seed script para dados iniciais
-- Este script cria dados de exemplo para desenvolvimento e testes

-- Inserir usuário administrador padrão
INSERT INTO users (id, email, password, role, name, created_at, updated_at)
VALUES (
  'cluid_admin_001',
  'admin@financialplanner.com',
  '$2a$12$LQv3c1yqBWVHxkd0LQ4YCOdh4wrI0.Hn8VpMpMxOJvKX8zJqBdh6e', -- senha: admin123
  'ADVISOR',
  'Administrador Sistema',
  NOW(),
  NOW()
) ON CONFLICT (email) DO NOTHING;

-- Inserir clientes de exemplo
INSERT INTO clients (id, name, email, age, is_active, family_profile, total_wealth, created_at, updated_at, user_id)
VALUES 
  (
    'cluid_client_001',
    'João Silva',
    'joao.silva@email.com',
    35,
    true,
    'Casado, 2 filhos menores, cônjuge trabalha',
    150000.00,
    NOW(),
    NOW(),
    'cluid_admin_001'
  ),
  (
    'cluid_client_002',
    'Maria Santos',
    'maria.santos@email.com',
    42,
    true,
    'Solteira, sem filhos',
    280000.00,
    NOW(),
    NOW(),
    'cluid_admin_001'
  ),
  (
    'cluid_client_003',
    'Pedro Oliveira',
    'pedro.oliveira@email.com',
    28,
    true,
    'Casado, sem filhos, planejando família',
    85000.00,
    NOW(),
    NOW(),
    'cluid_admin_001'
  )
ON CONFLICT (email) DO NOTHING;

-- Inserir metas de exemplo
INSERT INTO goals (id, title, description, type, target_value, target_date, priority, created_at, updated_at, client_id)
VALUES 
  (
    'cluid_goal_001',
    'Aposentadoria aos 60 anos',
    'Meta de acumular patrimônio suficiente para aposentadoria confortável',
    'RETIREMENT',
    2000000.00,
    '2049-12-31',
    1,
    NOW(),
    NOW(),
    'cluid_client_001'
  ),
  (
    'cluid_goal_002',
    'Compra de imóvel',
    'Entrada para compra de apartamento próprio',
    'REAL_ESTATE',
    200000.00,
    '2027-06-30',
    1,
    NOW(),
    NOW(),
    'cluid_client_001'
  ),
  (
    'cluid_goal_003',
    'Reserva de emergência',
    'Reserva equivalente a 12 meses de gastos',
    'EMERGENCY_FUND',
    60000.00,
    '2025-12-31',
    1,
    NOW(),
    NOW(),
    'cluid_client_002'
  )
ON CONFLICT (id) DO NOTHING;

-- Inserir itens de carteira de exemplo
INSERT INTO wallet_items (id, asset_class, percentage, value, created_at, updated_at, client_id)
VALUES 
  (
    'cluid_wallet_001',
    'Renda Fixa',
    40.00,
    60000.00,
    NOW(),
    NOW(),
    'cluid_client_001'
  ),
  (
    'cluid_wallet_002',
    'Ações',
    35.00,
    52500.00,
    NOW(),
    NOW(),
    'cluid_client_001'
  ),
  (
    'cluid_wallet_003',
    'Fundos Imobiliários',
    15.00,
    22500.00,
    NOW(),
    NOW(),
    'cluid_client_001'
  ),
  (
    'cluid_wallet_004',
    'Reserva de Emergência',
    10.00,
    15000.00,
    NOW(),
    NOW(),
    'cluid_client_001'
  )
ON CONFLICT (id) DO NOTHING;

-- Inserir eventos de exemplo
INSERT INTO events (id, title, description, type, value, frequency, start_date, is_active, created_at, updated_at, client_id)
VALUES 
  (
    'cluid_event_001',
    'Aporte mensal',
    'Investimento mensal regular',
    'CONTRIBUTION',
    2000.00,
    'MONTHLY',
    '2024-01-01',
    true,
    NOW(),
    NOW(),
    'cluid_client_001'
  ),
  (
    'cluid_event_002',
    'Bonificação anual',
    'Bonificação do trabalho investida',
    'BONUS',
    15000.00,
    'YEARLY',
    '2024-12-01',
    true,
    NOW(),
    NOW(),
    'cluid_client_001'
  ),
  (
    'cluid_event_003',
    'Aporte inicial',
    'Transferência de recursos de poupança',
    'CONTRIBUTION',
    50000.00,
    'ONCE',
    '2024-01-15',
    true,
    NOW(),
    NOW(),
    'cluid_client_002'
  )
ON CONFLICT (id) DO NOTHING;

-- Inserir seguros de exemplo
INSERT INTO insurances (id, type, coverage, premium, frequency, provider, policy_number, start_date, is_active, created_at, updated_at, client_id)
VALUES 
  (
    'cluid_insurance_001',
    'LIFE',
    500000.00,
    150.00,
    'MONTHLY',
    'Seguradora ABC',
    'VIDA-001-2024',
    '2024-01-01',
    true,
    NOW(),
    NOW(),
    'cluid_client_001'
  ),
  (
    'cluid_insurance_002',
    'DISABILITY',
    300000.00,
    80.00,
    'MONTHLY',
    'Seguradora XYZ',
    'INVALIDEZ-002-2024',
    '2024-01-01',
    true,
    NOW(),
    NOW(),
    'cluid_client_001'
  )
ON CONFLICT (id) DO NOTHING;
