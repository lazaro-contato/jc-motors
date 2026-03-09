# JG Motors — Setup do Frontend

Stack: **TypeScript + Vite + React + Tailwind v4 + TanStack + Zustand + shadcn/ui + React Icons**

> **Nota:** Este projeto usa **npm**. Vite 7.x (compatível com todas as configs abaixo).

---

## 1. Criação do Projeto

```bash
npm create vite@latest jgmotors-web --template react-ts
cd jgmotors-web
npm install
```

---

## 2. Tailwind CSS v4

```bash
npm install tailwindcss @tailwindcss/vite
```

### `vite.config.ts`
```ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '@': '/src',
    },
  },
})
```

### `src/index.css`
```css
@import "tailwindcss";

@theme {
  --color-primary-50: #eff6ff;
  --color-primary-100: #dbeafe;
  --color-primary-500: #3b82f6;
  --color-primary-600: #2563eb;
  --color-primary-700: #1d4ed8;

  --font-sans: 'Inter', ui-sans-serif, system-ui, sans-serif;
}
```

---

## 3. Dependências Principais

```bash
# Roteamento
npm install @tanstack/react-router

# Data fetching + cache
npm install @tanstack/react-query @tanstack/react-query-devtools

# Tabelas
npm install @tanstack/react-table

# Estado global
npm install zustand

# Ícones
npm install react-icons

# Utilitários de formulário
npm install react-hook-form @hookform/resolvers zod

# Utilitários de data
npm install date-fns

# HTTP client
npm install axios

# Merge de classes (para shadcn)
npm install clsx tailwind-merge class-variance-authority
```

---

## 4. shadcn/ui

```bash
npm install lucide-react
npx shadcn@latest init
```

Responda as perguntas do CLI:
- Style: **Default**
- Base color: **Slate**
- CSS variables: **Yes**

### Componentes base para instalar
```bash
npx shadcn@latest add button
npx shadcn@latest add input
npx shadcn@latest add label
npx shadcn@latest add select
npx shadcn@latest add textarea
npx shadcn@latest add card
npx shadcn@latest add badge
npx shadcn@latest add dialog
npx shadcn@latest add dropdown-menu
npx shadcn@latest add table
npx shadcn@latest add tabs
npx shadcn@latest add toast
npx shadcn@latest add sonner
npx shadcn@latest add avatar
npx shadcn@latest add separator
npx shadcn@latest add form
npx shadcn@latest add alert
npx shadcn@latest add skeleton
npx shadcn@latest add popover
npx shadcn@latest add command
npx shadcn@latest add sheet
```

---

## 5. ESLint

```bash
npm install -D \
  eslint \
  @eslint/js \
  typescript-eslint \
  eslint-plugin-react \
  eslint-plugin-react-hooks \
  eslint-plugin-react-refresh \
  eslint-plugin-import \
  eslint-plugin-jsx-a11y \
  globals
```

### `eslint.config.js`
```js
import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import react from 'eslint-plugin-react'
import importPlugin from 'eslint-plugin-import'
import jsxA11y from 'eslint-plugin-jsx-a11y'
import tseslint from 'typescript-eslint'

export default tseslint.config(
  { ignores: ['dist', 'node_modules', '.vite'] },

  // Base JS rules
  js.configs.recommended,

  // TypeScript rules
  ...tseslint.configs.recommendedTypeChecked,
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },

  // React + Hooks + Refresh
  {
    files: ['**/*.{ts,tsx}'],
    plugins: {
      react,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      import: importPlugin,
      'jsx-a11y': jsxA11y,
    },
    languageOptions: {
      globals: globals.browser,
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
    },
    settings: {
      react: { version: 'detect' },
      'import/resolver': {
        typescript: { alwaysTryTypes: true },
      },
    },
    rules: {
      // React
      ...react.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',
      'react/display-name': 'warn',

      // TypeScript
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/consistent-type-imports': ['error', { prefer: 'type-imports' }],
      '@typescript-eslint/no-floating-promises': 'error',
      '@typescript-eslint/no-misused-promises': 'error',

      // Import ordering
      'import/order': ['error', {
        groups: [
          'builtin',
          'external',
          'internal',
          ['parent', 'sibling', 'index'],
          'type',
        ],
        'newlines-between': 'always',
        alphabetize: { order: 'asc', caseInsensitive: true },
      }],
      'import/no-duplicates': 'error',

      // General
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'prefer-const': 'error',
      'no-var': 'error',
      eqeqeq: ['error', 'always'],
    },
  },
)
```

> **Nota:** Mantido como `.js` (não `.ts`) para compatibilidade com Vite 7.x e ESLint 9 flat config.

### `package.json` — scripts
```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "preview": "vite preview",
    "lint": "eslint .",
    "lint:fix": "eslint . --fix",
    "typecheck": "tsc --noEmit"
  }
}
```

---

## 6. TypeScript — `tsconfig.json`

```json
{
  "files": [],
  "references": [
    { "path": "./tsconfig.app.json" },
    { "path": "./tsconfig.node.json" }
  ]
}
```

### `tsconfig.app.json`
```json
{
  "compilerOptions": {
    "tsBuildInfoFile": "./node_modules/.tmp/tsconfig.app.tsbuildinfo",
    "target": "ES2022",
    "useDefineForClassFields": true,
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "verbatimModuleSyntax": true,
    "moduleDetection": "force",
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "erasableSyntaxOnly": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedIndexedAccess": true,
    "noUncheckedSideEffectImports": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  },
  "include": ["src"]
}
```

> **Nota (Vite 7.x):** Mantidas as flags modernas do template padrão: `verbatimModuleSyntax`, `erasableSyntaxOnly`, `noUncheckedSideEffectImports`. O alias `@/` é configurado via `baseUrl` + `paths` no tsconfig e via `resolve.alias` no vite.config.ts.

---

## 7. Estrutura de Pastas

```
src/
├── assets/                    # Imagens, fontes estáticas
├── components/
│   ├── ui/                    # Componentes shadcn (gerados automaticamente)
│   ├── layout/
│   │   ├── Sidebar.tsx
│   │   ├── Header.tsx
│   │   └── AppLayout.tsx
│   └── shared/
│       ├── Badge.tsx          # Badge de status (reutilizável)
│       ├── DataTable.tsx      # Tabela com TanStack Table
│       ├── ConfirmDialog.tsx  # Modal de confirmação de delete
│       ├── EmptyState.tsx     # Empty state com ícone
│       ├── PageHeader.tsx     # Header de página (título + botão)
│       ├── PhoneInput.tsx     # Input com máscara de telefone
│       ├── DocumentInput.tsx  # Input com máscara CPF/CNPJ
│       └── Pagination.tsx
├── features/
│   ├── auth/
│   │   ├── components/
│   │   ├── hooks/
│   │   └── pages/
│   │       └── LoginPage.tsx
│   ├── dashboard/
│   │   └── pages/
│   │       └── DashboardPage.tsx
│   ├── cars/
│   │   ├── components/
│   │   │   ├── CarForm.tsx
│   │   │   ├── CarImageUpload.tsx
│   │   │   └── CarStatusBadge.tsx
│   │   ├── hooks/
│   │   │   └── useCars.ts
│   │   └── pages/
│   │       ├── CarsListPage.tsx
│   │       ├── CarDetailPage.tsx
│   │       ├── CarFormPage.tsx
│   │       └── CarCostsPage.tsx
│   ├── providers/
│   ├── customers/
│   ├── employees/
│   ├── sales/
│   └── workflow/
│       ├── components/
│       ├── hooks/
│       └── pages/
│           ├── DashboardPage.tsx
│           ├── WorkflowListPage.tsx
│           ├── WorkflowDetailPage.tsx
│           ├── StepDetailPage.tsx
│           ├── TeamListPage.tsx
│           ├── MyTasksPage.tsx
│           └── TaskDetailPage.tsx
├── hooks/
│   ├── useAuth.ts
│   └── useDebounce.ts
├── lib/
│   ├── api.ts                 # Instância do axios
│   ├── queryClient.ts         # Instância do TanStack Query
│   └── utils.ts               # cn() helper + formatters
├── router/
│   ├── index.tsx              # Definição de rotas TanStack Router
│   └── guards.tsx             # Route guards (auth)
├── services/                  # Funções de chamada à API
│   ├── auth.service.ts
│   ├── cars.service.ts
│   ├── customers.service.ts
│   ├── employees.service.ts
│   ├── providers.service.ts
│   ├── sales.service.ts
│   └── workflow.service.ts
├── store/
│   └── auth.store.ts          # Zustand: usuário logado, token
├── types/
│   ├── auth.ts
│   ├── cars.ts
│   ├── customers.ts
│   ├── employees.ts
│   ├── providers.ts
│   ├── sales.ts
│   └── workflow.ts
├── utils/
│   ├── masks.ts               # Funções de máscara (phone, CPF, CNPJ)
│   ├── validators.ts          # Validação CPF/CNPJ (algoritmo)
│   └── formatters.ts          # formatCurrency, formatDate, etc.
├── main.tsx
└── index.css
```

---

## 8. Configuração do TanStack Router

```bash
npm install @tanstack/router-devtools
npm install -D @tanstack/router-vite-plugin
```

### `vite.config.ts` atualizado
```ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { tanstackRouter } from '@tanstack/router-vite-plugin'

export default defineConfig({
  plugins: [
    tanstackRouter(),
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: { '@': '/src' },
  },
})
```

### `src/router/index.tsx`
```tsx
import { createRouter, createRootRoute, createRoute, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'
import AppLayout from '@/components/layout/AppLayout'

const rootRoute = createRootRoute({
  component: () => (
    <>
      <Outlet />
      <TanStackRouterDevtools />
    </>
  ),
})

// Auth routes (sem sidebar)
const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/login',
  component: () => import('@/features/auth/pages/LoginPage').then(m => <m.default />),
})

// Protected routes (com sidebar)
const appRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: 'app',
  component: AppLayout,
  // beforeLoad: verificar auth aqui
})

const dashboardRoute = createRoute({
  getParentRoute: () => appRoute,
  path: '/',
})

const carsRoute = createRoute({
  getParentRoute: () => appRoute,
  path: '/cars',
})

// ... demais rotas

const routeTree = rootRoute.addChildren([
  loginRoute,
  appRoute.addChildren([
    dashboardRoute,
    carsRoute,
    // ...
  ]),
])

export const router = createRouter({ routeTree })

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}
```

---

## 9. TanStack Query

### `src/lib/queryClient.ts`
```ts
import { QueryClient } from '@tanstack/react-query'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,    // 5 minutos
      gcTime: 1000 * 60 * 30,      // 30 minutos
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
})
```

### `src/main.tsx`
```tsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from '@tanstack/react-router'
import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { queryClient } from '@/lib/queryClient'
import { router } from '@/router'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </StrictMode>,
)
```

---

## 10. Axios

### `src/lib/api.ts`
```ts
import axios from 'axios'
import { useAuthStore } from '@/store/auth.store'

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor: injetar token
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Response interceptor: tratar 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout()
      window.location.href = '/login'
    }
    return Promise.reject(error)
  },
)
```

---

## 11. Zustand — Auth Store

### `src/store/auth.store.ts`
```ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface AuthUser {
  id: number
  email: string
  is_staff: boolean
  employee?: {
    id: number
    full_name: string
    role: string | null
  }
}

interface AuthState {
  user: AuthUser | null
  token: string | null
  isAuthenticated: boolean
  setAuth: (user: AuthUser, token: string) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      setAuth: (user, token) => set({ user, token, isAuthenticated: true }),
      logout: () => set({ user: null, token: null, isAuthenticated: false }),
    }),
    {
      name: 'jgmotors-auth',
    },
  ),
)
```

---

## 12. Utilitários

### `src/lib/utils.ts`
```ts
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

### `src/utils/masks.ts`
```ts
export function applyPhoneMask(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 11)
  if (digits.length <= 10) {
    return digits
      .replace(/^(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{4})(\d)/, '$1-$2')
  }
  return digits
    .replace(/^(\d{2})(\d)/, '($1) $2')
    .replace(/(\d{5})(\d)/, '$1-$2')
}

export function applyCPFMask(value: string): string {
  return value
    .replace(/\D/g, '')
    .slice(0, 11)
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})$/, '$1-$2')
}

export function applyCNPJMask(value: string): string {
  return value
    .replace(/\D/g, '')
    .slice(0, 14)
    .replace(/^(\d{2})(\d)/, '$1.$2')
    .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
    .replace(/\.(\d{3})(\d)/, '.$1/$2')
    .replace(/(\d{4})(\d)/, '$1-$2')
}

export function applyDocumentMask(value: string, type: 'PF' | 'PJ'): string {
  return type === 'PF' ? applyCPFMask(value) : applyCNPJMask(value)
}

export function stripMask(value: string): string {
  return value.replace(/\D/g, '')
}
```

### `src/utils/validators.ts`
```ts
export function validateCPF(cpf: string): boolean {
  const digits = cpf.replace(/\D/g, '')
  if (digits.length !== 11 || /^(\d)\1+$/.test(digits)) return false
  let sum = 0
  for (let i = 0; i < 9; i++) sum += parseInt(digits[i]!) * (10 - i)
  let rem = (sum * 10) % 11
  if (rem === 10 || rem === 11) rem = 0
  if (rem !== parseInt(digits[9]!)) return false
  sum = 0
  for (let i = 0; i < 10; i++) sum += parseInt(digits[i]!) * (11 - i)
  rem = (sum * 10) % 11
  if (rem === 10 || rem === 11) rem = 0
  return rem === parseInt(digits[10]!)
}

export function validateCNPJ(cnpj: string): boolean {
  const digits = cnpj.replace(/\D/g, '')
  if (digits.length !== 14 || /^(\d)\1+$/.test(digits)) return false
  const calc = (d: string, weights: number[]) =>
    weights.reduce((sum, w, i) => sum + parseInt(d[i]!) * w, 0)
  const mod = (n: number) => { const r = n % 11; return r < 2 ? 0 : 11 - r }
  const w1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]
  const w2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]
  return mod(calc(digits, w1)) === parseInt(digits[12]!) &&
         mod(calc(digits, w2)) === parseInt(digits[13]!)
}
```

### `src/utils/formatters.ts`
```ts
export function formatCurrency(value: string | number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(Number(value))
}

export function formatDate(value: string): string {
  return new Intl.DateTimeFormat('pt-BR').format(new Date(value))
}

export function formatDateTime(value: string): string {
  return new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(new Date(value))
}

export function formatMileage(value: number): string {
  return new Intl.NumberFormat('pt-BR').format(value) + ' km'
}
```

---

## 13. Variáveis de Ambiente

### `.env`
```
VITE_API_URL=http://localhost:8000/api
```

### `.env.example`
```
VITE_API_URL=http://localhost:8000/api
```

### `src/vite-env.d.ts`
```ts
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
```

---

## 14. `.gitignore`

```
# Dependencies
node_modules/

# Build
dist/

# Env
.env
.env.local
.env.*.local

# Editor
.vscode/
.idea/

# Vite
*.local

# TypeScript
*.tsbuildinfo
```

---

## 15. Checklist de Setup

- [ ] `npm create vite` com template `react-ts`
- [ ] Instalar Tailwind v4 + plugin Vite
- [ ] Configurar alias `@/` no `vite.config.ts` e `tsconfig.app.json`
- [ ] Instalar e configurar shadcn/ui
- [ ] Instalar componentes shadcn base
- [ ] Instalar TanStack Router, Query, Table
- [ ] Instalar Zustand
- [ ] Instalar React Icons
- [ ] Instalar react-hook-form + zod
- [ ] Instalar axios
- [ ] Instalar ESLint com plugins
- [ ] Criar estrutura de pastas (`features/`, `services/`, `store/`, `types/`, `utils/`)
- [ ] Configurar `api.ts` com interceptors
- [ ] Configurar `auth.store.ts` com persist
- [ ] Criar `queryClient.ts`
- [ ] Criar utilitários: `masks.ts`, `validators.ts`, `formatters.ts`
- [ ] Configurar `main.tsx` com providers
- [ ] Criar rota de login e layout base com sidebar
- [ ] Configurar `.env` com `VITE_API_URL`
- [ ] Testar `npm run lint` e `npm run typecheck` sem erros

---

## Versões de Referência

| Pacote | Versão recomendada |
|--------|-------------------|
| vite | ^7.x |
| react | ^19.x |
| typescript | ^5.x |
| tailwindcss | ^4.x |
| @tanstack/react-router | ^1.x |
| @tanstack/react-query | ^5.x |
| @tanstack/react-table | ^8.x |
| zustand | ^5.x |
| react-icons | ^5.x |
| shadcn/ui | latest |
| react-hook-form | ^7.x |
| zod | ^3.x |
| axios | ^1.x |
