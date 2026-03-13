# Customers Feature — Especificação Técnica

> Última atualização: Março 2026

---

## Visão Geral

Feature de gestão de clientes da concessionária. Suporta Pessoa Física (CPF) e Pessoa Jurídica (CNPJ). Permite listar, buscar e cadastrar clientes. Segue integralmente o padrão de particionamento com separação de dados, colunas, schema e formulário.

**Rotas:** `/customers` (listagem), `/customers/new` (cadastro)
**Layout:** Dentro do `AppLayout` (sidebar + header)

---

## Estrutura de Arquivos

```
src/features/customers/
├── pages/
│   ├── CustomersPage.tsx         # Listagem de clientes (~65 linhas)
│   └── CustomerCreatePage.tsx    # Orquestrador do formulário (~46 linhas)
├── components/
│   ├── CustomersTable.tsx        # Definição de colunas da tabela
│   └── CustomerForm.tsx          # Formulário com 3 cards de seção
└── data/
    ├── customers.mock.ts         # Mock data + status/person_type configs
    └── customer.schema.ts        # Schema Zod + tipo FormData + options
```

---

## Páginas

### `CustomersPage.tsx` — Listagem

| Item | Detalhe |
|---|---|
| Rota | `/customers` |
| Export | `export function CustomersPage()` (named export) |
| Linhas | ~65 |
| Estado local | `query` (string), `page` (number) |

#### Composição

```
CustomersPage
├── Page header (título + botão "Novo Cliente")
└── AppDataTable (com customerColumns)
```

#### Funcionalidades

- **Busca:** filtra por nome, e-mail ou documento (case-insensitive)
- **Paginação:** client-side, 10 itens por página
- **Navegação:** botão "Novo Cliente" redireciona para `/customers/new`

### `CustomerCreatePage.tsx` — Cadastro

| Item | Detalhe |
|---|---|
| Rota | `/customers/new` |
| Export | `export function CustomerCreatePage()` (named export) |
| Linhas | ~46 |

#### Composição

```
CustomerCreatePage
├── Page header (botão voltar + título)
└── CustomerForm (onSubmit, onCancel)
```

---

## Componentes

### `CustomersTable.tsx`

Exporta `customerColumns: AppDataTableColumn<Customer>[]` — definição pura das colunas.

| Coluna | Key | Detalhes |
|---|---|---|
| Cliente | `full_name` | Ícone Users + nome + e-mail |
| Tipo | `person_type` | Badge: PF (brand) ou PJ (info) |
| Documento | `document` | `font-mono`, CPF ou CNPJ formatado |
| Telefone | `phone` | Texto simples, "—" se null |
| Status | `is_active` | Badge: Ativo / Inativo |
| Ações | `_actions` | 3 botões ghost: Eye, Pencil, Trash2 |

**Diferenciação visual PF/PJ:**

| Tipo | Estilo |
|---|---|
| PF | `bg-brand-50 text-brand-600 dark:bg-brand-500/15 dark:text-brand-300` |
| PJ | `bg-info-bg text-info` |

### `CustomerForm.tsx`

Formulário de criação com validação Zod e campos dinâmicos baseados no tipo de pessoa.

| Item | Detalhe |
|---|---|
| Schema | Importado de `customer.schema.ts` |
| Validação | `zodResolver` via React Hook Form |
| Cards | 3 seções: Dados do Cliente, Contato, Endereço e Status |

#### Props

```ts
interface CustomerFormProps {
  onSubmit: (data: CustomerFormData) => void
  onCancel: () => void
  isSubmitting?: boolean
}
```

#### Campos do formulário

| Campo | Tipo | Validação | Comportamento dinâmico |
|---|---|---|---|
| `full_name` | `AppInput` | `min(2)` | — |
| `person_type` | `AppSelect` | `enum(PF, PJ)` | Altera label e placeholder do documento |
| `document` | `AppInput` | `min(11)` | Label: "CPF" ou "CNPJ"; Placeholder dinâmico |
| `email` | `AppInput` (email) | `email()` | — |
| `phone` | `AppInput` (tel) | Opcional | — |
| `address` | `AppTextarea` | Opcional | 2 linhas, sem resize |
| `is_active` | `AppSelect` | `enum(true, false)` | — |

#### Lógica dinâmica

```ts
const personType = watch("person_type")
const documentPlaceholder = personType === "PF" ? "000.000.000-00" : "00.000.000/0000-00"
const documentLabel = personType === "PF" ? "CPF" : "CNPJ"
```

#### Componentes utilizados

| Componente | Origem |
|---|---|
| `AppInput` | `@/components/shared/AppInput` |
| `AppSelect` | `@/components/shared/AppSelect` |
| `AppTextarea` | `@/components/shared/AppTextarea` |
| `AppButton` | `@/components/shared/AppButton` |
| `Card`, `CardContent`, `CardHeader` | `@/components/ui/card` |
| `Separator` | `@/components/ui/separator` |
| `Button` | `@/components/ui/button` |

---

## Schema (`customer.schema.ts`)

Arquivo dedicado com schema Zod, tipo inferido e opções dos selects.

### Exports

```ts
export const customerSchema          // z.object({...})
export type CustomerFormData         // z.infer<typeof customerSchema>
export const PERSON_TYPE_OPTIONS     // [{ label, value }]
export const STATUS_OPTIONS          // [{ label, value }]
```

---

## Dados Mock (`customers.mock.ts`)

### Constantes exportadas

- `CUSTOMER_STATUS_CONFIG` — mapa active/inactive → label + className
- `PERSON_TYPE_CONFIG` — mapa PF/PJ → label + short
- `CUSTOMERS` — 10 clientes mock (7 PF, 3 PJ, 2 inativos)

### Status de clientes

| Status | Label | Estilo |
|---|---|---|
| `active` | Ativo | `bg-success-bg text-success` |
| `inactive` | Inativo | `bg-muted text-muted-foreground` |

---

## Tipos (`src/types/customers.ts`)

```ts
type PersonType = "PF" | "PJ"
type CustomerStatus = "active" | "inactive"

interface Customer {
  id: number
  full_name: string
  person_type: PersonType
  document: string
  email: string
  phone: string | null
  address: string | null
  is_active: boolean
  created_at: string
  updated_at: string
}

interface CreateCustomerDTO {
  full_name: string
  person_type: PersonType
  document: string
  email: string
  phone?: string
  address?: string
  is_active: boolean
}
```

---

## Regras de Negócio

- Clientes podem ser **Pessoa Física (CPF)** ou **Pessoa Jurídica (CNPJ)**
- O documento é validado com algoritmo oficial de CPF/CNPJ (a implementar via `src/utils/validators.ts`)
- Um cliente pode ter uma conta de acesso ao portal (opcional, campo `user`)
- Clientes no portal veem apenas suas próprias compras

---

## Próximos Passos

- [ ] Criar tela de detalhe `/customers/$id` com histórico de compras
- [ ] Criar tela de edição `/customers/$id/edit` (reutiliza `CustomerForm`)
- [ ] Conectar ao backend via `customers.service.ts` + hook `useCustomers`
- [ ] Implementar máscara dinâmica de CPF/CNPJ no input via `src/utils/masks.ts`
- [ ] Implementar exclusão com dialog de confirmação
- [ ] Adicionar validação de CPF/CNPJ com algoritmo via `src/utils/validators.ts`
