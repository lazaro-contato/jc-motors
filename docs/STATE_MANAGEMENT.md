# Gerenciamento de Estado — JC Motors Web

## Modelo de 4 Camadas

A aplicação separa o estado em 4 camadas distintas com responsabilidades bem definidas:

```
┌─────────────────────────────────────────────────────────────┐
│  1. ZUSTAND (estado global do cliente)                      │
│     auth, tema, preferências do usuário logado              │
├─────────────────────────────────────────────────────────────┤
│  2. TANSTACK QUERY (estado do servidor)                     │
│     dados da API: listas, detalhes, contagens               │
├─────────────────────────────────────────────────────────────┤
│  3. USESTATE / USEREDUCER (estado local da UI)              │
│     filtros, paginação, modais, tabs, toggles               │
├─────────────────────────────────────────────────────────────┤
│  4. CONTEXT (estado de sub-árvore)                          │
│     wizard multi-step, formulários complexos                │
└─────────────────────────────────────────────────────────────┘
```

---

## Onde Colocar Cada Estado — Fluxograma de Decisão

```
É dado que vem da API?
├── SIM → TanStack Query (useQuery / useMutation)
│
└── NÃO → Precisa ser acessado fora do componente atual?
          ├── SIM → É global para toda a aplicação?
          │         ├── SIM → Zustand store
          │         └── NÃO → Context (limitado à sub-árvore)
          │
          └── NÃO → useState / useReducer local
```

---

## Camada 1 — Zustand (Estado Global do Cliente)

### Quando usar

- Estado que persiste durante toda a sessão do usuário
- Dados do usuário logado (auth)
- Preferências do usuário que afetam múltiplas partes da UI

### Anatomia de uma Store

```ts
// src/store/auth.store.ts
import { create } from "zustand"
import { persist } from "zustand/middleware"

interface AuthState {
  // Estado
  user: User | null
  token: string | null

  // Ações
  setAuth: (user: User, token: string) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,

      setAuth: (user, token) => set({ user, token }),

      logout: () => set({ user: null, token: null }),
    }),
    {
      name: "jcmotors-auth", // chave no localStorage
    }
  )
)
```

### Convenções da Store

- Um arquivo por domínio: `{nome}.store.ts` em `src/store/`
- Exportar sempre como `use{Nome}Store` (hook)
- Separar estado (substantivos) de ações (verbos) na interface
- Usar `persist` apenas quando necessário (auth, preferências)
- Não colocar dados do servidor no Zustand — use TanStack Query

### Lendo a Store em Componentes

```ts
// Sempre selecionar apenas o que você precisa (evita re-renders)
const user = useAuthStore((s) => s.user)
const logout = useAuthStore((s) => s.logout)

// Evitar — causa re-render em qualquer mudança da store
const store = useAuthStore()
```

---

## Camada 2 — TanStack Query (Estado do Servidor)

### Quando usar

- Qualquer dado que vem da API REST
- Listas paginadas, detalhes de entidade, contagens

### Anatomia de um Hook de Query

```ts
// src/features/cars/hooks/useCars.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { carsService } from "../services/cars.service"

// Chaves de cache
export const carsKeys = {
  all: ["cars"] as const,
  list: (params: CarsParams) => ["cars", "list", params] as const,
  detail: (id: string) => ["cars", "detail", id] as const,
}

// Hook de listagem
export function useCars(params: CarsParams) {
  return useQuery({
    queryKey: carsKeys.list(params),
    queryFn: () => carsService.list(params),
  })
}

// Hook de detalhe
export function useCar(id: string) {
  return useQuery({
    queryKey: carsKeys.detail(id),
    queryFn: () => carsService.getById(id),
    enabled: !!id,
  })
}

// Hook de mutação (criar/editar/deletar)
export function useCreateCar() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: carsService.create,
    onSuccess: () => {
      // Invalida o cache da lista após criação
      queryClient.invalidateQueries({ queryKey: carsKeys.all })
    },
  })
}
```

### Convenções de Query Keys

As query keys seguem hierarquia de especificidade:

```ts
export const {nome}Keys = {
  all: ["{nome}"] as const,
  list: (params) => ["{nome}", "list", params] as const,
  detail: (id) => ["{nome}", "detail", id] as const,
}
```

Isso permite invalidar por nível: `invalidateQueries({ queryKey: carsKeys.all })` invalida tudo relacionado a carros.

### Invalidação de Cache

| Situação | Estratégia |
|---|---|
| Criou/editou/deletou item da lista | `invalidateQueries({ queryKey: keys.all })` |
| Editou um item específico | `invalidateQueries({ queryKey: keys.detail(id) })` |
| Resposta da mutation contém dado atualizado | `setQueryData(keys.detail(id), response)` |

---

## Camada 3 — useState / useReducer (Estado Local da UI)

### Quando usar

- Estado de UI que não precisa sair do componente
- Filtros e busca local
- Controle de paginação
- Abertura/fechamento de modais
- Toggles, tabs, acordeões

```tsx
// Exemplo em CarsPage.tsx
const [query, setQuery] = useState("")
const [page, setPage] = useState(1)
const [isModalOpen, setIsModalOpen] = useState(false)
```

### Regra de Elevação

Se dois componentes irmãos precisam do mesmo estado local, mova-o para o pai comum. Se o pai ficou muito distante, considere um Context ou Zustand.

---

## Camada 4 — Context (Estado de Sub-árvore)

### Quando usar

- Estado que precisa ser compartilhado entre vários componentes dentro de uma mesma feature, sem precisar ser global
- Wizards multi-step, formulários complexos com múltiplas etapas
- Componentes compostos (compound components)

```tsx
// Exemplo: FormularioVendaContext.tsx
interface FormularioVendaContextType {
  step: number
  formData: Partial<SaleOrder>
  nextStep: () => void
  setFormData: (data: Partial<SaleOrder>) => void
}

const FormularioVendaContext = createContext<FormularioVendaContextType | null>(null)

export function useFormularioVenda() {
  const ctx = useContext(FormularioVendaContext)
  if (!ctx) throw new Error("useFormularioVenda deve ser usado dentro de FormularioVendaProvider")
  return ctx
}
```

---

## Anti-padrões

| Anti-padrão | Problema | Solução |
|---|---|---|
| Dados da API em Zustand | Cache duplicado, stale data | Usar TanStack Query |
| Estado de UI no Zustand | Store cresce sem controle | Usar `useState` local |
| `useAuthStore()` sem selector | Re-render em qualquer mudança | Selecionar campos específicos |
| Mutações sem `invalidateQueries` | Dados desatualizados na tela | Invalidar o cache após sucesso |
| Prop drilling além de 3 níveis | Acoplamento, difícil manutenção | Context ou Zustand |
