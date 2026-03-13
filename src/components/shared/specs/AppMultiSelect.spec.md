# AppMultiSelect

**Arquivo:** `src/components/shared/AppMultiSelect.tsx`
**Tipo:** Componente shared
**Prefixo:** `App`

---

## Propósito

Select com busca e seleção múltipla. Exibe as opções selecionadas como badges (chips) no trigger. Suporta remoção individual de badges, limpeza total e limitação visual de quantos badges são exibidos. Implementado com Radix Popover + cmdk (`Command`).

---

## Props

| Prop | Tipo | Padrão | Descrição |
|---|---|---|---|
| `options` | `SelectOption[]` | **obrigatório** | Array de opções `{ label, value, disabled? }` |
| `value` | `string[]` | `[]` | Array de values selecionados (modo controlado) |
| `onChange` | `(values: string[]) => void` | — | Callback ao selecionar/desselecionar (recebe o novo array completo) |
| `placeholder` | `string` | `"Selecione as opções"` | Texto do trigger quando nada selecionado |
| `searchPlaceholder` | `string` | `"Buscar..."` | Placeholder do campo de busca interno |
| `emptyText` | `string` | `"Nenhum resultado encontrado."` | Texto quando nenhuma opção corresponde à busca |
| `maxBadges` | `number` | `2` | Máximo de badges visíveis no trigger antes do overflow `+N` |
| `isDisabled` | `boolean` | `false` | Desabilita o componente inteiro |
| `error` | `string \| boolean` | — | `string` exibe mensagem de erro; `boolean` ativa estilo de erro |
| `className` | `string` | — | Classes extras no trigger |

---

## Comportamento

### Seleção / desseleção
- Clicar em uma opção no dropdown a adiciona ao array; clicar novamente a remove (toggle).
- A função interna `toggle` manipula o array sem mutação direta.

### Badges no trigger
- Exibe até `maxBadges` badges com label + botão `X` individual.
- Excedente exibido como `+N` em badge cinza.
- Cada badge tem botão de remoção individual (`removeOne`) que faz `e.stopPropagation()` para não fechar o popover.

### Limpeza total
- Quando há ao menos 1 selecionado, exibe ícone `X` à direita do trigger.
- `clearAll` chama `onChange([])` e faz `e.stopPropagation()`.

### Popover
- `onOpenChange` recebe `undefined` quando `isDisabled` — impede abertura.
- Largura do `PopoverContent` espelha a do trigger via `triggerRef.current.offsetWidth`.

### Busca
- Gerenciada pelo `CommandInput` interno (cmdk) — filtra opções pelo label automaticamente.

### Checkbox visual
- Cada opção exibe um checkbox visual (não nativo) que reflete o estado `isSelected`.
- Cor: `border-primary bg-primary` quando selecionado; `border-input` quando não.

---

## Dependências

| Dependência | Uso |
|---|---|
| `@/components/ui/command` | Busca e lista de opções (`Command`, `CommandInput`, etc.) |
| `@/components/ui/popover` | Dropdown (`Popover`, `PopoverContent`, `PopoverTrigger`) |
| `./AppSelect` | Tipo `SelectOption` |
| `lucide-react` (`Check`, `ChevronDown`, `X`) | Ícones |
| `@/lib/utils` (`cn`) | Composição de classes Tailwind |

---

## Exemplos de uso

```tsx
const [selected, setSelected] = useState<string[]>([])

<AppMultiSelect
  options={[
    { label: 'Honda Civic', value: 'civic' },
    { label: 'Toyota Corolla', value: 'corolla' },
    { label: 'Volkswagen Polo', value: 'polo' },
  ]}
  value={selected}
  onChange={setSelected}
  placeholder="Selecione os veículos"
/>

// Com máximo de 3 badges visíveis
<AppMultiSelect
  options={colorOptions}
  value={colors}
  onChange={setColors}
  maxBadges={3}
/>

// Com erro
<AppMultiSelect
  options={categoryOptions}
  value={categories}
  onChange={setCategories}
  error="Selecione ao menos uma categoria"
/>
```

---

## Onde é usado

- Filtros com seleção múltipla (status, categorias, marcas)
- Formulários onde uma entidade tem relação com múltiplos valores
