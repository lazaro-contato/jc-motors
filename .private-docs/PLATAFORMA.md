# JG Motors — Documentação da Plataforma

## Visão Geral

JG Motors é uma plataforma de gestão para revendedoras de veículos. Permite controlar o estoque de carros, registrar vendas, gerenciar clientes e funcionários, e automatizar processos internos via um sistema de workflows com tarefas e times.

A plataforma possui dois perfis de acesso distintos:
- **Interno (funcionários/staff):** acesso ao painel administrativo completo
- **Externo (clientes):** portal simplificado para acompanhar compras

---

## Regras de Negócio

### Autenticação e Perfis

- Login é feito por **e-mail + senha** (não username)
- Existem 3 tipos de usuário: `employee`, `customer`, `user`
- Um `employee` pode ser `staff` (acesso total) ou regular (acesso restrito)
- Um `customer` tem acesso apenas ao portal de compras
- Funcionários com `is_staff = true` podem criar/editar workflows, times, fornecedores e funcionários
- Todos os funcionários (staff ou não) podem acessar carros, clientes, vendas e tarefas

### Carros

- Cada carro pertence a uma **marca > modelo > carro**
- Campos obrigatórios: modelo, ano de fabricação, ano do modelo, cor, quilometragem, placa, preço de compra, preço de venda
- Campos opcionais: chassi, combustível, câmbio, descrição, fornecedor, imagem capa, imagens adicionais
- Status possíveis: `available` (disponível), `preparing` (em preparação), `sold` (vendido), `reserved` (reservado)
- Ao **criar um carro**, o sistema automaticamente cria uma instância de workflow do tipo `product` para ele (se houver workflow ativo desse tipo)
- Custos adicionais podem ser registrados por carro (ex: revisão, limpeza, documentação) com comprovante
- Um carro pode ter múltiplas imagens com ordenação

### Vendas

- Uma venda vincula: **um carro + um cliente + um funcionário**
- O carro precisa estar com status `available` para ser selecionado
- Ao **criar uma venda**, o carro automaticamente muda para status `sold`
- Ao criar uma venda, o sistema cria uma instância de workflow do tipo `sale`
- Status da venda: `open` (em andamento), `completed` (concluída), `canceled` (cancelada)
- O sistema calcula o **lucro da venda**: `preço_venda - preço_compra - custos_adicionais`
- A margem é calculada como: `(lucro / preço_venda) * 100`

### Clientes

- Podem ser Pessoa Física (CPF) ou Pessoa Jurídica (CNPJ)
- O documento é validado com algoritmo oficial de CPF/CNPJ
- Um cliente pode ter uma conta de acesso ao portal (opcional)
- Clientes veem apenas suas próprias compras no portal

### Fornecedores

- Sempre Pessoa Jurídica (CNPJ)
- Campos: nome, CNPJ, e-mail, telefone, endereço, observações, ativo/inativo
- Somente staff pode criar/editar fornecedores

### Workflows

O sistema de workflow é o núcleo operacional da plataforma. Funciona em dois níveis:

**Templates (configuração):**
- Um `Workflow` define um processo com nome, tipo (`product` ou `sale`) e etapas
- Cada `WorkflowStep` pertence a um `Team` (time responsável) e pode ter tarefas definidas
- Cada `WorkflowStepTask` é uma tarefa template dentro de uma etapa

**Instâncias (execução):**
- Ao criar um carro ou venda, o sistema instancia automaticamente o workflow ativo do tipo correspondente
- A `WorkflowInstance` é vinculada a um carro ou venda
- Cada `StepInstance` é criada a partir de um `WorkflowStep` template
- Cada `TaskInstance` é criada a partir de um `WorkflowStepTask` template
- Quando **todas as tarefas de uma etapa** são concluídas, a etapa é marcada como `completed`
- Quando **todas as etapas** são concluídas, o workflow é marcado como `completed`

### Times

- Um `Team` agrupa funcionários responsáveis por um conjunto de etapas
- Um funcionário pode pertencer a múltiplos times
- Tarefas são atribuídas a membros do time responsável pela etapa

### Tarefas

- Status: `pending`, `doing`, `done`, `canceled`
- Tarefas podem ser atribuídas a um funcionário específico do time
- Tarefas têm: comentários (com autor) e anexos (com uploader)
- "Minhas Tarefas" mostra todas as tarefas dos times que o funcionário pertence

---

## Entidades e Relacionamentos

```
User ──── Employee (1:1)
User ──── Customer (1:1, opcional)

CarBrand ──── CarModel (1:N)
CarModel ──── Car (1:N)
Provider ──── Car (1:N, opcional)
Car ──── CarImage (1:N)
Car ──── ProductCost (1:N)
Car ──── Sale (1:1)
Car ──── WorkflowInstance (1:N)

Customer ──── Sale (1:N)
Employee ──── Sale (1:N)

Sale ──── WorkflowInstance (1:N)

Team ──────── Employee (N:M)
Team ──────── WorkflowStep (1:N)

Workflow ──── WorkflowStep (1:N)
WorkflowStep ──── WorkflowStepTask (1:N)

WorkflowInstance ──── StepInstance (1:N)
StepInstance ──── TaskInstance (1:N)
TaskInstance ──── TaskComment (1:N)
TaskInstance ──── TaskAttachment (1:N)

Employee ──── TaskInstance (assigned_to, opcional)
Employee ──── TaskComment (author)
Employee ──── TaskAttachment (uploaded_by)
```

---

## Telas e Funcionalidades

### Autenticação

#### `/auth/login/` — Login
- Formulário com e-mail e senha
- Redirecionamento baseado no tipo de usuário:
  - Funcionário → dashboard
  - Cliente → portal
- Logout via POST em `/auth/logout/`

---

### Dashboard

#### `/` — Dashboard Principal
- Acesso: funcionários (qualquer nível)
- Cards de resumo:
  - Carros disponíveis (status=available)
  - Carros em preparação (status=preparing)
  - Vendas em andamento (status=open)
- Lista das 5 tarefas do funcionário logado (pending + doing)

---

### Carros

#### `/cars/` — Lista de Carros
- Acesso: funcionários
- Filtros: busca por placa/modelo, filtro por status
- Tabela: placa, marca/modelo, ano, cor (com swatch visual), quilometragem, preço de venda, status (badge colorido)
- Ações por linha: Ver, Editar
- Clique na linha → detalhe do carro
- Paginação (20 por página)

#### `/cars/new/` — Cadastrar Carro
- Acesso: funcionários
- Formulário em tabs:
  - **Informações Básicas**: modelo (marca > modelo), ano fabricação, ano modelo, cor, placa, quilometragem, chassi, combustível, câmbio, descrição + imagem capa + galeria de imagens
  - **Especificações**: (incluso na tab básica — câmbio, combustível)
  - **Financeiro**: fornecedor, preço de compra, preço de venda, status
- Upload de imagem capa + até 3 imagens extras (com preview e remoção)

#### `/cars/<id>/` — Detalhe do Carro
- Informações completas do veículo
- Galeria de imagens
- Histórico de custos adicionais com total
- Histórico de workflows vinculados

#### `/cars/<id>/edit/` — Editar Carro
- Mesmo formulário do cadastro, pré-preenchido

#### `/cars/<id>/costs/` — Custos do Carro
- Lista todos os custos adicionais
- Total de custos

#### `/cars/<id>/costs/new/` — Adicionar Custo
- Campos: descrição, valor, data, comprovante (arquivo)

---

### Fornecedores

#### `/providers/` — Lista de Fornecedores
- Acesso: funcionários
- Tabela: nome, CNPJ, e-mail, telefone, status
- Clique na linha → formulário de edição
- Paginação

#### `/providers/new/` — Cadastrar Fornecedor
- Acesso: staff
- Campos: nome, CNPJ (com máscara), e-mail, telefone (com máscara), endereço, observações, ativo

#### `/providers/<id>/edit/` — Editar Fornecedor
- Acesso: staff
- Mesmo formulário pré-preenchido

---

### Clientes

#### `/customers/` — Lista de Clientes
- Acesso: funcionários
- Tabela: nome, tipo (PF/PJ como badge), documento (oculto em mobile), e-mail, telefone, status
- Clique na linha → detalhe do cliente
- Paginação

#### `/customers/new/` — Cadastrar Cliente
- Campos: nome completo, tipo pessoa (PF/PJ), documento (máscara dinâmica CPF/CNPJ), e-mail, telefone, endereço, ativo
- A máscara do documento muda automaticamente ao selecionar o tipo de pessoa

#### `/customers/<id>/` — Detalhe do Cliente
- Informações pessoais
- Histórico de compras com links para cada venda

#### `/customers/<id>/edit/` — Editar Cliente
- Mesmo formulário pré-preenchido

---

### Funcionários

#### `/employees/` — Lista de Funcionários
- Acesso: staff
- Tabela: nome, e-mail, cargo, telefone, status
- Clique na linha → formulário de edição

#### `/employees/new/` — Cadastrar Funcionário
- Acesso: staff
- Dois cards: "Dados de Acesso" (e-mail, senha) + "Dados Pessoais" (nome, cargo, telefone, ativo)

#### `/employees/<id>/edit/` — Editar Funcionário
- Mesmo formulário, senha é opcional (deixar em branco mantém a atual)

---

### Vendas

#### `/sales/` — Lista de Vendas
- Acesso: funcionários
- Filtro por status
- Tabela: #ID, carro (marca/modelo/placa), cliente, funcionário, valor, status (badge), data
- Clique na linha → detalhe da venda
- Paginação

#### `/sales/new/` — Registrar Venda
- Campos: carro (somente disponíveis), cliente, funcionário (pré-preenchido com logado), valor, observações

#### `/sales/<id>/` — Detalhe da Venda
- Informações da venda
- Análise financeira: preço compra, custos adicionais, custo total, preço venda, **lucro**, margem %
- Workflows pós-venda vinculados com status de cada etapa

---

### Workflows (Templates)

#### `/workflows/` — Lista de Workflows
- Acesso: staff
- Tabela: nome, tipo, qtd etapas, status (ativo/inativo)
- Clique na linha → detalhe

#### `/workflows/new/` — Criar Workflow
- Campos: nome, tipo (product/sale), descrição, ativo

#### `/workflows/<id>/` — Detalhe do Workflow
- Lista de etapas ordenadas com: ordem (badge), nome, time, qtd tarefas
- Botão para adicionar nova etapa (abre modal)
- Clique na linha → detalhe da etapa
- Excluir etapa via modal de confirmação (AJAX)

#### `/workflows/<id>/steps/<step_id>/` — Detalhe da Etapa
- Lista de tarefas da etapa
- Botão para adicionar tarefa (abre modal)
- Excluir tarefa via modal de confirmação (AJAX)
- Adição e remoção sem recarregar a página

---

### Times

#### `/teams/` — Lista de Times
- Cards clicáveis com nome e total de membros

#### `/teams/new/` — Criar Time
- Campos: nome, descrição, membros (multi-select com busca)

#### `/teams/<id>/` — Detalhe do Time
- Lista de membros

---

### Tarefas

#### `/my-tasks/` — Minhas Tarefas
- Lista tarefas de todos os times que o funcionário pertence
- Agrupadas por status
- Link para detalhe de cada tarefa

#### `/tasks/<id>/` — Detalhe da Tarefa
- Informações da tarefa (título, status, responsável)
- Ações disponíveis:
  - Atualizar status
  - Atribuir a um membro do time
  - Adicionar comentário
  - Anexar arquivo
- Histórico de comentários
- Lista de anexos com link para download

---

### Portal do Cliente

#### `/portal/` — Portal do Cliente
- Acesso: clientes autenticados
- Lista de compras do cliente logado

#### `/portal/purchases/<id>/` — Detalhe da Compra
- Detalhes da venda
- Status do workflow pós-venda associado

---

## Permissões por Tela

| Tela | Employee | Staff |
|------|----------|-------|
| Dashboard | ✅ | ✅ |
| Carros (listar, ver, criar, editar) | ✅ | ✅ |
| Carros (custos) | ✅ | ✅ |
| Fornecedores (listar) | ✅ | ✅ |
| Fornecedores (criar, editar) | ❌ | ✅ |
| Clientes (todos) | ✅ | ✅ |
| Funcionários (todos) | ❌ | ✅ |
| Vendas (todos) | ✅ | ✅ |
| Times (listar, ver) | ✅ | ✅ |
| Times (criar) | ❌ | ✅ |
| Workflows (todos) | ❌ | ✅ |
| Minhas Tarefas | ✅ | ✅ |
| Tarefa (ver, atualizar) | ✅ | ✅ |
| Portal Cliente | Cliente | ❌ |

---

## Modelos de Dados Completos

### User
```ts
interface User {
  id: number
  email: string
  is_active: boolean
  is_staff: boolean
  date_joined: string // ISO datetime
}
```

### Employee
```ts
interface Employee {
  id: number
  user: User
  full_name: string
  phone: string | null        // máscara: (00) 00000-0000
  role: string | null
  is_active: boolean
  created_at: string
  updated_at: string
}
```

### Customer
```ts
interface Customer {
  id: number
  user: User | null
  full_name: string
  person_type: 'PF' | 'PJ'
  document: string            // CPF (11 dígitos) ou CNPJ (14 dígitos), somente números no banco
  email: string
  phone: string | null
  address: string | null
  is_active: boolean
  created_at: string
  updated_at: string
}
```

### CarBrand
```ts
interface CarBrand {
  id: number
  name: string
}
```

### CarModel
```ts
interface CarModel {
  id: number
  brand: CarBrand
  name: string
}
```

### Provider
```ts
interface Provider {
  id: number
  name: string
  document: string            // CNPJ, somente números no banco
  email: string | null
  phone: string | null
  address: string | null
  is_active: boolean
  notes: string | null
  created_at: string
  updated_at: string
}
```

### Car
```ts
type CarStatus = 'available' | 'preparing' | 'sold' | 'reserved'

interface Car {
  id: number
  car_model: CarModel
  year_manufacture: number
  year_model: number
  color: string
  mileage: number
  plate: string
  chassis: string | null
  fuel: string | null
  transmission: string | null
  description: string | null
  provider: Provider | null
  purchase_price: string      // Decimal como string
  sale_price: string
  status: CarStatus
  cover_image: string | null  // URL
  images: CarImage[]
  created_at: string
  updated_at: string
}

interface CarImage {
  id: number
  car: number
  image: string               // URL
  order: number
}
```

### ProductCost
```ts
interface ProductCost {
  id: number
  car: number
  description: string
  amount: string              // Decimal como string
  date: string                // ISO date YYYY-MM-DD
  receipt: string | null      // URL
}
```

### Sale
```ts
type SaleStatus = 'open' | 'completed' | 'canceled'

interface Sale {
  id: number
  car: Car
  customer: Customer
  employee: Employee
  sale_price: string
  status: SaleStatus
  notes: string | null
  sold_at: string | null
  created_at: string
  updated_at: string
}

interface ProfitData {
  purchase_price: string
  costs_total: string
  total_cost: string
  sale_price: string
  profit: string
  margin_percent: string
}
```

### Team
```ts
interface Team {
  id: number
  name: string
  description: string | null
  members: Employee[]
}
```

### Workflow (Template)
```ts
type WorkflowType = 'product' | 'sale'

interface Workflow {
  id: number
  name: string
  workflow_type: WorkflowType
  description: string | null
  is_active: boolean
  steps: WorkflowStep[]
}

interface WorkflowStep {
  id: number
  workflow: number
  team: Team
  name: string
  description: string | null
  order: number
  tasks: WorkflowStepTask[]
}

interface WorkflowStepTask {
  id: number
  step: number
  title: string
  description: string | null
  order: number
}
```

### WorkflowInstance (Execução)
```ts
type InstanceStatus = 'in_progress' | 'completed' | 'canceled'
type TaskStatus = 'pending' | 'doing' | 'done' | 'canceled'

interface WorkflowInstance {
  id: number
  name: string
  workflow_type: WorkflowType
  workflow: Workflow
  status: InstanceStatus
  car: number | null
  sale: number | null
  steps: StepInstance[]
}

interface StepInstance {
  id: number
  workflow_instance: number
  workflow_step: number
  team: Team
  name: string
  order: number
  status: InstanceStatus
  tasks: TaskInstance[]
}

interface TaskInstance {
  id: number
  step_instance: number
  title: string
  description: string | null
  status: TaskStatus
  assigned_to: Employee | null
  order: number
  comments: TaskComment[]
  attachments: TaskAttachment[]
}

interface TaskComment {
  id: number
  task: number
  author: Employee
  content: string
  created_at: string
}

interface TaskAttachment {
  id: number
  task: number
  uploaded_by: Employee
  file: string                // URL
  name: string
  created_at: string
}
```

---

## Labels e Traduções (PT-BR)

### Status de Carros
| Valor | Label |
|-------|-------|
| available | Disponível |
| preparing | Em preparação |
| sold | Vendido |
| reserved | Reservado |

### Status de Vendas
| Valor | Label |
|-------|-------|
| open | Em andamento |
| completed | Concluída |
| canceled | Cancelada |

### Status de Workflow/Step
| Valor | Label |
|-------|-------|
| in_progress | Em andamento |
| completed | Concluído |
| canceled | Cancelado |

### Status de Tarefas
| Valor | Label |
|-------|-------|
| pending | Pendente |
| doing | Em execução |
| done | Concluída |
| canceled | Cancelada |

### Tipo de Pessoa
| Valor | Label |
|-------|-------|
| PF | Pessoa Física |
| PJ | Pessoa Jurídica |

### Tipo de Workflow
| Valor | Label |
|-------|-------|
| product | Produto |
| sale | Venda |

---

## Cores por Status (Design System)

```
available / completed / done / ativo → verde (green)
preparing / open / in_progress / doing → amarelo/azul (yellow/blue)
sold / pending → cinza (gray)
reserved → azul (blue)
canceled → vermelho (red)
```

### Badges CSS (classes atuais no Django)
```
badge-completed → bg-green-100 text-green-800
badge-available → bg-green-100 text-green-800
badge-open      → bg-blue-100 text-blue-800
badge-pending   → bg-yellow-100 text-yellow-800
badge-preparing → bg-yellow-100 text-yellow-800
badge-sold      → bg-gray-100 text-gray-800
badge-reserved  → bg-blue-100 text-blue-800
badge-canceled  → bg-red-100 text-red-800
```

---

## Máscaras de Input

| Campo | Formato |
|-------|---------|
| Telefone fixo | (00) 0000-0000 |
| Celular | (00) 00000-0000 |
| CPF | 000.000.000-00 |
| CNPJ | 00.000.000/0000-00 |

- A máscara de telefone muda automaticamente entre fixo/celular baseado no 5º dígito
- A máscara de documento muda dinamicamente ao alternar PF/PJ
- O backend recebe **somente os dígitos** (sem formatação)

---

## Navegação (Sidebar)

```
Dashboard           → /
────────────────────
Carros             → /cars/
Fornecedores       → /providers/
────────────────────
Clientes           → /customers/
Funcionários       → /employees/   (staff only)
────────────────────
Vendas             → /sales/
────────────────────
Times              → /teams/
Workflows          → /workflows/   (staff only)
Minhas Tarefas     → /my-tasks/
────────────────────
[Avatar + Nome + Cargo]
Logout             → POST /auth/logout/
```

---

## Observações para o Frontend

1. **API ainda não existe** — a plataforma atual é server-side (Django templates). O frontend React precisará de uma API REST ou GraphQL no backend
2. **Autenticação** — usar JWT ou session-based auth dependendo da implementação da API
3. **Upload de arquivos** — imagens de carros, comprovantes de custo, anexos de tarefas (multipart/form-data)
4. **Paginação** — todas as listagens usam paginação de 20 itens
5. **AJAX/Tempo real** — operações de adicionar/remover tarefas e etapas de workflow foram implementadas sem reload de página
6. **Validação de documentos** — CPF e CNPJ devem ser validados no frontend antes de enviar (algoritmo de dígitos verificadores)
7. **Responsividade** — sistema mobile-first, colunas ocultadas progressivamente em telas menores
