# AppSelect

**Arquivo:** `src/components/shared/AppSelect.tsx`
**Tipo:** Componente shared
**Prefixo:** `App`

---

## Propósito

Wrapper simplificado do `Select` do shadcn/ui com API baseada em array de opções (`options[]`). Elimina a necessidade de compor manualmente `SelectTrigger`, `SelectContent` e `SelectItem` a cada uso. Exporta o tipo `SelectOption` reutilizado por `AppMultiSelect` e `AppSearchSelect`.

---

## Props

| Prop | Tipo | Padrão | Descrição |
|---|---|---|---|
| `options` | `SelectOption[]` | **obrigatório** | Array de opções `{ label, value, disabled? }` |
| `placeholder` | `string` | `"Selecione uma opção"` | Texto exibido quando nenhuma opção está selecionada |
| `value` | `string` | — | Valor selecionado (modo controlado) |
| `defaultValue` | `string` | — | Valor inicial (modo não-controlado) |
| `onValueChange` | `(value: string) => void` | — | Callback ao selecionar uma opção |
| `isDisabled` | `boolean` | `false` | Desabilita o select inteiro |
| `error` | `string \| boolean` | — | `string` exibe mensagem de erro; `boolean` ativa apenas estilo de erro |
| `size` | `"default" \| "sm"` | `"default"` | Tamanho do trigger |
| `className` | `string` | — | Classes extras aplicadas ao `SelectTrigger` |
| `...props` | `ComponentProps<typeof Select>` (sem `children`, `onValueChange`, `value`, `defaultValue`) | — | Props extras do `Select` shadcn |

> **CRÍTICO:** O callback de seleção é `onValueChange`, **não** `onChange`. Usar `onChange` não terá efeito.

---

## Tipo exportado

```ts
export interface SelectOption {
  label: string
  value: string
  disabled?: boolean
}
```

Este tipo é importado por `AppMultiSelect` e `AppSearchSelect`.

---

## Comportamento

- O componente **não possui prop `label`** — quando necessário, envolva-o em um `<div>` com um `<label>` manual ou use dentro de um `FormField`.
- `error` como `string`: exibe mensagem abaixo em `text-xs text-danger`.
- `error` como `boolean` (`true`): aplica borda vermelha sem mensagem.
- Opções com `disabled: true` são renderizadas como não clicáveis via `SelectItem disabled`.
- O trigger ocupa 100% da largura do container (`w-full`).

---

## Dependências

| Dependência | Uso |
|---|---|
| `@/components/ui/select` | Primitivos `Select`, `SelectTrigger`, `SelectContent`, `SelectItem`, `SelectValue` (shadcn) |
| `@/lib/utils` (`cn`) | Composição de classes Tailwind |

---

## Exemplos de uso

```tsx
// Controlado básico
<AppSelect
  options={[
    { label: 'Disponível', value: 'available' },
    { label: 'Reservado', value: 'reserved' },
    { label: 'Vendido', value: 'sold' },
  ]}
  value={status}
  onValueChange={setStatus}
  placeholder="Selecione o status"
/>

// Com erro
<AppSelect
  options={PERSON_TYPE_OPTIONS}
  error={errors.person_type?.message}
  value={value}
  onValueChange={onChange}
/>

// Tamanho sm
<AppSelect options={options} size="sm" value={v} onValueChange={setV} />

// Opção desabilitada
<AppSelect
  options={[
    { label: 'Ativo', value: 'active' },
    { label: 'Arquivado', value: 'archived', disabled: true },
  ]}
  value={v}
  onValueChange={setV}
/>
```

---

## Integração com React Hook Form

```tsx
// AppSelect não é um input nativo — usar Controller
<Controller
  name="person_type"
  control={control}
  render={({ field }) => (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium">Tipo de pessoa</label>
      <AppSelect
        options={PERSON_TYPE_OPTIONS}
        value={field.value}
        onValueChange={field.onChange}
        error={errors.person_type?.message}
      />
    </div>
  )}
/>
```

---

## Onde é usado

- Formulários de criação/edição onde o usuário deve escolher uma única opção de uma lista fixa
- Filtros de listagem (status, tipo, categoria)
