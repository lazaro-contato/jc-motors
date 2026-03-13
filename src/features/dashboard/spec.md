# Dashboard Feature — Especificação Técnica

> Última atualização: Março 2026

---

## Visão Geral

Feature principal da aplicação. Exibe um resumo operacional da concessionária: KPIs, vendas recentes, tarefas pendentes, estoque de veículos e desempenho por vendedor. Também hospeda a página de Design System para referência visual.

**Rotas:** `/` (dashboard), `/design-system` (catálogo de componentes)
**Layout:** Dentro do `AppLayout` (sidebar + header)

---

## Estrutura de Arquivos

```
src/features/dashboard/
├── pages/
│   ├── DashboardPage.tsx         # Orquestrador principal (~97 linhas)
│   └── DesignSystemPage.tsx      # Catálogo de componentes App*
├── components/
│   ├── RecentSalesTable.tsx      # Tabela de vendas recentes
│   ├── TaskList.tsx              # Lista de tarefas pendentes
│   ├── InventoryCard.tsx         # Card de estoque com barra de progresso
│   ├── TopSellersCard.tsx        # Ranking de vendedores
│   └── SecondaryMetrics.tsx      # Cards de métricas secundárias
└── data/
    └── dashboard.mock.ts         # Tipos, mock data, status configs
```

---

## Páginas

### `DashboardPage.tsx` — Painel Principal

| Item | Detalhe |
|---|---|
| Rota | `/` |
| Export | `export default function DashboardPage()` |
| Linhas | ~97 (dentro do limite de particionamento) |

#### Seções da página

| Seção | Componente | Grid |
|---|---|---|
| Saudação | Inline (greeting + date) | Full width |
| KPIs | 4x `StatCard` | `grid-cols-2 xl:grid-cols-4` |
| Métricas secundárias | `SecondaryMetrics` | `grid-cols-2 xl:grid-cols-4` |
| Vendas + Tarefas | `RecentSalesTable` + `TaskList` | `xl:grid-cols-3` (2:1) |
| Estoque + Vendedores | `InventoryCard` + `TopSellersCard` | `xl:grid-cols-3` (1:2) |

#### Dependências externas

| Dependência | Uso |
|---|---|
| `useAuthStore` | Nome do usuário para saudação personalizada |
| `StatCard` | Cards de KPI com ícone, valor e trend |
| `Button` (shadcn) | Botão "Relatório do mês" |

---

## Componentes

### `RecentSalesTable.tsx`

Tabela das 5 vendas mais recentes usando `AppDataTable`.

| Coluna | Key | Detalhes |
|---|---|---|
| Veículo | `vehicle` | Ícone Car + nome + data |
| Cliente | `customer` | Texto simples |
| Vendedor | `employee` | Texto simples |
| Valor | `price` | Alinhado à direita, `font-semibold` |
| Status | `status` | Badge: Em aberto / Concluída / Cancelada |
| Ações | `_actions` | Botão Eye (visualizar) |

**Status de vendas:**

| Status | Label | Estilo |
|---|---|---|
| `open` | Em aberto | `bg-info-bg text-info` |
| `completed` | Concluída | `bg-success-bg text-success` |
| `canceled` | Cancelada | `bg-danger-bg text-danger` |

### `TaskList.tsx`

Lista de tarefas pendentes do usuário com ícones de status animados.

| Item | Detalhe |
|---|---|
| Container | `Card` com header + dividers internos |
| Ícone de status | `Circle` (pending), `Loader2` com spin (doing), `CheckCircle2` (done) |
| Destaque de urgência | `text-danger` quando `due === "Hoje"` |
| Estilo de conclusão | `opacity-50` + `line-through` para tarefas `done` |

### `InventoryCard.tsx`

Card com barra de progresso empilhada mostrando a distribuição do estoque.

| Item | Detalhe |
|---|---|
| Barra | Stacked progress bar com 4 segmentos coloridos |
| Legenda | Grid 2x2 com dot colorido + label + count |
| Ação | Botão "Ver todos os veículos" |

### `TopSellersCard.tsx`

Ranking dos vendedores por receita gerada no mês.

| Item | Detalhe |
|---|---|
| Ranking | Número em circle `bg-brand-500/10` |
| Barra de desempenho | Progress bar `bg-brand-500` |
| Métricas | Revenue + count de vendas |

### `SecondaryMetrics.tsx`

Grid de 4 cards compactos com métricas operacionais.

| Métrica | Ícone | Valor |
|---|---|---|
| Clientes Ativos | `Users` | 127 |
| Vendas Concluídas | `CheckCircle2` | 4 |
| Workflows Abertos | `Loader2` | 9 |
| Tempo Médio Prep. | `Clock` | 4 d |

### `DesignSystemPage.tsx`

Catálogo de referência visual com todos os componentes `App*` da plataforma. Utilizado para testes visuais e documentação interativa do design system.

---

## Dados Mock (`dashboard.mock.ts`)

### Tipos exportados

- `SaleStatus`: `"open" | "completed" | "canceled"`
- `TaskStatus`: `"pending" | "doing" | "done" | "canceled"`
- `CarStatus`: `"available" | "preparing" | "reserved" | "sold"`
- `RecentSale`, `RecentTask`, `InventoryStatus`, `TopSeller`

### Constantes exportadas

- `RECENT_SALES` — 5 vendas recentes
- `RECENT_TASKS` — 6 tarefas
- `INVENTORY_STATUS` — 4 categorias de estoque
- `TOP_SELLERS` — 4 vendedores
- `SALE_STATUS` — mapa status → label + className

---

## Próximos Passos

- [ ] Conectar KPIs ao backend (agregar dados reais)
- [ ] Vendas recentes via `useSales` com limite de 5
- [ ] Tarefas via `useTasks` filtradas pelo usuário logado
- [ ] Estoque via `useCars` com agregação por status
- [ ] Ranking de vendedores via endpoint de relatórios
