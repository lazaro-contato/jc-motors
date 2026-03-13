# AppPageHeader

**Arquivo:** `src/components/shared/AppPageHeader.tsx`
**Tipo:** Componente shared
**Prefixo:** `App`

---

## Propósito

Header de página reutilizável que cobre dois padrões de layout distintos presentes no projeto:

1. **Modo lista** (`onBack` ausente): título alinhado à esquerda + ação opcional à direita (botão "Novo", filtros, etc.)
2. **Modo detalhe/criar** (`onBack` presente): botão de voltar `←` + título centralizado verticalmente, sem ação à direita

O layout correto é selecionado automaticamente pela presença ou ausência da prop `onBack`.

---

## Props

| Prop | Tipo | Padrão | Descrição |
|---|---|---|---|
| `title` | `string` | **obrigatório** | Título principal da página |
| `subtitle` | `string` | — | Subtítulo exibido abaixo do título em `text-sm text-muted-foreground` |
| `onBack` | `() => void` | — | Callback do botão de voltar; ativa o modo detalhe |
| `action` | `ReactNode` | — | Elemento à direita do header (modo lista); ignorado se `onBack` presente |
| `className` | `string` | — | Classes extras no container externo |

---

## Modos de layout

### Modo lista (`onBack` ausente)
```
┌─────────────────────────────────────────────────────────┐
│ Título da Página                          [Botão Ação]  │
│ Subtítulo opcional                                      │
└─────────────────────────────────────────────────────────┘
```
- Container: `flex items-start justify-between`
- Sem botão de voltar
- `action` renderizado em `<div className="shrink-0">`

### Modo detalhe (`onBack` presente)
```
┌─────────────────────────────────────────────────────────┐
│ [←]  Título da Página                                   │
│      Subtítulo opcional                                 │
└─────────────────────────────────────────────────────────┘
```
- Container: `flex items-center gap-4`
- Botão ghost `size="icon"` com `ArrowLeft` à esquerda
- `action` **não é renderizado** neste modo

---

## Comportamento

- **Botão de voltar**: `Button` do shadcn com `variant="ghost"` e `size="icon"`, classes `size-9 shrink-0 rounded-xl text-muted-foreground`.
- **Área de texto**: `<div className="min-w-0 flex-1">` — `min-w-0` previne overflow do título em containers flex.
- **`h1`**: `text-2xl font-bold tracking-tight text-foreground`.
- **Subtítulo**: `<p className="mt-0.5 text-sm text-muted-foreground">` — renderizado apenas quando `subtitle` está presente.

---

## Dependências

| Dependência | Uso |
|---|---|
| `@/components/ui/button` | Botão de voltar (shadcn) |
| `lucide-react` (`ArrowLeft`) | Ícone do botão de voltar |
| `@/lib/utils` (`cn`) | Composição de classes Tailwind |

---

## Exemplos de uso

```tsx
// Modo lista — título + botão de ação
<AppPageHeader
  title="Clientes"
  subtitle="Gerencie sua base de clientes"
  action={
    <Button size="sm" onClick={() => navigate({ to: "/customers/new" })}>
      <Plus className="size-4" />
      Novo cliente
    </Button>
  }
/>

// Modo detalhe — botão de voltar + título
<AppPageHeader
  title="Novo Cliente"
  onBack={() => navigate({ to: "/customers" })}
/>

// Com subtítulo no modo detalhe
<AppPageHeader
  title="Editar Veículo"
  subtitle="Honda Civic 2023 · JGM-042"
  onBack={() => navigate({ to: "/cars" })}
/>

// Sem ação (somente título)
<AppPageHeader title="Dashboard" />
```

---

## Integração com TanStack Router

```tsx
import { useNavigate } from "@tanstack/react-router"

const navigate = useNavigate()

// Modo lista
<AppPageHeader
  title="Fornecedores"
  action={
    <Button size="sm" onClick={() => navigate({ to: "/providers/new" })}>
      Novo
    </Button>
  }
/>

// Modo detalhe
<AppPageHeader
  title="Novo Fornecedor"
  onBack={() => navigate({ to: "/providers" })}
/>
```

---

## Onde é usado

- `CarsPage` — modo lista
- `CustomersPage` — modo lista com botão "Novo cliente"
- `CustomerCreatePage` — modo detalhe com botão de voltar
- `ProvidersPage` — modo lista com botão "Novo fornecedor"
- `ProviderCreatePage` — modo detalhe com botão de voltar
