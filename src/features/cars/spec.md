# Cars Feature — Especificação Técnica

> Última atualização: Março 2026

---

## Visão Geral

Feature de gestão do estoque de veículos da concessionária. Permite listar, buscar e filtrar veículos cadastrados. Futuramente incluirá criação, edição e visualização detalhada.

**Rota:** `/cars`
**Layout:** Dentro do `AppLayout` (sidebar + header)

---

## Estrutura de Arquivos

```
src/features/cars/
└── pages/
    └── CarsPage.tsx              # Listagem de veículos com busca e paginação
```

> **Nota:** Esta feature ainda não está particionada. Mock data, tipos locais, status config e colunas da tabela estão inline no `CarsPage.tsx`. Ao evoluir para CRUD completo, deve ser refatorada seguindo a estrutura padrão com `components/`, `data/` e `hooks/`.

---

## Páginas

### `CarsPage.tsx`

| Item | Detalhe |
|---|---|
| Rota | `/cars` |
| Export | `export default function CarsPage()` |
| Linhas | ~307 (candidata a particionamento) |
| Estado local | `query` (string), `page` (number) |

#### Componentes utilizados

| Componente | Origem | Uso |
|---|---|---|
| `AppDataTable` | `@/components/shared/AppDataTable` | Tabela principal de listagem com busca e paginação |
| `AppButton` | `@/components/shared/AppButton` | Botão "Novo Veículo" no header |
| `Button` | `@/components/ui/button` | Botões de ação na tabela (ver, editar, excluir) |

#### Ícones (lucide-react)

`Car`, `Eye`, `Pencil`, `Plus`, `Trash2`

#### Status de veículos

| Status | Label | Estilo |
|---|---|---|
| `available` | Disponível | `bg-success-bg text-success` |
| `reserved` | Reservado | `bg-info-bg text-info` |
| `sold` | Vendido | `bg-muted text-muted-foreground` |
| `preparing` | Em prep. | `bg-warning-bg text-warning` |

#### Colunas da tabela

| Coluna | Key | Detalhes |
|---|---|---|
| Veículo | `name` | Ícone + nome + subtítulo (cor · km) |
| Placa | `plate` | Badge mono `font-mono` com fundo `bg-muted` |
| Ano | `year` | Alinhado ao centro |
| Combustível | `fuel` | Texto simples |
| Status | `status` | Badge colorido via `STATUS_CONFIG` |
| Preço | `price` | Alinhado à direita, `font-semibold` |
| Ações | `_actions` | 3 botões ghost: Eye, Pencil, Trash2 |

#### Funcionalidades

- **Busca:** filtra por nome ou placa (case-insensitive)
- **Paginação:** client-side, 10 itens por página
- **Mock data:** 10 veículos com dados realistas

---

## Refatoração Planejada

Para seguir a regra de particionamento (~80 linhas por página), esta feature deve ser reestruturada:

```
src/features/cars/
├── pages/
│   └── CarsPage.tsx              # Orquestrador (~50 linhas)
├── components/
│   └── CarsTable.tsx             # Colunas e render da tabela
└── data/
    └── cars.mock.ts              # Tipos, mock data, STATUS_CONFIG
```

---

## Tipos Locais (inline, a migrar para `src/types/cars.ts`)

```ts
type FuelType = "Gasolina" | "Álcool" | "Flex" | "Diesel" | "Elétrico" | "Híbrido"
type VehicleStatus = "available" | "reserved" | "sold" | "preparing"

interface Vehicle {
  id: number
  name: string
  plate: string
  year: number
  color: string
  fuel: FuelType
  km: string
  status: VehicleStatus
  price: string
}
```

---

## Próximos Passos

- [ ] Particionar `CarsPage.tsx` em `components/CarsTable.tsx` + `data/cars.mock.ts`
- [ ] Criar tela de criação `/cars/new` com `CarForm.tsx`
- [ ] Criar tela de detalhe `/cars/$id`
- [ ] Conectar ao backend via `cars.service.ts` + hook `useCars`
- [ ] Migrar tipos para `src/types/cars.ts`
