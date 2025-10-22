# 🧪 Testes da API - Oficina Mecânica

## 📋 Visão Geral

Esta suite de testes cobre todas as funcionalidades da API da oficina mecânica, incluindo:

- ✅ Testes unitários para todas as rotas CRUD
- ✅ Testes de integração para workflows completos
- ✅ Validação de dados e tratamento de erros
- ✅ Banco de dados em memória para isolamento
- ✅ Relatórios de cobertura de código

## 🚀 Configuração

### Pré-requisitos
- Node.js 18+
- npm ou yarn

### Instalação
```bash
# Instalar dependências principais (se ainda não instalou)
npm install

# Instalar dependências de teste
npm install --save-dev jest supertest mongodb-memory-server

# Ou usar o script de setup
# Windows:
.\test-setup.ps1
# Linux/Mac:
chmod +x test-setup.sh && ./test-setup.sh
```

## 🧪 Executando Testes

### Comandos Básicos
```bash
# Executar todos os testes
npm test

# Executar com relatório de cobertura
npm run test:coverage

# Executar em modo watch (desenvolvimento)
npm run test:watch
```

### Executar Testes Específicos
```bash
# Executar apenas testes de clientes
npm test -- --testPathPattern=clientes

# Executar apenas testes de integração
npm test -- --testPathPattern=integration

# Executar com verbose para mais detalhes
npm test -- --verbose
```

## 📁 Estrutura dos Testes

```
tests/
├── testConfig.js           # Configuração do banco de teste e dados mock
├── testApp.js             # App Express para testes (sem servidor)
├── integration.test.js    # Testes de integração e workflows
└── routes/
    ├── clientes.test.js       # Testes das rotas de clientes
    ├── veiculos.test.js       # Testes das rotas de veículos
    ├── oficinas.test.js       # Testes das rotas de oficinas
    ├── servicos.test.js       # Testes das rotas de serviços
    ├── pecas.test.js          # Testes das rotas de peças
    └── ordensServico.test.js  # Testes das rotas de ordens de serviço
```

## 🎯 Cobertura de Testes

### Rotas Testadas

#### 🧑‍💼 Clientes (`/clientes`)
- ✅ POST - Criar cliente
- ✅ GET - Listar clientes
- ✅ GET /:id - Buscar por ID
- ✅ PUT /:id - Atualizar cliente
- ✅ DELETE /:id - Deletar cliente

#### 🚗 Veículos (`/veiculos`)
- ✅ CRUD completo
- ✅ GET /cliente/:id - Veículos por cliente
- ✅ Populate de dados do cliente

#### 🏢 Oficinas (`/oficinas`)
- ✅ CRUD completo
- ✅ GET /cidade/:cidade - Busca por cidade
- ✅ GET /estado/:estado - Busca por estado

#### 🔧 Serviços (`/servicos`)
- ✅ CRUD completo
- ✅ GET /buscar/:nome - Busca por nome
- ✅ GET /preco/:min/:max - Busca por faixa de preço

#### ⚙️ Peças (`/pecas`)
- ✅ CRUD completo
- ✅ GET /buscar/:nome - Busca por nome
- ✅ GET /marca/:marca - Busca por marca
- ✅ GET /estoque/disponivel - Peças disponíveis
- ✅ GET /estoque/baixo/:qtd - Estoque baixo
- ✅ PATCH /:id/estoque - Atualizar estoque

#### 📋 Ordens de Serviço (`/ordens-servico`)
- ✅ CRUD completo
- ✅ GET /cliente/:id - Por cliente
- ✅ GET /veiculo/:id - Por veículo
- ✅ GET /status/:status - Por status
- ✅ GET /periodo/:inicio/:fim - Por período
- ✅ GET /abertas/lista - Ordens em aberto
- ✅ POST /:id/servicos - Adicionar serviço
- ✅ POST /:id/pecas - Adicionar peça
- ✅ GET /:id/calcular-total - Calcular total
- ✅ PATCH /:id/status - Atualizar status

### Cenários de Teste

#### ✅ Casos de Sucesso
- Criação de registros válidos
- Busca de dados existentes
- Atualização de registros
- Deleção de registros
- Relacionamentos entre entidades
- Cálculos de valores

#### ❌ Casos de Erro
- Busca por IDs inexistentes (404)
- Dados inválidos ou incompletos (400)
- Violações de regras de negócio
- Erros de validação

#### 🔄 Fluxos de Integração
- Workflow completo: Cliente → Veículo → Ordem → Cálculo
- Gerenciamento de estoque de peças
- Finalização de ordens de serviço
- Buscas com múltiplos filtros

## 🛠️ Tecnologias Utilizadas

### Framework de Teste
- **Jest** - Framework de testes
- **Supertest** - Testes HTTP/API
- **MongoDB Memory Server** - Banco em memória

### Características
- **ES Modules** - Suporte nativo
- **Async/Await** - Código moderno
- **Banco Isolado** - Cada teste tem dados limpos
- **Dados Mock** - Dados reutilizáveis e consistentes

## 📊 Métricas de Cobertura

Após executar `npm run test:coverage`, você verá:

```bash
# Exemplo de saída
 PASS  tests/routes/clientes.test.js
 PASS  tests/routes/veiculos.test.js
 PASS  tests/routes/oficinas.test.js
 PASS  tests/routes/servicos.test.js
 PASS  tests/routes/pecas.test.js
 PASS  tests/routes/ordensServico.test.js
 PASS  tests/integration.test.js

Test Suites: 7 passed, 7 total
Tests:       85 passed, 85 total
Snapshots:   0 total
Time:        15.2 s

----------|---------|----------|---------|---------|-------------------
File      | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s 
----------|---------|----------|---------|---------|-------------------
All files |   95.2  |   89.1   |   100   |   95.2  |                   
----------|---------|----------|---------|---------|-------------------
```

## 🐛 Debugging

### Problemas Comuns

#### Timeout nos Testes
```bash
# Aumentar timeout no Jest
jest --testTimeout=30000
```

#### Conexão com MongoDB
```bash
# Verificar se MongoDB Memory Server está funcionando
# Os logs devem mostrar: "MongoMemoryServer successfully started"
```

#### ES Modules
```bash
# Verificar se package.json tem:
"type": "module"
```

### Logs Detalhados
```bash
# Executar com logs verbosos
npm test -- --verbose --detectOpenHandles

# Ver apenas um arquivo de teste
npm test -- tests/routes/clientes.test.js --verbose
```

## 🚀 CI/CD

### Integração Contínua
Os testes podem ser executados automaticamente em:
- GitHub Actions
- GitLab CI
- Jenkins
- Outros pipelines CI/CD

### Exemplo de Pipeline
```yaml
test:
  stage: test
  script:
    - npm ci
    - npm run test:coverage
  coverage: '/All files\\s*\\|\\s*([0-9.]+)/'
  artifacts:
    reports:
      coverage_report:
        coverage_format: cobertura
        path: coverage/cobertura-coverage.xml
```

## 📈 Próximos Passos

- [ ] Testes de performance com artillery
- [ ] Testes de carga com k6
- [ ] Testes E2E com Playwright
- [ ] Mutação de testes com Stryker
- [ ] Testes de segurança com OWASP ZAP