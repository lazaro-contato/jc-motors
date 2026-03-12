# Arquitetura — JG Motors Web

## Stack Principal

| Camada | Tecnologia |
|---|---|
| Linguagem | TypeScript 5.x |
| Bundler | Vite 7.x |
| UI | React 19 |
| Estilos | Tailwind CSS v4 |
| Componentes | shadcn/ui |
| Roteamento | TanStack Router |
| Server state | TanStack Query v5 |
| Client state | Zustand 5 |
| HTTP | Axios (com interceptors) |

---

## Estrutura de Pastas

```
src/
├── assets/                  # Imagens, SVGs estáticos
├── components/
│   ├── layout/              # Componentes estruturais da aplicação
│   │   ├── Header.tsx
│   │   ├── Sidebar.tsx
│   │   └── MainLayout.tsx
│   ├── shared/              # Componentes reutilizáveis com prefixo App
│   │   ├── AppButton.tsx
│   │   ├── AppInput.tsx
│   │   ├── AppSelect.tsx
│   │   ├── AppTextarea.tsx
│   │   ├── AppTable.tsx
│   │   ├── AppDataTable.tsx
│   │   └── ...
│   └── ui/                  # Primitivos gerados pelo shadcn/ui (não editar)
│       ├── button.tsx
│       ├── input.tsx
│       └── ...
├── features/                # Domínios de negócio
│   ├── auth/
│   │   ├── pages/
│   │   │   └── LoginPage.tsx
│   │   ├── hooks/
│   │   │   └── useAuth.ts
│   │   └── services/
│   │       └── auth.service.ts
│   ├── cars/
│   │   ├── pages/
│   │   │   ├── CarsPage.tsx
│   │   │   └── CarDetailPage.tsx
│   │   ├── hooks/
│   │   │   └── useCars.ts
│   │   └── services/
│   │       └── cars.service.ts
│   ├── dashboard/
│   │   └── pages/
│   │       └── DashboardPage.tsx
│   └── {domain}/
│       ├── pages/
│       ├── hooks/
│       └── services/
├── lib/
│   ├── api.ts               # Instância Axios com interceptors
│   ├── queryClient.ts       # Configuração do TanStack Query
│   └── utils.ts             # Utilitários (cn, formatters)
├── router/
│   └── index.tsx            # Definição de todas as rotas
├── store/
│   └── auth.store.ts        # Store Zustand de autenticação
├── types/
│   └── index.ts             # Tipos globais compartilhados
├── index.css                # Tailwind v4 + tema shadcn + tokens customizados
└── main.tsx                 # Entry point (ThemeProvider + QueryClient + Router)
```

---

## Camadas da Aplicação

### 1. Camada de UI — `pages/` e `components/`

- **Páginas** (`features/{domain}/pages/`): componentes React que representam uma rota. Orquestram hooks e montam o layout.
- **Componentes compartilhados** (`components/shared/App*.tsx`): wrappers sobre shadcn/ui com a identidade visual da plataforma. Nunca usar primitivos do shadcn diretamente nas páginas.
- **Componentes de layout** (`components/layout/`): estrutura global da aplicação (sidebar, header, wrapper de página).

### 2. Camada de Lógica — `hooks/`

- **Hooks de domínio** (`features/{domain}/hooks/`): encapsulam queries, mutations e lógica de negócio específica do domínio.
- **Hooks genéricos**: ficam em `src/hooks/` quando reutilizáveis entre domínios.
- Nenhuma chamada ao Axios deve acontecer diretamente dentro de componentes.

### 3. Camada de Serviços — `services/`

- **Serviços** (`features/{domain}/services/`): funções puras que chamam a API via `lib/api.ts`. Recebem parâmetros e retornam dados.
- Não possuem estado próprio; apenas fazem a chamada HTTP e retornam o resultado.

---

## Particionamento de Páginas

Páginas são **orquestradores**, não monolitos. Toda seção visual, definição de colunas, formulário ou bloco de dados deve ser extraído para arquivo próprio.

### Estrutura obrigatória

```
src/features/{domain}/
├── pages/
│   └── {Name}Page.tsx            # Máximo ~80 linhas — apenas layout e composição
├── components/                   # Sub-componentes visuais da feature
│   ├── {Name}Table.tsx           # Definição de colunas + renders de tabela
│   ├── {Name}Form.tsx            # Formulário (schema Zod + campos + actions)
│   └── {SubSection}Card.tsx      # Cards de dados específicos
└── data/                         # Dados estáticos e mock data
    └── {name}.mock.ts            # Tipos locais, arrays mock, status configs
```

### Sinais de que uma página precisa ser particionada

- Mais de **~80 linhas**
- Definição de **colunas de tabela** inline
- **Schema de validação** (Zod) definido dentro da página
- **Sub-componentes** (`function TaskList()`) definidos no mesmo arquivo
- **Arrays de mock data** ou configurações estáticas no topo

### Exemplo real

A `DashboardPage` orquestra 5 seções, cada uma em seu próprio componente:

```tsx
// DashboardPage.tsx — ~80 linhas, apenas composição
export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <GreetingHeader />
      <KpiCards />
      <SecondaryMetrics />
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <RecentSalesTable />
        <TaskList />
      </div>
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <InventoryCard />
        <TopSellersCard />
      </div>
    </div>
  )
}
```

---

## Regras de Organização

### Quando criar um componente em `components/shared/`

Um componente entra em `shared/` quando:
- É utilizado em **2 ou mais features** diferentes
- Tem identidade visual consistente com o design system
- Possui props bem definidas e comportamento previsível

Siga o padrão `App{NomePascalCase}.tsx`.

### Quando manter o componente dentro da feature

- Usada por apenas **1 página** dentro da feature
- Lógica muito específica do domínio (ex.: `SaleStatusBadge`)
- Não faz sentido como abstração genérica

### Regra dos primitivos shadcn/ui

Os arquivos em `components/ui/` são gerados pelo shadcn CLI e **não devem ser editados manualmente**. Crie sempre um wrapper em `components/shared/` para adicionar comportamento ou estilização customizada.

---

## Convenções de Nomenclatura

| Artefato | Convenção | Exemplo |
|---|---|---|
| Páginas | `{Nome}Page.tsx` (PascalCase) | `CarsPage.tsx` |
| Componentes compartilhados | `App{Nome}.tsx` | `AppDataTable.tsx` |
| Hooks de domínio | `use{Nome}.ts` | `useCars.ts` |
| Serviços | `{nome}.service.ts` (camelCase) | `cars.service.ts` |
| Stores Zustand | `{nome}.store.ts` | `auth.store.ts` |
| Tipos globais | PascalCase em `types/index.ts` | `Vehicle`, `SaleOrder` |

---

## Fluxo de Dados

```
Página (orquestra)
  └── Hook de domínio (useQuery / useMutation)
        └── Serviço (chamada HTTP via api.ts)
              └── API REST (backend)
```

Estado global (Zustand) é lido diretamente nas páginas ou hooks quando necessário. Nunca passar dados globais por props profundas (prop drilling).

---

## Decisões Arquiteturais

- **Routing code-based**: rotas definidas em `src/router/index.tsx` com `createRoute`/`createRouter`. Não usar file-based routing (o plugin `@tanstack/router-vite-plugin` está instalado mas desativado).
- **Dark mode via next-themes**: `ThemeProvider` no `main.tsx` com `attribute="class"`. Tokens adaptativos definidos em `:root` e `.dark` no `index.css`.
- **Tailwind v4**: configurado via plugin `@tailwindcss/vite`. Tokens customizados via `@theme` (estáticos) e `:root`/`.dark` (adaptativos ao tema).
- **Gerenciador de pacotes**: `npm` exclusivamente. Não usar `pnpm`, `yarn` ou `bun`.
