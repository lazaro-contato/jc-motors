# AppTextarea

**Arquivo:** `src/components/shared/AppTextarea.tsx`
**Tipo:** Componente shared
**Prefixo:** `App`

---

## Propósito

Textarea com label, hint, erro e controle de redimensionamento. API espelhada ao `AppInput` para consistência de uso em formulários. Por padrão, impede o redimensionamento manual pelo usuário (`resize-none`) para garantir layout previsível.

---

## Props

| Prop | Tipo | Padrão | Descrição |
|---|---|---|---|
| `label` | `string` | — | Rótulo exibido acima do textarea, vinculado via `htmlFor` |
| `hint` | `string` | — | Texto auxiliar abaixo (oculto quando há `error`) |
| `error` | `string \| boolean` | — | `string` exibe mensagem de erro; `boolean` ativa apenas o estilo de erro |
| `rows` | `number` | — | Número de linhas visíveis do textarea |
| `resizable` | `boolean` | `false` | Permite redimensionamento vertical (`resize-y`) |
| `isDisabled` | `boolean` | `false` | Desabilita o textarea |
| `id` | `string` | auto-gerado | ID do campo; gerado automaticamente com `useId()` se não fornecido |
| `className` | `string` | — | Classes extras aplicadas ao `<textarea>` interno |
| `...props` | `React.ComponentProps<"textarea">` | — | Todas as props nativas de `<textarea>` (`placeholder`, `onChange`, etc.) |

---

## Comportamento

### Resize
- `resizable={false}` (padrão): aplica `resize-none` — impede qualquer redimensionamento manual.
- `resizable={true}`: aplica `resize-y` — permite apenas redimensionamento vertical.

### Erro
- `error` como `string` não vazia: exibe a mensagem em `text-xs text-danger` + borda/ring vermelhos.
- `error` como `boolean` (`true`): aplica apenas o estilo visual de erro, sem mensagem.
- `hint` é suprimido quando `error` está presente.

### ID automático
- `useId()` garante ID único sem colisão, mesmo para múltiplos campos na mesma página.

---

## Dependências

| Dependência | Uso |
|---|---|
| `@/components/ui/textarea` | Textarea primitiva (shadcn) |
| `@/components/ui/label` | Label shadcn |
| `@/lib/utils` (`cn`) | Composição de classes Tailwind |

---

## Exemplos de uso

```tsx
// Básico
<AppTextarea label="Observações" placeholder="Descreva aqui..." />

// Altura fixa de 4 linhas sem resize
<AppTextarea label="Descrição" rows={4} />

// Redimensionável
<AppTextarea label="Notas internas" rows={3} resizable />

// Com erro (React Hook Form)
<AppTextarea
  label="Endereço"
  error={errors.address?.message}
  {...register("address")}
/>

// Com hint
<AppTextarea
  label="Observações"
  hint="Máximo de 500 caracteres."
  rows={4}
/>

// Desabilitado
<AppTextarea label="Histórico" value="..." isDisabled />
```

---

## Integração com React Hook Form

```tsx
const { register, formState: { errors } } = useForm<FormData>({ resolver: zodResolver(schema) })

<AppTextarea
  label="Descrição do veículo"
  rows={4}
  error={errors.description?.message}
  {...register("description")}
/>
```

---

## Onde é usado

- Formulários de criação/edição com campos de texto longo (descrição, observações, endereço)
- Qualquer campo `<textarea>` que precise de label ou validação visual
