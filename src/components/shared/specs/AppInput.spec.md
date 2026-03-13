# AppInput

**Arquivo:** `src/components/shared/AppInput.tsx`
**Tipo:** Componente shared
**Prefixo:** `App`

---

## Propósito

Input com label, mensagem de erro, hint e suporte a ícones laterais. Quando `type="password"`, injeta automaticamente um botão de toggle (mostrar/ocultar senha) no lado direito — sem necessidade de nenhuma prop extra. Integra com o sistema de `InputGroup` do shadcn para composição com ícones.

---

## Props

| Prop | Tipo | Padrão | Descrição |
|---|---|---|---|
| `label` | `string` | — | Rótulo exibido acima do input, vinculado ao `id` via `htmlFor` |
| `hint` | `string` | — | Texto auxiliar abaixo do input (oculto quando há `error`) |
| `error` | `string \| boolean` | — | `string` exibe mensagem de erro; `boolean` ativa apenas o estilo de erro |
| `leftIcon` | `ReactNode` | — | Ícone ou elemento renderizado à esquerda dentro do input |
| `rightIcon` | `ReactNode` | — | Ícone ou elemento renderizado à direita (ignorado quando `type="password"`) |
| `isDisabled` | `boolean` | `false` | Desabilita o input |
| `id` | `string` | auto-gerado | ID do campo; gerado automaticamente com `useId()` se não fornecido |
| `className` | `string` | — | Classes extras aplicadas ao `input` interno |
| `...props` | `React.ComponentProps<"input">` | — | Todas as props nativas de `<input>` (`placeholder`, `onChange`, etc.) |

---

## Comportamento

### Toggle de senha (`type="password"`)
- O `rightIcon` externo é **ignorado** quando `type="password"`.
- Um botão `Eye` / `EyeOff` é injetado automaticamente.
- O estado `showPassword` é interno (`useState`) — não controlado pelo consumidor.
- Ao clicar, alterna o `type` entre `"password"` e `"text"`.

### Ícones
- Qualquer combinação de `leftIcon` + `rightIcon` ativa o wrapper `InputGroup`.
- Sem ícones, usa o `Input` primitivo diretamente (sem wrapper extra).

### Erro
- `error` como `string` não vazia: exibe a mensagem em `text-xs text-danger` + borda vermelha.
- `error` como `boolean` (`true`): aplica apenas o estilo de borda/ring de erro, sem mensagem.
- `hint` é suprimido quando `error` está presente.

### ID automático
- `useId()` gera um ID único por instância, garantindo que `<label htmlFor>` funcione corretamente mesmo sem passar `id` explicitamente.

---

## Dependências

| Dependência | Uso |
|---|---|
| `@/components/ui/input` | Input primitivo (shadcn) |
| `@/components/ui/input-group` | Wrapper para ícones (`InputGroup`, `InputGroupAddon`, etc.) |
| `@/components/ui/label` | Label shadcn |
| `lucide-react` (`Eye`, `EyeOff`) | Ícones do toggle de senha |
| `@/lib/utils` (`cn`) | Composição de classes Tailwind |

---

## Exemplos de uso

```tsx
// Básico
<AppInput label="Nome" placeholder="Ex: João Silva" />

// Com erro (mensagem)
<AppInput
  label="E-mail"
  type="email"
  error={errors.email?.message}
  {...register("email")}
/>

// Com erro (somente estilo)
<AppInput error={true} placeholder="Campo inválido" />

// Com hint
<AppInput label="CPF" hint="Apenas números" placeholder="000.000.000-00" />

// Com ícone esquerdo
<AppInput
  label="Busca"
  leftIcon={<Search className="size-4" />}
  placeholder="Buscar veículo..."
/>

// Senha com toggle automático
<AppInput label="Senha" type="password" {...register("password")} />

// Desabilitado
<AppInput label="Código" value="JGM-001" isDisabled />
```

---

## Integração com React Hook Form

```tsx
const { register, formState: { errors } } = useForm<FormData>({ resolver: zodResolver(schema) })

<AppInput
  label="Nome completo"
  error={errors.full_name?.message}
  {...register("full_name")}
/>
```

---

## Onde é usado

- Todos os formulários de criação e edição (clientes, fornecedores, veículos, funcionários)
- Campos de busca no layout (`Header.tsx`)
- Login (`LoginPage.tsx`)
