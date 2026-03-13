# AppTable

**Arquivo:** `src/components/shared/AppTable.tsx`
**Tipo:** Componente shared
**Prefixo:** `App`

---

## Propósito

Tabela com API declarativa baseada em definição de colunas (`columns[]`) e array de dados (`data[]`). Ideal para exibição de dados tabulares estilo planilha — sem busca, paginação ou card wrapper. Suporta variantes visual, rodapé e estado de skeleton.

Para tabelas com Card, busca, paginação e ações por linha, usar `AppDataTable`.

---

## Props

| Prop | Tipo | Padrão | Descrição |
|---|---|---|---|
| `columns` | `AppTableColumn<T>[]` | **obrigatório** | Definição de colunas |
| `data` | `T[]` | **obrigatório** | Array de registros a exibir |
| `variant` | `"default" \| "striped" \| "bordered"` | `"default"` | Estilo visual da tabela |
| `caption` | `string` | — | Legenda exibida abaixo da tabela (`<caption>`) |
| `emptyText` | `string` | `"Sem dados."` | Mensagem exibida quando `data` está vazio |
| `isLoading` | `boolean` | `false` | Exibe linhas de skeleton enquanto carrega |
| `loadingRows` | `number` | `4` | Quantidade de linhas skeleton |
| `footer` | `AppTableFooterRow[]` | — | Células do rodapé (`{ key, value }`) |
| `className` | `string` | — | Classe extra no `div` wrapper externo |

---

## Tipos exportados

```ts
export type AppTableColumn<T extends Record<string, unknown>> = {
  key: string              // chave do objeto de dados
  header: ReactNode        // conteúdo do cabeçalho
  align?: "left" | "center" | "right"
  className?: string       // classe extra na célula
  render?: (value: unknown, row: T, index: number) => ReactNode
}

export type AppTableFooterRow = {
  key: string
  value: ReactNode
}
```

---

## Variantes

| Variante | Comportamento |
|---|---|
| `"default"` | Linhas com `hover:bg-muted/50` padrão |
| `"striped"` | Linhas pares com `bg-muted/30` |
| `"bordered"` | Bordas verticais entre colunas (`border-r border-border`) |

---

## Comportamento

### Renderização de células
- Se a coluna tem `render`, chama `render(value, row, index)` — permite badges, ícones, links, etc.
- Se não tem `render`, exibe `value` diretamente como `ReactNode`.

### Estado vazio
- `data.length === 0` e `isLoading === false`: exibe linha única com `emptyText` centralizado.

### Skeleton
- `isLoading === true`: renderiza `loadingRows` linhas com `<div className="h-4 animate-pulse rounded bg-muted" />` em cada célula.

### Rodapé
- `footer` renderiza uma `<TableFooter>` com uma única linha.
- A última célula do footer recebe `colSpan` calculado para preencher as colunas restantes.
- Última célula: `text-right font-semibold`.

### Wrapper
- Sempre dentro de `div` com `overflow-x-auto rounded-lg border border-border`.

---

## Dependências

| Dependência | Uso |
|---|---|
| `@/components/ui/table` | Primitivos `Table`, `TableHeader`, `TableBody`, `TableFooter`, `TableRow`, `TableHead`, `TableCell`, `TableCaption` (shadcn) |
| `@/lib/utils` (`cn`) | Composição de classes Tailwind |

> **Nota:** `AppTable.tsx` re-exporta os primitivos do shadcn (`Table`, `TableRow`, etc.) para uso pontual.

---

## Exemplos de uso

```tsx
// Básico
<AppTable
  columns={[
    { key: "model", header: "Modelo" },
    { key: "year", header: "Ano", align: "center" },
    { key: "price", header: "Preço", align: "right" },
  ]}
  data={vehicles}
/>

// Variante listrada
<AppTable
  variant="striped"
  columns={columns}
  data={data}
/>

// Variante com bordas (planilha)
<AppTable
  variant="bordered"
  columns={columns}
  data={data}
/>

// Com render customizado
const columns: AppTableColumn<Vehicle>[] = [
  {
    key: "status",
    header: "Status",
    render: (_, row) => <StatusBadge status={row.status} />,
  },
]

// Com rodapé
<AppTable
  columns={columns}
  data={data}
  footer={[
    { key: "label", value: "Total" },
    { key: "total", value: formatCurrency(total) },
  ]}
/>

// Estado de loading
<AppTable columns={columns} data={[]} isLoading loadingRows={6} />
```

---

## Onde é usado

- Seções de dados tabulares dentro de cards ou modais (ex.: itens de uma venda, parcelas de financiamento)
- Qualquer tabela sem necessidade de busca ou paginação embutida
