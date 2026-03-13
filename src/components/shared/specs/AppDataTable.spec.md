# AppDataTable

**Arquivo:** `src/components/shared/AppDataTable.tsx`
**Tipo:** Componente shared
**Prefixo:** `App`

---

## Propósito

Tabela de listagem completa envolta em `Card`, com suporte a busca, paginação inteligente com ellipsis, ação no header e clique em linha. Projetada para páginas de listagem de entidades (veículos, clientes, fornecedores, etc.).

Para tabelas simples sem Card, busca ou paginação, usar `AppTable`.

---

## Props

| Prop | Tipo | Padrão | Descrição |
|---|---|---|---|
| `title` | `string` | — | Título exibido no `CardHeader` |
| `columns` | `AppDataTableColumn<T>[]` | **obrigatório** | Definição de colunas |
| `data` | `T[]` | **obrigatório** | Array de registros da página atual |
| `total` | `number` | — | Total de registros (para cálculo de paginação e label "X–Y de Z") |
| `page` | `number` | `1` | Página atual (1-based) |
| `pageSize` | `number` | `10` | Itens por página |
| `onPageChange` | `(page: number) => void` | — | Callback ao mudar de página |
| `searchPlaceholder` | `string` | `"Buscar..."` | Placeholder do campo de busca |
| `onSearch` | `(query: string) => void` | — | Callback ao digitar na busca (debounce deve ser aplicado externamente) |
| `headerAction` | `ReactNode` | — | Elemento à direita do header (ex.: botão "Novo") |
| `emptyText` | `string` | `"Sem dados."` | Mensagem de estado vazio |
| `isLoading` | `boolean` | `false` | Exibe linhas de skeleton |
| `loadingRows` | `number` | `5` | Quantidade de linhas skeleton |
| `onRowClick` | `(row: T, index: number) => void` | — | Callback ao clicar em uma linha |
| `className` | `string` | — | Classe extra no `Card` |

---

## Tipo exportado

```ts
export type AppDataTableColumn<T extends Record<string, unknown>> = {
  key: string
  header: ReactNode
  align?: "left" | "center" | "right"
  className?: string
  render?: (value: unknown, row: T, index: number) => ReactNode
}
```

---

## Comportamento

### Header do Card
- Renderizado apenas quando `title`, `onSearch` ou `headerAction` estiver presente.
- Campo de busca: `w-44 h-8` com ícone `Search` à esquerda — posicionado à direita do título.
- `headerAction`: renderizado à direita do campo de busca.

### Busca
- O `onSearch` é chamado diretamente no `onChange` do input — **o debounce deve ser implementado no componente consumidor** (ex.: `useDebounce`).

### Paginação
- Ativada quando `total !== undefined && Math.ceil(total / pageSize) > 1`.
- Algoritmo `getPageButtons` gera botões com ellipsis (`…`) para listas longas:
  - ≤ 5 páginas: exibe todas.
  - > 5 páginas: exibe primeira, última, página atual ±1, com `…` onde há salto.
- Label inferior: `"Exibindo X–Y de Z registros"` quando `total` é fornecido.
- Botões "Anterior" e "Próximo" ficam desabilitados nos extremos.

### Clique em linha
- `onRowClick` presente: adiciona `cursor-pointer` e chama o callback ao clicar na `<tr>`.

### Skeleton
- `isLoading`: renderiza `loadingRows` linhas com `<div className="h-4 animate-pulse rounded bg-muted" />` variando largura entre a primeira célula (`w-40`) e as demais (`w-24`).

---

## Dependências

| Dependência | Uso |
|---|---|
| `@/components/ui/button` | Botões de paginação |
| `@/components/ui/card` | Card wrapper (`Card`, `CardContent`, `CardHeader`, `CardTitle`) |
| `@/components/ui/input` | Campo de busca |
| `lucide-react` (`Search`, `ChevronLeft`, `ChevronRight`) | Ícones |
| `@/lib/utils` (`cn`) | Composição de classes Tailwind |

---

## Exemplos de uso

```tsx
// Listagem simples com paginação
<AppDataTable
  title="Veículos em Estoque"
  columns={vehicleColumns}
  data={vehicles}
  total={48}
  page={page}
  pageSize={10}
  onPageChange={setPage}
/>

// Com busca e botão de ação
<AppDataTable
  title="Clientes"
  columns={customerColumns}
  data={customers}
  total={total}
  page={page}
  pageSize={10}
  onPageChange={setPage}
  searchPlaceholder="Buscar cliente..."
  onSearch={setSearch}
  headerAction={
    <Button size="sm" onClick={() => navigate({ to: "/customers/new" })}>
      Novo cliente
    </Button>
  }
/>

// Com clique em linha para navegação
<AppDataTable
  columns={columns}
  data={rows}
  onRowClick={(row) => navigate({ to: `/cars/${row.id}` })}
/>

// Loading
<AppDataTable columns={columns} data={[]} isLoading loadingRows={8} />
```

---

## Onde é usado

- Todas as páginas de listagem de entidades: `CarsPage`, `CustomersPage`, `ProvidersPage`
- Qualquer tela de busca/listagem que requeira Card + busca + paginação
