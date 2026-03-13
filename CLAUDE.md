# CLAUDE.md — JG Motors Web

> Guia de arquitetura e engenharia para assistentes de IA trabalhando neste projeto.
> Leia este documento integralmente antes de gerar qualquer código.

---

## 1. Visão Geral do Projeto

**JG Motors Web** é uma plataforma de gestão automotiva para concessionárias e revendas de veículos. A aplicação oferece controle centralizado de estoque de veículos, pipeline de vendas, cadastro de clientes e fornecedores, gestão de funcionários e acompanhamento de workflows operacionais.

O sistema é utilizado por equipes internas (vendedores, gestores, administrativo) e requer autenticação. A interface é composta por um layout de app com sidebar fixa e header, onde cada seção do negócio corresponde a uma feature independente.

**Ambiente de execução:** SPA (Single Page Application) — cliente web, sem SSR.

---

## 2. Tech Stack

| Camada | Tecnologia | Versão |
|---|---|---|
| Linguagem | TypeScript | ~5.9 |
| Bundler | Vite | ^7.x |
| UI Framework | React | ^19.x |
| Estilos | Tailwind CSS | ^4.x (via `@tailwindcss/vite`) |
| Componentes base | shadcn/ui | ^4.x |
| Roteamento | TanStack Router | ^1.x |
| Server state | TanStack Query | ^5.x |
| Client state | Zustand | ^5.x |
| HTTP | Axios | ^1.x |
| Formulários | React Hook Form + Zod | ^7.x / ^4.x |
| Toasts | Sonner | ^2.x |
| Dark mode | next-themes | ^0.4.x |
| Ícones | lucide-react + react-icons | — |
| Fonte | DM Sans Variable | — |
| Utilitários CSS | `cn()` via `clsx` + `tailwind-merge` | — |
| Datas | date-fns | ^4.x |
| Gerenciador de pacotes | **npm** | — |

> **IMPORTANTE:** O gerenciador de pacotes é exclusivamente `npm`. Nunca usar `pnpm`, `yarn` ou `bun`.

---

## 3. Estrutura de Pastas

```
jgmotors-web/
├── docs/                        # Documentação de arquitetura do projeto
│   ├── ARCHITECTURE.md
│   ├── STATE_MANAGEMENT.md
│   ├── NAVIGATION_RULES.md
│   └── HOOK_RULES.md
├── templates/                   # Templates de referência para geração de código
│   ├── COMPONENT_TEMPLATE.md
│   ├── HOOK_TEMPLATE.md
│   └── PAGE_TEMPLATE.md
├── src/
│   ├── components/
│   │   ├── layout/              # Estrutura global da aplicação
│   │   │   ├── AppLayout.tsx    # Wrapper com Sidebar + Header + conteúdo
│   │   │   ├── Header.tsx       # Barra superior (busca, tema, notificações)
│   │   │   └── Sidebar.tsx      # Navegação lateral colapsável
│   │   ├── shared/              # Componentes reutilizáveis prefixados com App
│   │   │   ├── AppButton.tsx
│   │   │   ├── AppInput.tsx
│   │   │   ├── AppSelect.tsx
│   │   │   ├── AppMultiSelect.tsx
│   │   │   ├── AppSearchSelect.tsx
│   │   │   ├── AppTextarea.tsx
│   │   │   ├── AppTable.tsx         # Tabela estilo planilha
│   │   │   ├── AppDataTable.tsx     # Tabela de listagem com busca e paginação
│   │   │   └── StatCard.tsx         # Card de KPI para dashboards
│   │   └── ui/                  # Primitivos gerados pelo shadcn CLI (NÃO editar)
│   │       ├── button.tsx
│   │       ├── card.tsx
│   │       ├── input.tsx
│   │       └── ...
│   ├── features/                # Domínios de negócio (feature-based)
│   │   ├── auth/
│   │   │   └── pages/
│   │   │       └── LoginPage.tsx
│   │   ├── cars/
│   │   │   └── pages/
│   │   │       └── CarsPage.tsx
│   │   └── dashboard/
│   │       └── pages/
│   │           ├── DashboardPage.tsx
│   │           └── DesignSystemPage.tsx
│   ├── hooks/                   # Hooks genéricos reutilizáveis entre features
│   │   ├── useAuth.ts
│   │   └── useDebounce.ts
│   ├── lib/                     # Configurações de bibliotecas externas
│   │   ├── api.ts               # Instância Axios com interceptors JWT
│   │   ├── queryClient.ts       # Configuração do TanStack Query
│   │   └── utils.ts             # Função cn() e utilitários
│   ├── router/
│   │   ├── index.tsx            # Definição e registro de todas as rotas
│   │   └── guards.tsx           # Componentes de proteção de rota
│   ├── store/
│   │   └── auth.store.ts        # Store Zustand de autenticação (com persist)
│   ├── types/                   # Tipos globais de domínio
│   │   ├── auth.ts
│   │   ├── cars.ts
│   │   ├── customers.ts
│   │   ├── employees.ts
│   │   ├── providers.ts
│   │   ├── sales.ts
│   │   └── workflow.ts
│   ├── utils/                   # Funções utilitárias puras
│   │   ├── formatters.ts        # formatCurrency, formatDate, formatMileage
│   │   ├── masks.ts             # Máscaras de input (CPF, placa, telefone)
│   │   └── validators.ts        # Validações customizadas para Zod
│   ├── index.css                # Tailwind v4 + tokens do design system + dark mode
│   └── main.tsx                 # Entry point: ThemeProvider > QueryClient > Router
```

---

## 4. Princípios de Engenharia

### 4.1 Separação de responsabilidades

```
Serviço (HTTP)  →  Hook (TanStack Query)  →  Página (JSX)  →  Componente (visual)
```

- **Páginas** orquestram — não contêm lógica de negócio, apenas JSX e chamadas ao hook
- **Hooks** encapsulam — queries, mutations, estado local e callbacks
- **Serviços** comunicam — chamadas HTTP puras via `api.ts`, sem estado próprio
- **Componentes** renderizam — sem chamadas à API, sem dispatch direto ao store

### 4.2 Camadas de estado

| Tipo de estado | Ferramenta |
|---|---|
| Dados do servidor (listas, detalhes) | TanStack Query (`useQuery`, `useMutation`) |
| Estado global do cliente (auth, preferências) | Zustand |
| Estado local de UI (modal, filtro, tab) | `useState` / `useReducer` |
| Estado compartilhado entre sub-componentes de uma feature | React Context |

**Regra:** nunca colocar dados da API no Zustand. O TanStack Query já é o cache do servidor.

### 4.3 Particionamento de páginas (obrigatório)

Páginas devem ser **orquestradores enxutos** — apenas compõem sub-componentes e delegam dados/callbacks. Toda seção visual, definição de colunas de tabela, formulário, card de dados ou bloco de mock data deve viver em arquivo próprio.

**Estrutura obrigatória de uma feature com página:**

```
src/features/{domain}/
├── pages/
│   └── {Name}Page.tsx            # Orquestrador — apenas layout e composição
├── components/                   # Sub-componentes visuais da feature
│   ├── {Name}Table.tsx           # Definição de colunas e render de tabela
│   ├── {Name}Form.tsx            # Formulário completo (schema + fields)
│   └── {Name}Card.tsx            # Cards de dados específicos do domínio
└── data/                         # Mock data e configurações estáticas
    └── {name}.mock.ts            # Tipos locais, arrays mock, status configs
```

**Limites de tamanho:**
- Uma `{Name}Page.tsx` não deve ultrapassar **~80 linhas**
- Se o arquivo de página contém definição de colunas, mock data, formulários, sub-componentes inline ou lógica derivada — ele precisa ser particionado
- Cada sub-componente extraído deve ser **autocontido**: importar seus próprios ícones, tipos e dados

**Quando particionar:**
- A página tem **mais de 2 seções visuais distintas** (ex.: KPIs + tabela + cards)
- Existe um **formulário com schema de validação** — extrair para `{Name}Form.tsx`
- Existe **definição de colunas de tabela** — extrair para `{Name}Table.tsx`
- Existem **dados mock ou configurações** — extrair para `data/{name}.mock.ts`

### 4.4 Componentes

- Componentes compartilhados têm prefixo `App` e vivem em `src/components/shared/`
- Primitivos do shadcn em `src/components/ui/` **nunca são editados diretamente**
- Sempre criar um wrapper `App*` quando precisar customizar um primitivo do shadcn
- Componentes internos de uma feature ficam em `src/features/{domain}/components/` e não recebem o prefixo `App`
- Um componente sobe para `shared/` apenas quando for necessário em 2 ou mais features

### 4.5 Tipagem

- TypeScript estrito em todo o projeto — sem `any`, sem `object` genérico
- Tipos de domínio (entidades da API) ficam em `src/types/`
- DTOs de criação/edição ficam dentro da feature ou no serviço correspondente
- Props sempre explicitamente tipadas — sem inferência implícita

### 4.5 Estilo e dark mode

- Todo estilo via classes Tailwind v4 com a função `cn()` de `@/lib/utils`
- Tokens disponíveis: `bg-brand-{50..900}`, `text-brand-*`, `bg-navy-*`, `text-success`, `text-danger`, `text-warning`, `text-info`, `bg-success-bg`, `bg-danger-bg`, `bg-warning-bg`, `bg-info-bg`
- Dark mode via `.dark` no `html` (gerenciado pelo `next-themes`)
- Usar prefixo `dark:` para variações de dark mode quando necessário
- Tokens semânticos adaptativos (`bg-success-bg`, etc.) já se adaptam via CSS variables — preferir esses em vez de cores hardcoded

---

## 5. Regras para Criar Novas Features

### Estrutura mínima de uma feature nova

```
src/features/{domain}/
├── pages/
│   └── {Name}Page.tsx           # Obrigatório
├── hooks/
│   └── use{Name}.ts             # Obrigatório se tiver dados da API
└── services/
    └── {name}.service.ts        # Obrigatório se tiver chamadas HTTP
```

### Estrutura completa (feature com CRUD)

```
src/features/{domain}/
├── pages/
│   ├── {Name}ListPage.tsx
│   └── {Name}DetailPage.tsx
├── hooks/
│   ├── use{Names}.ts            # query de listagem
│   ├── use{Name}.ts             # query de detalhe
│   └── use{Name}Mutations.ts    # create, update, delete
├── services/
│   └── {name}.service.ts
├── components/                  # sub-componentes privados da feature
│   └── {Name}StatusBadge.tsx
└── {name}.keys.ts               # query keys do domínio
```

### Passo a passo para adicionar uma feature

1. Criar os tipos em `src/types/{domain}.ts`
2. Criar o serviço em `src/features/{domain}/services/{domain}.service.ts`
3. Definir as query keys em `src/features/{domain}/{domain}.keys.ts`
4. Criar os hooks em `src/features/{domain}/hooks/`
5. Criar a(s) página(s) em `src/features/{domain}/pages/`
6. Registrar a(s) rota(s) em `src/router/index.tsx`
7. Adicionar o link no `Sidebar.tsx`

---

## 6. Regras de Geração de Código para IA

### Antes de gerar qualquer código

1. **Leia os arquivos existentes** relacionados ao domínio antes de criar algo novo
2. **Verifique `src/components/shared/`** — o componente que você precisa pode já existir
3. **Verifique `src/types/`** — os tipos da entidade podem já estar definidos
4. **Verifique `src/router/index.tsx`** — veja o padrão de rota antes de adicionar uma nova
5. **Verifique `src/features/cars/`** — use como referência de feature implementada

### Padrões obrigatórios ao gerar código

#### Páginas
```tsx
// ✅ Correto
export function CarsPage() { ... }     // named export, function declaration

// ❌ Errado
export default function CarsPage() {} // export default
const CarsPage = () => {}             // sem export ou const sem named export
```

#### Componentes compartilhados
```tsx
// ✅ Correto — prefixo App, named export, cn() para classes
export function AppStatusBadge({ label, variant }: AppStatusBadgeProps) {
  return <span className={cn("...", VARIANT_CLASSES[variant])}>{label}</span>
}

// ❌ Errado — sem prefixo, sem tipagem, cores hardcoded
export default function StatusBadge({ label }) {
  return <span style={{ backgroundColor: "#01b574" }}>{label}</span>
}
```

#### Hooks de query
```tsx
// ✅ Correto — query key estruturada, serviço separado
export const carsKeys = {
  all: ["cars"] as const,
  list: (params: CarsParams) => ["cars", "list", params] as const,
}

export function useCars(params: CarsParams) {
  return useQuery({
    queryKey: carsKeys.list(params),
    queryFn: () => carsService.list(params),
  })
}
```

#### Serviços
```tsx
// ✅ Correto — função pura, retorno tipado, sem estado
export const carsService = {
  list: (params: CarsParams) =>
    api.get<PaginatedResponse<Vehicle>>("/vehicles/", { params }).then((r) => r.data),

  getById: (id: string) =>
    api.get<Vehicle>(`/vehicles/${id}/`).then((r) => r.data),
}
```

#### Importações
```tsx
// ✅ Usar aliases — nunca caminhos relativos para src/
import { AppButton } from "@/components/shared/AppButton"
import { useCars } from "@/features/cars/hooks/useCars"
import { cn } from "@/lib/utils"

// ❌ Errado
import { AppButton } from "../../components/shared/AppButton"
```

### Geração de formulários

Formulários usam **React Hook Form + Zod**:

```tsx
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"

const schema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  price: z.coerce.number().positive("Preço deve ser positivo"),
})

type FormData = z.infer<typeof schema>

export function CarForm({ onSubmit }: { onSubmit: (data: FormData) => void }) {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <AppInput label="Nome" error={errors.name?.message} {...register("name")} />
      <AppButton type="submit">Salvar</AppButton>
    </form>
  )
}
```

### Formatação de dados

Sempre usar os utilitários de `src/utils/formatters.ts`:

```tsx
import { formatCurrency, formatDate, formatMileage } from "@/utils/formatters"

formatCurrency(45000)      // "R$ 45.000,00"
formatDate("2024-01-15")   // "15/01/2024"
formatMileage(32500)       // "32.500 km"
```

---

## 7. Restrições — O que a IA NÃO deve fazer

### Estrutura e arquitetura
- ❌ **Não usar `export default`** em páginas, componentes ou hooks — sempre named export
- ❌ **Não criar rotas no formato file-based** — todo roteamento é code-based em `src/router/index.tsx`
- ❌ **Não ativar o `TanStackRouterVite` plugin** no `vite.config.ts` — causará erro ENOENT
- ❌ **Não editar arquivos em `src/components/ui/`** — são gerados pelo shadcn CLI
- ❌ **Não criar stores Zustand para dados da API** — use TanStack Query como cache
- ❌ **Não fazer chamadas Axios diretamente em componentes ou páginas**

### Código
- ❌ **Não usar `any`** em nenhum tipo ou asserção
- ❌ **Não usar `style={{}}`** inline para layout — apenas Tailwind classes
- ❌ **Não usar cores hardcoded** como `bg-[#3B82F6]` quando existe token equivalente (`bg-brand-500`)
- ❌ **Não usar `console.log`** — apenas `console.warn` e `console.error`
- ❌ **Não usar caminhos relativos para imports** dentro de `src/` — sempre usar o alias `@/`
- ❌ **Não suprimir warnings do ESLint** com `// eslint-disable-line` sem justificativa explícita
- ❌ **Não usar `React.FC<>`** para tipar componentes
- ❌ **Não criar abstrações prematuras** — três linhas similares são melhores que uma abstração desnecessária

### Pacotes e dependências
- ❌ **Não usar `pnpm`, `yarn` ou `bun`** — apenas `npm`
- ❌ **Não instalar bibliotecas de estilo alternativas** (emotion, styled-components, CSS Modules) — o projeto usa exclusivamente Tailwind
- ❌ **Não instalar bibliotecas de formulário alternativas** (Formik, etc.) — o projeto usa React Hook Form + Zod
- ❌ **Não instalar bibliotecas de toast alternativas** (react-toastify, etc.) — o projeto usa Sonner

---

## 8. Guia de Criação de Componentes, Hooks e Serviços

### Componentes compartilhados (`src/components/shared/App*.tsx`)

**Quando criar:**
- Usado por 2 ou mais features diferentes
- Tem identidade visual consistente com o design system
- Pode ser generalizado com props bem definidas

**Template:**
```tsx
import { cn } from "@/lib/utils"

// Mapa de variantes (quando aplicável)
const VARIANT_CLASSES = {
  default: "bg-muted text-muted-foreground",
  success: "bg-success-bg text-success",
  warning: "bg-warning-bg text-warning",
  danger:  "bg-danger-bg text-danger",
} satisfies Record<string, string>

type Variant = keyof typeof VARIANT_CLASSES

interface App{Name}Props {
  variant?: Variant
  className?: string
  // props específicas...
}

export function App{Name}({
  variant = "default",
  className,
  ...props
}: App{Name}Props) {
  return (
    <element
      className={cn(
        "classes-base",
        VARIANT_CLASSES[variant],
        className,
      )}
      {...props}
    />
  )
}
```

**Checklist:**
- [ ] Named export, sem `export default`
- [ ] Prefixo `App`
- [ ] Props explicitamente tipadas, sem `any`
- [ ] Aceita `className` como prop para override externo
- [ ] Usa `cn()` para composição de classes
- [ ] Usa tokens do design system, não cores hardcoded
- [ ] Testado em light mode e dark mode

---

### Hooks de domínio (`src/features/{domain}/hooks/`)

**Quando criar:**
- Encapsula `useQuery` ou `useMutation` de um domínio
- Contém lógica derivada de dados da API (contagens, filtros, permissões)
- Será compartilhado entre mais de um componente dentro da feature

**Template de query:**
```ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { {name}Service } from "../services/{name}.service"

export const {name}Keys = {
  all: ["{name}"] as const,
  list: (params: {Name}Params) => ["{name}", "list", params] as const,
  detail: (id: string) => ["{name}", "detail", id] as const,
}

export function use{Names}(params: {Name}Params) {
  return useQuery({
    queryKey: {name}Keys.list(params),
    queryFn: () => {name}Service.list(params),
  })
}

export function useCreate{Name}() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: {name}Service.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: {name}Keys.all })
    },
  })
}
```

**Checklist:**
- [ ] Named export com `function` declaration
- [ ] Query keys definidas no mesmo arquivo com `as const`
- [ ] `enabled` configurado quando o parâmetro pode ser undefined
- [ ] Mutations invalidam o cache relevante no `onSuccess`
- [ ] Sem chamadas Axios diretas — sempre via serviço
- [ ] Sem `any` types

---

### Serviços (`src/features/{domain}/services/{name}.service.ts`)

**Template:**
```ts
import { api } from "@/lib/api"
import type { {Name}, Create{Name}DTO, Update{Name}DTO } from "@/types/{name}"

export interface {Name}ListParams {
  page?: number
  search?: string
}

export const {name}Service = {
  list: (params: {Name}ListParams) =>
    api.get<PaginatedResponse<{Name}>>("/endpoint/", { params }).then((r) => r.data),

  getById: (id: string) =>
    api.get<{Name}>(`/endpoint/${id}/`).then((r) => r.data),

  create: (dto: Create{Name}DTO) =>
    api.post<{Name}>("/endpoint/", dto).then((r) => r.data),

  update: (id: string, dto: Update{Name}DTO) =>
    api.patch<{Name}>(`/endpoint/${id}/`, dto).then((r) => r.data),

  delete: (id: string) =>
    api.delete(`/endpoint/${id}/`).then((r) => r.data),
}
```

**Checklist:**
- [ ] Objeto exportado com métodos nomeados (não classes)
- [ ] Todos os métodos retornam `Promise<T>` explicitamente tipado via genérico do Axios
- [ ] Parâmetros tipados com interfaces locais ou importadas de `src/types/`
- [ ] Sem estado interno — funções puras de IO
- [ ] URL base vem de `api.ts` — não hardcodear `localhost` ou domínio

---

## 9. Verificação de Código Existente Antes de Gerar

Antes de criar qualquer artefato novo, execute as seguintes verificações:

### 1. Existe o componente?
```
src/components/shared/          ← componentes App*
src/components/ui/              ← primitivos shadcn
src/features/{domain}/components/  ← componentes internos da feature
```

### 2. Existe o tipo?
```
src/types/{domain}.ts           ← tipos de entidade
```
Se não existir, crie o tipo antes do componente ou hook.

### 3. Existe o hook?
```
src/features/{domain}/hooks/    ← hooks de domínio
src/hooks/                      ← hooks genéricos
```

### 4. Existe o serviço?
```
src/features/{domain}/services/ ← serviços de domínio
```

### 5. A rota está registrada?
```
src/router/index.tsx            ← toda rota deve estar aqui
```

### 6. O link está no Sidebar?
```
src/components/layout/Sidebar.tsx  ← navegação lateral
```

### Referências de implementação

Antes de criar algo novo, leia como foi feito em features já implementadas:

| O que precisa | Feature de referência |
|---|---|
| Página de listagem com tabela | `src/features/cars/pages/CarsPage.tsx` |
| Dashboard com KPIs e gráficos | `src/features/dashboard/pages/DashboardPage.tsx` |
| Todos os componentes disponíveis | `src/features/dashboard/pages/DesignSystemPage.tsx` |
| Store Zustand com persist | `src/store/auth.store.ts` |
| Instância Axios com JWT | `src/lib/api.ts` |
| Definição de rotas | `src/router/index.tsx` |

---

## 10. Design System — Referência Rápida

### Tokens de cor disponíveis

| Token | Uso |
|---|---|
| `bg-brand-500` / `text-brand-500` | Cor primária da plataforma (azul) |
| `bg-navy-700` / `bg-navy-800` | Fundos escuros (sidebar dark) |
| `text-success` / `bg-success-bg` | Status: aprovado, disponível, concluído |
| `text-warning` / `bg-warning-bg` | Status: pendente, em revisão, atenção |
| `text-danger` / `bg-danger-bg` | Status: rejeitado, erro, excluir |
| `text-info` / `bg-info-bg` | Status: informação, em andamento |
| `bg-card` | Fundo de cards (branco no light, navy-card no dark) |
| `bg-background` | Fundo da página (`#F4F7FE` no light) |
| `text-muted-foreground` | Textos secundários e legendas |
| `border-border` | Bordas padrão |

### Componentes `App*` disponíveis

| Componente | Descrição |
|---|---|
| `AppButton` | Botão com variantes `intent` (success, warning, danger, info) e `soft` |
| `AppInput` | Input com label, hint, erro e toggle de senha automático |
| `AppTextarea` | Textarea com label, hint, erro e controle de resize |
| `AppSelect` | Select simples com label e erro |
| `AppMultiSelect` | Select com seleção múltipla e chips |
| `AppSearchSelect` | Select com busca integrada (combobox) |
| `AppDataTable` | Tabela de listagem com Card, busca, paginação e ações |
| `AppTable` | Tabela estilo planilha com variantes striped e bordered |
| `StatCard` | Card de KPI com ícone, valor e variação percentual |

### Roteamento atual

| Path | Componente |
|---|---|
| `/login` | `LoginPage` (sem AppLayout) |
| `/` | `DashboardPage` |
| `/cars` | `CarsPage` |
| `/design-system` | `DesignSystemPage` |
