# AppButton

**Arquivo:** `src/components/shared/AppButton.tsx`
**Tipo:** Componente shared
**Prefixo:** `App`

---

## Propósito

Extensão do `Button` do shadcn/ui com sistema de `intent` semântico. Permite aplicar variantes de cor (success, warning, danger, info) nos modos sólido e suave (`soft`), além de controlar estados de carregamento e desabilitação de forma declarativa.

---

## Props

| Prop | Tipo | Padrão | Descrição |
|---|---|---|---|
| `intent` | `"default" \| "success" \| "warning" \| "danger" \| "info"` | `"default"` | Semântica de cor do botão |
| `soft` | `boolean` | `false` | Fundo claro + texto colorido em vez de cor sólida |
| `isLoading` | `boolean` | `false` | Exibe spinner e desabilita automaticamente |
| `isDisabled` | `boolean` | `false` | Desabilita o botão sem alterar visual de loading |
| `className` | `string` | — | Classes extras para override externo |
| `...props` | `ComponentProps<typeof Button>` | — | Todas as props do `Button` shadcn (`variant`, `size`, `onClick`, etc.) |

> **Atenção:** quando `intent !== "default"`, o `variant` interno é forçado para `"default"` (sólido) para que as classes de intent sejam aplicadas corretamente. O `variant` externo só tem efeito quando `intent === "default"`.

---

## Variantes de intent

### Modo sólido (padrão)

| Intent | Fundo | Texto | Hover |
|---|---|---|---|
| `success` | `bg-success` | `text-white` | `hover:bg-success/85` |
| `warning` | `bg-warning` | `text-navy-800` | `hover:bg-warning/85` |
| `danger` | `bg-danger` | `text-white` | `hover:bg-danger/85` |
| `info` | `bg-info` | `text-white` | `hover:bg-info/85` |

### Modo suave (`soft`)

| Intent | Fundo | Texto | Hover |
|---|---|---|---|
| `success` | `bg-success-bg` | `text-success` | `hover:bg-success/15` |
| `warning` | `bg-warning-bg` | `text-warning` | `hover:bg-warning/15` |
| `danger` | `bg-danger-bg` | `text-danger` | `hover:bg-danger/15` |
| `info` | `bg-info-bg` | `text-info` | `hover:bg-info/15` |

---

## Comportamento

- **`isLoading`**: injeta `<Loader2 className="size-4 animate-spin" />` antes do `children` e seta `disabled={true}` no botão base.
- **`isDisabled`**: seta `disabled={true}` sem modificar o conteúdo visual.
- Ambos podem ser combinados com qualquer `size` do shadcn (`sm`, `default`, `lg`, `icon`).

---

## Dependências

| Dependência | Uso |
|---|---|
| `@/components/ui/button` | Componente base (shadcn) |
| `lucide-react` (`Loader2`) | Ícone de spinner no estado loading |
| `@/lib/utils` (`cn`) | Composição de classes Tailwind |

---

## Exemplos de uso

```tsx
// Intent padrão (usa variant do shadcn diretamente)
<AppButton variant="outline">Cancelar</AppButton>

// Intent sólido
<AppButton intent="success">Salvar</AppButton>
<AppButton intent="danger">Excluir</AppButton>

// Intent suave
<AppButton intent="warning" soft>Atenção</AppButton>
<AppButton intent="danger" soft>Remover</AppButton>

// Estado de loading
<AppButton intent="success" isLoading>Salvando...</AppButton>

// Desabilitado
<AppButton isDisabled>Indisponível</AppButton>

// Com size
<AppButton intent="info" size="sm">Detalhes</AppButton>
```

---

## Onde é usado

- Formulários de criação/edição (submit com `isLoading`)
- Botões de ação destrutiva (`intent="danger"`)
- Ações de confirmação (`intent="success"`)
- Qualquer lugar que requeira variante semântica além das variantes padrão do shadcn
