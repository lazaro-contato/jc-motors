# AppSearchSelect

**Arquivo:** `src/components/shared/AppSearchSelect.tsx`
**Tipo:** Componente shared
**Prefixo:** `App`

---

## Propósito

Select de seleção simples com campo de busca integrado (combobox). Ideal para listas longas onde o usuário precisa filtrar antes de escolher. Implementado com Radix Popover + cmdk. Diferencia-se do `AppSelect` nativo por ter busca, e do `AppMultiSelect` por aceitar apenas um valor por vez.

---

## Props

| Prop | Tipo | Padrão | Descrição |
|---|---|---|---|
| `options` | `SelectOption[]` | **obrigatório** | Array de opções `{ label, value, disabled? }` |
| `value` | `string` | — | Valor selecionado (modo controlado) |
| `onChange` | `(value: string) => void` | — | Callback ao selecionar (recebe o novo value, ou `""` ao desselecionar) |
| `placeholder` | `string` | `"Selecione uma opção"` | Texto do trigger quando nada selecionado |
| `searchPlaceholder` | `string` | `"Buscar..."` | Placeholder do campo de busca interno |
| `emptyText` | `string` | `"Nenhum resultado encontrado."` | Texto quando nenhuma opção corresponde à busca |
| `isDisabled` | `boolean` | `false` | Desabilita o componente |
| `error` | `string \| boolean` | — | `string` exibe mensagem de erro; `boolean` ativa estilo de erro |
| `className` | `string` | — | Classes extras no trigger |

---

## Comportamento

### Seleção e desseleção
- Clicar em uma opção a seleciona e fecha o popover.
- Clicar na opção **já selecionada** desseleciona (chama `onChange("")`) e fecha o popover.
- A lógica está em `handleSelect`: `onChange?.(optValue === value ? "" : optValue)`.

### Trigger
- Exibe o `label` da opção selecionada; se nada selecionado, exibe o `placeholder` em `text-muted-foreground`.
- Ícone `ChevronDown` fixo à direita (não rotaciona ao abrir).

### Popover
- Largura espelha o trigger via `triggerRef.current.offsetWidth`.
- Mínimo de `12rem`.

### Checkmark
- Opção selecionada exibe `<Check className="ml-auto size-4 text-primary" />` à direita do label.

### Busca
- Gerenciada pelo `CommandInput` interno (cmdk) — filtra por label automaticamente.

---

## Diferenças entre os selects

| Componente | Busca | Múltipla | Desselecionar |
|---|---|---|---|
| `AppSelect` | Não | Não | Não (nativo Radix) |
| `AppSearchSelect` | Sim | Não | Sim (re-click) |
| `AppMultiSelect` | Sim | Sim | Sim (re-click / X) |

---

## Dependências

| Dependência | Uso |
|---|---|
| `@/components/ui/command` | Busca e lista de opções |
| `@/components/ui/popover` | Dropdown |
| `./AppSelect` | Tipo `SelectOption` |
| `lucide-react` (`Check`, `ChevronDown`) | Ícones |
| `@/lib/utils` (`cn`) | Composição de classes Tailwind |

---

## Exemplos de uso

```tsx
const [brand, setBrand] = useState("")

<AppSearchSelect
  options={brandOptions}
  value={brand}
  onChange={setBrand}
  placeholder="Selecione a marca"
  searchPlaceholder="Buscar marca..."
/>

// Com erro
<AppSearchSelect
  options={cityOptions}
  value={city}
  onChange={setCity}
  error={errors.city?.message}
/>

// Desabilitado
<AppSearchSelect
  options={options}
  value={value}
  onChange={setValue}
  isDisabled
/>
```

---

## Onde é usado

- Formulários com listas longas: marcas de veículos, cidades, fornecedores, funcionários responsáveis
- Qualquer select onde o usuário se beneficia de filtrar por texto antes de escolher
