# Regras de Navegação — JG Motors Web

## Stack de Roteamento

O projeto usa **TanStack Router** em modo **code-based** (não file-based). Todas as rotas são definidas e registradas manualmente em `src/router/index.tsx`.

> O plugin `@tanstack/router-vite-plugin` está instalado mas **desativado** no `vite.config.ts` — ele é exclusivo para file-based routing e causaria erros se ativado.

---

## Estrutura do Router

```
src/
└── router/
    └── index.tsx    ← Único arquivo de definição de rotas
```

Toda rota da aplicação **deve ser registrada neste arquivo**. Páginas não se auto-registram.

---

## Anatomia de uma Rota

### Rota Raiz

```tsx
// src/router/index.tsx
import { createRootRoute, createRoute, createRouter, Outlet } from "@tanstack/react-router"
import { MainLayout } from "@/components/layout/MainLayout"

// Rota raiz — renderiza o layout principal
const rootRoute = createRootRoute({
  component: () => (
    <MainLayout>
      <Outlet />
    </MainLayout>
  ),
})
```

### Adicionando uma Rota de Página

```tsx
import { CarsPage } from "@/features/cars/pages/CarsPage"

const carsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/cars",
  component: CarsPage,
})
```

### Rota com Parâmetros Dinâmicos

```tsx
import { CarDetailPage } from "@/features/cars/pages/CarDetailPage"

const carDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/cars/$carId",       // $carId é o parâmetro
  component: CarDetailPage,
})

// Dentro da página, acessar o parâmetro:
// const { carId } = carDetailRoute.useParams()
```

### Rota com Search Params (Query String)

```tsx
import { z } from "zod"

const carsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/cars",
  validateSearch: z.object({
    page: z.number().default(1),
    query: z.string().optional(),
  }),
  component: CarsPage,
})

// Dentro da página:
// const { page, query } = carsRoute.useSearch()
```

---

## Registrando Rotas

Toda rota criada deve ser adicionada à árvore de rotas e ao `routeTree`:

```tsx
// src/router/index.tsx — parte final

const routeTree = rootRoute.addChildren([
  dashboardRoute,
  carsRoute,
  carDetailRoute,
  // ... novas rotas aqui
])

export const router = createRouter({ routeTree })

// Registro de tipos para type-safety completo
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router
  }
}
```

---

## Navegação Programática

### Em componentes (via hook)

```tsx
import { useNavigate } from "@tanstack/react-router"

function MinhaPage() {
  const navigate = useNavigate()

  const handleClick = () => {
    navigate({ to: "/cars" })
  }

  // Com parâmetros
  const handleDetail = (id: string) => {
    navigate({ to: "/cars/$carId", params: { carId: id } })
  }
}
```

### Link declarativo

```tsx
import { Link } from "@tanstack/react-router"

<Link to="/cars">Ver veículos</Link>
<Link to="/cars/$carId" params={{ carId: "abc123" }}>Ver detalhe</Link>
```

---

## Rotas Autenticadas

Rotas que exigem autenticação devem verificar o estado da store antes de renderizar:

```tsx
import { createRoute, redirect } from "@tanstack/react-router"
import { useAuthStore } from "@/store/auth.store"

const protectedRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/cars",
  beforeLoad: () => {
    const token = useAuthStore.getState().token
    if (!token) {
      throw redirect({ to: "/login" })
    }
  },
  component: CarsPage,
})
```

> Usar `useAuthStore.getState()` (sem hook) dentro de `beforeLoad` porque não é um componente React.

---

## Convenções

| Regra | Descrição |
|---|---|
| Arquivo único | Todas as rotas em `src/router/index.tsx` |
| Nome das variáveis | `{dominio}Route` (ex: `carsRoute`, `dashboardRoute`) |
| Path com kebab-case | `/sale-orders`, `/work-flows` |
| Parâmetros com $ | `/cars/$carId`, `/sales/$saleId` |
| Páginas simples | Uma rota → uma página (`{Nome}Page.tsx`) |
| Rotas aninhadas | Usar `addChildren` no pai, `Outlet` no layout |

---

## Mapa de Rotas Atual

```
/                   → DashboardPage
/cars               → CarsPage
/cars/$carId        → CarDetailPage  (a criar)
/sale-orders        → SaleOrdersPage (a criar)
/customers          → CustomersPage  (a criar)
/employees          → EmployeesPage  (a criar)
/workflows          → WorkflowsPage  (a criar)
/login              → LoginPage (sem MainLayout)
```

---

## Página Grande? Divida em Componentes

A `{Nome}Page.tsx` deve ser um **orquestrador**, não um monolito. Se uma página crescer, extraia seções:

```
features/cars/
├── pages/
│   └── CarsPage.tsx          ← apenas orquestra
└── components/               ← componentes internos da feature
    ├── CarsFilters.tsx
    ├── CarsTable.tsx
    └── CarStatusBadge.tsx
```

Componentes internos de feature não vão para `components/shared/`.
