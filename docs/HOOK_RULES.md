# Regras de Hooks — JC Motors Web

## Princípios Gerais

- Todo hook começa com `use` (convenção React obrigatória)
- Hooks de domínio ficam em `src/features/{domain}/hooks/`
- Hooks genéricos e reutilizáveis ficam em `src/hooks/`
- Nenhum componente chama o Axios diretamente — sempre via hook → service
- Um hook deve ter **uma responsabilidade clara**

---

## Categorias de Hooks

### 1. Hooks de Query (leitura de dados)

Encapsulam `useQuery` do TanStack Query.

```ts
// src/features/cars/hooks/useCars.ts

export function useCars(params: CarsListParams) {
  return useQuery({
    queryKey: carsKeys.list(params),
    queryFn: () => carsService.list(params),
  })
}

export function useCar(id: string) {
  return useQuery({
    queryKey: carsKeys.detail(id),
    queryFn: () => carsService.getById(id),
    enabled: !!id,          // não executa se id estiver vazio
  })
}
```

**Padrão de nomeação:**
- Listagem: `use{Entidades}` → `useCars`, `useCustomers`
- Detalhe: `use{Entidade}` → `useCar`, `useCustomer`
- Contagem/resumo: `use{Entidade}Summary` → `useDashboardSummary`

---

### 2. Hooks de Mutation (escrita de dados)

Encapsulam `useMutation` do TanStack Query.

```ts
// src/features/cars/hooks/useCars.ts

export function useCreateCar() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: carsService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: carsKeys.all })
    },
  })
}

export function useUpdateCar() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateCarDTO }) =>
      carsService.update(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: carsKeys.detail(id) })
      queryClient.invalidateQueries({ queryKey: carsKeys.all })
    },
  })
}

export function useDeleteCar() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => carsService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: carsKeys.all })
    },
  })
}
```

**Padrão de nomeação:**
- Criar: `useCreate{Entidade}` → `useCreateCar`
- Editar: `useUpdate{Entidade}` → `useUpdateCar`
- Deletar: `useDelete{Entidade}` → `useDeleteCar`
- Ação específica: `use{Acao}{Entidade}` → `useApproveSaleOrder`

---

### 3. Hooks de Store (leitura/ação no Zustand)

Quando a lógica de acesso ao Zustand é complexa ou precisa ser compartilhada, encapsule em um hook:

```ts
// src/features/auth/hooks/useAuth.ts
import { useAuthStore } from "@/store/auth.store"

export function useAuth() {
  const user = useAuthStore((s) => s.user)
  const token = useAuthStore((s) => s.token)
  const logout = useAuthStore((s) => s.logout)

  const isAuthenticated = !!token
  const firstName = user?.employee?.full_name?.split(" ")[0] ?? ""

  return { user, token, isAuthenticated, firstName, logout }
}
```

Para acessos simples e diretos, usar `useAuthStore` diretamente no componente sem criar hook intermediário.

---

### 4. Hooks de UI (lógica de interface)

Para lógica de UI reutilizável sem relação com servidor ou estado global:

```ts
// src/hooks/useDebounce.ts
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay)
    return () => clearTimeout(handler)
  }, [value, delay])

  return debouncedValue
}

// src/hooks/useDisclosure.ts
export function useDisclosure(initial = false) {
  const [isOpen, setIsOpen] = useState(initial)
  return {
    isOpen,
    open: () => setIsOpen(true),
    close: () => setIsOpen(false),
    toggle: () => setIsOpen((v) => !v),
  }
}
```

---

## Convenções de Query Keys

Cada domínio exporta um objeto `{nome}Keys` com a hierarquia de chaves:

```ts
// Padrão
export const carsKeys = {
  all: ["cars"] as const,
  list: (params: CarsListParams) => ["cars", "list", params] as const,
  detail: (id: string) => ["cars", "detail", id] as const,
}

// Uso:
// useQuery({ queryKey: carsKeys.list({ page: 1 }) })
// invalidateQueries({ queryKey: carsKeys.all }) — invalida tudo de "cars"
```

**Regras das query keys:**
- Sempre usar `as const` para type-safety
- A chave `all` invalida qualquer sub-query do domínio
- Incluir parâmetros relevantes para que queries com filtros diferentes sejam cacheadas separadamente
- Manter o objeto `keys` no mesmo arquivo dos hooks

---

## Estratégias de Invalidação de Cache

| Situação | Código |
|---|---|
| CRUD básico (afeta lista) | `invalidateQueries({ queryKey: keys.all })` |
| Edição de item (afeta detalhe e lista) | Invalidar `keys.detail(id)` e `keys.all` |
| Resposta da mutation tem o dado atualizado | `setQueryData(keys.detail(id), response)` |
| Ação que afeta múltiplos domínios | Invalidar os `all` de cada domínio afetado |

---

## Tratamento de Erros

### Em queries

```ts
const { data, isLoading, error } = useCars(params)

if (error) {
  // Mostrar mensagem de erro via toast (sonner)
  // O componente pode renderizar um estado de erro
}
```

### Em mutations

```ts
const { mutate, isPending } = useCreateCar()

mutate(data, {
  onSuccess: () => toast.success("Veículo cadastrado!"),
  onError: (error) => toast.error("Erro ao cadastrar veículo"),
})
```

---

## Anti-padrões

| Anti-padrão | Problema | Solução |
|---|---|---|
| Axios dentro de componente | Acoplamento, sem cache, sem loading state | Extrair para hook + service |
| Query key como string literal | Cache incorreto, bugs difíceis de rastrear | Usar objeto `{nome}Keys` |
| `enabled: true` sem condição | Query executa com parâmetros inválidos | `enabled: !!id` |
| Hook gigante com múltiplas responsabilidades | Difícil de testar e manter | Separar em hooks menores |
| Fetch dentro de `useEffect` + `useState` | Reinventar o TanStack Query | Usar `useQuery` |
| Invalidar `queryClient.invalidateQueries()` sem queryKey | Invalida todo o cache da aplicação | Sempre especificar `queryKey` |

---

## Uso em Componentes

```tsx
// Página típica — leitura
function CarsPage() {
  const [page, setPage] = useState(1)
  const [query, setQuery] = useState("")

  const { data, isLoading } = useCars({ page, query })

  return (
    <AppDataTable
      data={data?.items ?? []}
      total={data?.total ?? 0}
      isLoading={isLoading}
      page={page}
      onPageChange={setPage}
      onSearch={setQuery}
      // ...
    />
  )
}

// Página típica — escrita
function CarForm() {
  const { mutate: createCar, isPending } = useCreateCar()

  const handleSubmit = (data: CreateCarDTO) => {
    createCar(data, {
      onSuccess: () => {
        toast.success("Veículo criado!")
        navigate({ to: "/cars" })
      },
    })
  }

  return (
    <form onSubmit={handleSubmit}>
      {/* ... */}
      <AppButton type="submit" isLoading={isPending}>Salvar</AppButton>
    </form>
  )
}
```
