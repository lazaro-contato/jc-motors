# Providers Feature — Especificação Técnica

> Última atualização: Março 2026

---

## Visão Geral

Feature de gestão de fornecedores e parceiros comerciais da concessionária. Permite listar, buscar e cadastrar novos fornecedores. Segue o padrão de particionamento com separação de mock data, colunas de tabela e formulário.

**Rotas:** `/providers` (listagem), `/providers/new` (cadastro)
**Layout:** Dentro do `AppLayout` (sidebar + header)

---

## Estrutura de Arquivos

```
src/features/providers/
├── pages/
│   ├── ProvidersPage.tsx         # Listagem de fornecedores (~65 linhas)
│   └── ProviderCreatePage.tsx    # Orquestrador do formulário (~46 linhas)
├── components/
│   ├── ProvidersTable.tsx        # Definição de colunas da tabela
│   └── ProviderForm.tsx          # Formulário completo (schema + campos + actions)
└── data/
    └── providers.mock.ts         # Mock data + status config
```

---

## Páginas

### `ProvidersPage.tsx` — Listagem

| Item | Detalhe |
|---|---|
| Rota | `/providers` |
| Export | `export default function ProvidersPage()` |
| Linhas | ~65 |
| Estado local | `query` (string), `page` (number) |

#### Composição

```
ProvidersPage
├── Page header (título + botão "Novo Fornecedor")
└── AppDataTable (com providerColumns)
```

#### Funcionalidades

- **Busca:** filtra por nome, CNPJ ou responsável (case-insensitive)
- **Paginação:** client-side, 10 itens por página
- **Navegação:** botão "Novo Fornecedor" redireciona para `/providers/new`

### `ProviderCreatePage.tsx` — Cadastro

| Item | Detalhe |
|---|---|
| Rota | `/providers/new` |
| Export | `export default function ProviderCreatePage()` |
| Linhas | ~46 |

#### Composição

```
ProviderCreatePage
├── Page header (botão voltar + título)
└── ProviderForm (onSubmit, onCancel)
```

---

## Componentes

### `ProvidersTable.tsx`

Exporta `providerColumns: AppDataTableColumn<Provider>[]` — definição pura das colunas, sem estado.

| Coluna | Key | Detalhes |
|---|---|---|
| Fornecedor | `name` | Ícone Building2 + razão social + CNPJ |
| Responsável | `contact` | Nome + e-mail |
| Telefone | `phone` | Texto simples |
| Localidade | `city` | Cidade, UF |
| Status | `status` | Badge: Ativo / Inativo |
| Ações | `_actions` | 3 botões ghost: Eye, Pencil, Trash2 |

**Dependências:** `AppDataTableColumn`, `Button`, `Building2`, `Eye`, `Pencil`, `Trash2`, `cn`

### `ProviderForm.tsx`

Formulário completo de criação de fornecedor com validação via Zod.

| Item | Detalhe |
|---|---|
| Schema | Zod inline (`providerSchema`) |
| Validação | `zodResolver` via React Hook Form |
| Cards | 3 seções: Dados da Empresa, Contato, Localização |

#### Props

```ts
interface ProviderFormProps {
  onSubmit: (data: ProviderFormData) => void
  onCancel: () => void
  isSubmitting?: boolean
}
```

#### Campos do formulário

| Campo | Tipo | Validação |
|---|---|---|
| `name` | `AppInput` | `min(2)` |
| `cnpj` | `AppInput` | `min(18)` |
| `status` | `AppSelect` | `enum(active, inactive)` |
| `contact` | `AppInput` | `min(2)` |
| `email` | `AppInput` (email) | `email()` |
| `phone` | `AppInput` (tel) | `min(10)` |
| `city` | `AppInput` | `min(2)` |
| `state` | `AppSelect` (27 UFs) | `length(2)` |

#### Componentes utilizados

| Componente | Origem |
|---|---|
| `AppInput` | `@/components/shared/AppInput` |
| `AppSelect` | `@/components/shared/AppSelect` |
| `AppButton` | `@/components/shared/AppButton` |
| `Card`, `CardContent`, `CardHeader` | `@/components/ui/card` |
| `Separator` | `@/components/ui/separator` |
| `Button` | `@/components/ui/button` |

---

## Dados Mock (`providers.mock.ts`)

### Constantes exportadas

- `PROVIDER_STATUS_CONFIG` — mapa status → label + className
- `PROVIDERS` — 8 fornecedores com dados realistas

### Status de fornecedores

| Status | Label | Estilo |
|---|---|---|
| `active` | Ativo | `bg-success-bg text-success` |
| `inactive` | Inativo | `bg-muted text-muted-foreground` |

---

## Tipos (`src/types/providers.ts`)

```ts
type ProviderStatus = "active" | "inactive"

interface Provider {
  id: number
  name: string
  cnpj: string
  contact: string
  phone: string
  email: string
  city: string
  state: string
  status: ProviderStatus
  createdAt: string
}
```

---

## Próximos Passos

- [ ] Criar tela de detalhe `/providers/$id`
- [ ] Criar tela de edição `/providers/$id/edit` (reutiliza `ProviderForm`)
- [ ] Conectar ao backend via `providers.service.ts` + hook `useProviders`
- [ ] Adicionar máscara de CNPJ no input
- [ ] Implementar exclusão com confirmação (dialog)
