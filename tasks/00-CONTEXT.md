# Integração Frontend ↔ Backend — Contexto

> Documento mestre para a fase de **integração do frontend com a API NestJS** (`tempfiles/jgmotors-api`).
> Este arquivo é a fonte da verdade para abrir tasks específicas dentro de [tasks/](.).
> Toda task nova deve referenciar uma seção deste documento.

---

## 1. Onde estamos

### Frontend (este repo, `jgmotors-web`)
- Stack: Vite 7 · React 19 · TS 5 · Tailwind v4 · TanStack Router/Query · Zustand · shadcn/ui · React Hook Form + Zod · Axios.
- A maior parte das **páginas já existe** (Cars, Customers, Employees, Providers, Sales, MyTasks, Optionals, Dashboard, Login). Hoje elas consomem **mock data** ou **mock stores** locais — nenhuma chamada HTTP real foi feita.
- Existem **duas camadas paralelas** que convivem hoje e precisam ser unificadas:
  - [src/lib/api.ts](src/lib/api.ts) — instância Axios "oficial" (ver CLAUDE.md), pega token do `useAuthStore`, baseURL `VITE_API_URL`.
  - [src/core/](src/core/) — pasta com `client.ts`, `models/`, `dto/`, `repositories/` em padrão Repository (criada antes, ainda **com endpoints antigos do Django** — snake_case, paths como `/auth/signin`, `/vehicle-optionals`). **Não está alinhada com a API NestJS atual.**
- Tipos em [src/types/](src/types/) ainda seguem o padrão **PLATAFORMA.md (Django)**: snake_case, IDs `number`, enums em minúsculo (`available`, `sold`).
- [auth.store.ts](src/store/auth.store.ts) tem o shape antigo (`is_staff`, `employee.full_name`, etc.).
- A feature `optionals` está mais avançada (tem `services/`, `hooks/`, mutations), mas usa um **store em memória** (`optionalsStore`), não a API.

### Backend (`tempfiles/jgmotors-api`)
- Stack: NestJS 11 · Prisma 7 (PostgreSQL) · JWT (`@nestjs/jwt`) · `@node-rs/argon2` · Swagger.
- Roda em `PORT` (default `3000`). **Sem prefixo global** — rotas vivem na raiz (`/auth`, `/brands`, etc.). Swagger em `/docs`, Redoc em `/redoc`.
- IDs são `string` (UUID v7). Campos camelCase no DTO/response.
- Pagination shape:
  ```ts
  interface Pagination<T> { data: T[]; total: number; page: number; limit: number }
  ```
- Auth: `Authorization: Bearer <accessToken>`, payload JWT `{ sub, email }`.

---

## 2. Endpoints já implementados no backend

| Módulo | Rota base | Auth | Endpoints | Observações |
|---|---|---|---|---|
| Auth | `/auth` | parcial | `POST /sign-up`, `POST /sign-in`, `POST /refresh-token` (Bearer) | Resp: `{ accessToken, refreshToken, user: { id, email } }`. Senha mínima **6** chars. |
| Users | `/users` | — | (vazio) | Controller registrado mas sem rotas expostas. |
| Addresses | `/addresses` | — | (vazio) | Controller registrado, só serviço (create/update). |
| Brands | `/brands` | JWT | CRUD completo + `GET ?page&limit` | Campos: `name`, `isActive?`. |
| Categories | `/categories` | JWT | CRUD completo + paginação | Campos: `name`, `image?` (URL), `isActive?`. |
| Customers | `/customers` | JWT | CRUD completo + paginação | Campos: `fullName`, `personType` (`PF`/`PJ`), `document`, `email`, `phone?`, `userId?`, `addressId?`, `isActive?`. |
| Employees | `/employees` | JWT | CRUD completo + paginação | Create exige `userId`; Update **não** aceita `userId`. Campos: `fullName`, `phone?`, `role?`, `isActive?`. |
| Financial | `/financial` | JWT | CRUD transações + paginação | Campos: `type` (`PAYABLE`/`RECEIVABLE`), `status?` (`PENDING`/`PAID`/`OVERDUE`/`CANCELLED`), `description`, `amount`, `dueDate`, `paidAt?`, `notes?`, `customerId?`, `providerId?`, `vehicleId?`. |
| Optionals | `/optionals` | JWT | CRUD + paginação | Campos: `name`, `vehicleId?`, `isActive?`. |
| Optional Profiles | `/optionals/profiles` | JWT | CRUD + paginação | Campos: `name`, `vehicleOptionalIds: string[]`, `isActive?`. M:N com `VehicleOptional`. |
| Vehicles | `/vehicles` | JWT | CRUD + paginação | Ver seção 3 (campos completos). |

Convenção em todos os CRUDs:
- `GET /` — query `page` (default 1), `limit` (default 10) → `Pagination<T>`
- `GET /:id` — 404 padronizado se não achar
- `POST /` — payload do `Create*Dto`
- `PATCH /:id` — `PartialType` do create
- `DELETE /:id`

---

## 3. Modelos Prisma (resumo dos campos)

Todos têm `id: string (uuid v7)`, `createdAt`, `updatedAt`. Onde houver `*Active` é boolean default `true`.

- **User** — `email` (unique), `password` (hash), `isActive`. Relações 1:1 com `Customer` e `Employee`.
- **Employee** — `userId` (unique FK), `fullName`, `phone?`, `role?`, `isActive`.
- **Customer** — `userId?` (unique FK), `fullName`, `personType: PF|PJ`, `document` (unique), `email`, `phone?`, `addressId?`, `isActive`.
- **Address** — `zipCode`, `street`, `number`, `complement?`, `neighborhood`, `latitude?`, `longitude?`, `cityId` (FK).
- **City** — `name`, `state` (enum 27 UFs), `latitude`, `longitude`, `area`.
- **Brand** — `name`, `isActive`.
- **Category** — `name`, `image?`, `isActive`.
- **Vehicle** — `licensePlate` (unique), `renavam` (unique), `chassis` (unique), `model` (string), `color`, `manufactureYear`, `modelYear`, `mileage`, `fuelType` (enum), `engine`, `transmission` (enum), `oldPrice?: Decimal`, `price: Decimal`, `isPublished`, `isB2bVisible`, `isB2cVisible`, `status` (enum), `brandId`, `categoryId`. Relação N com `optionals` e `financialTransactions`.
- **VehicleOptional** — `name`, `isActive`, `vehicleId?`. M:N com `VehicleOptionalProfile`.
- **VehicleOptionalProfile** — `name`, `isActive`. M:N com `VehicleOptional`.
- **Provider** — `name`, `document`, `email?`, `phone?`, `address?` (string livre), `isActive`, `notes?`. **Sem controller.**
- **FinancialTransaction** — ver tabela acima.

### Enums relevantes
- `FuelType`: `FLEX | GASOLINE | ETHANOL | DIESEL | ELECTRIC | HYBRID | GNV`
- `TransmissionType`: `MANUAL | AUTOMATIC | CVT | SEMI_AUTO | DUAL_CLUTCH`
- `VehicleStatus`: `AWAITING_RELEASE | IN_TRANSIT | IN_YARD | SOLD | RESERVED | IN_PREPARATION`
- `CustomerType`: `PF | PJ`
- `TransactionType`: `PAYABLE | RECEIVABLE`
- `TransactionStatus`: `PENDING | PAID | OVERDUE | CANCELLED`
- `State`: 27 UFs brasileiras

---

## 4. Gaps entre o que existe (backend) e o que o frontend assume

### 4.1 Backend tem, frontend ainda não consome
Tudo na seção 2 — nenhum dos serviços/hooks reais foi escrito ainda.

### 4.2 Frontend assume, backend não entrega ainda
Itens de PLATAFORMA.md / telas existentes que **não têm endpoint hoje**:
- **Sales** — não há módulo `sales` no backend (página `/sales` está mockada).
- **Workflow / Steps / Tasks / Teams / TaskComments / TaskAttachments** — nada disso existe (página `/my-tasks` está mockada).
- **Provider CRUD** — modelo existe, controller não. (Página `/providers` mockada.)
- **CarImage / cover_image / galeria** — não há entidade nem upload de imagem para veículo.
- **ProductCost** — substituído por `FinancialTransaction` (modelo diferente; precisa adaptar a tela "Custos do Carro").
- **Customer Portal** (`/portal/*`) — sem endpoints.
- **`is_staff` / permissões por papel** — `User` não tem `isStaff`. Toda rota protegida hoje só checa "está autenticado".
- **Endpoint "me" / dados do usuário logado** — `sign-in` devolve só `{ id, email }`. Para mostrar nome/cargo/avatar precisamos buscar `Employee` por `userId` (sem rota dedicada hoje — só `GET /employees/:id` por id de employee, não de user).

### 4.3 Discrepâncias de shape
- Tudo em snake_case nos types/DTOs do frontend (`full_name`, `is_active`, `purchase_price`, `sale_price`) vs camelCase no backend (`fullName`, `isActive`, `price`, `oldPrice`).
- IDs `number` no frontend vs `string` (UUID) no backend.
- Vehicle: frontend tem `car_model: { brand, name }` (hierarquia marca→modelo→carro). Backend tem `model: string` + `brandId` apenas (sem `CarModel`). **A tela de veículos vai precisar mudar.**
- Vehicle status: frontend usa `available|preparing|sold|reserved`; backend usa `AWAITING_RELEASE|IN_TRANSIT|IN_YARD|SOLD|RESERVED|IN_PREPARATION`. Precisamos novo mapa de labels/cores em PT-BR.
- Pagination: hoje [src/core/models/pagination.ts](src/core/models/pagination.ts) tem `{ count, next, previous, results }` (DRF). Backend devolve `{ data, total, page, limit }`. Precisa renomear / unificar.
- Auth signin: [src/core/repositories/auth-repository.ts](src/core/repositories/auth-repository.ts) chama `/auth/signin` (sem hífen) — backend é `/auth/sign-in`. Mesma coisa para `signup` e `refresh-token`. **Schema `signinSchema` exige senha ≥ 8** mas backend aceita ≥ 6.
- Base URL: [src/core/lib/client.ts](src/core/lib/client.ts) usa `:8000` por default; a API NestJS roda em `:3000`. O `.env` atual também aponta para `:8000/api`. **Precisa atualizar.**

---

## 5. Decisão de arquitetura a tomar (ANTES de abrir tasks)

> **⚠️ Pergunta aberta para o time:** o frontend tem hoje **duas convenções competindo**.
>
> - Padrão "oficial" do CLAUDE.md / docs/ARCHITECTURE.md: feature-based, `features/{domain}/services/*.service.ts` + `hooks/`, axios via `lib/api.ts`, types em `src/types/`.
> - Padrão Repository já parcialmente implementado em [src/core/](src/core/): `core/repositories/*-repository.ts`, `core/dto/`, `core/models/`, axios via `core/lib/client.ts`.
>
> Antes de abrir as tasks de integração precisamos escolher **um** caminho. A recomendação (alinhada com CLAUDE.md) é **manter o padrão feature-based** e **descartar `src/core/`** (ou migrar o conteúdo útil para `src/types/` + `src/features/*/services/`). Se preferir manter Repository, atualizar CLAUDE.md/ARCHITECTURE.md primeiro.

---

## 6. Plano sugerido de tasks (a serem detalhadas em arquivos separados nesta pasta)

> Cada item abaixo deve virar um `tasks/NN-titulo.md` próprio, com escopo, arquivos afetados e critério de aceite.

### Fase 0 — Fundamentos (bloqueia tudo)
- **00.1** Decidir padrão de arquitetura (feature-based vs Repository) e atualizar CLAUDE.md/docs se mudar.
- **00.2** Atualizar `.env` / `VITE_API_URL` para `http://localhost:3000` (sem `/api`). Revisar [src/core/lib/client.ts](src/core/lib/client.ts) ou descartar.
- **00.3** Reescrever `src/types/` em camelCase + UUIDs, espelhando os modelos Prisma. Criar enums TS para `VehicleStatus`, `FuelType`, `TransmissionType`, `CustomerType`, `TransactionType`, `TransactionStatus`. Criar `src/types/pagination.ts` com `{ data, total, page, limit }`.
- **00.4** Refatorar [src/store/auth.store.ts](src/store/auth.store.ts) para `{ accessToken, refreshToken, user: { id, email } }` (matching `AuthResponse` do backend). Atualizar [src/lib/api.ts](src/lib/api.ts) para refresh automático no 401 usando `/auth/refresh-token`.
- **00.5** Criar helper `src/lib/labels.ts` com mapas PT-BR para os enums novos do backend (status veículo, tipo combustível, etc.).

### Fase 1 — Auth real
- **01.1** Implementar `features/auth/services/auth.service.ts` (sign-in, sign-up, refresh).
- **01.2** Refazer `LoginPage` para chamar a API real e popular o store.
- **01.3** Implementar guard de rota (TanStack Router `beforeLoad`) em [src/router/guards.tsx](src/router/guards.tsx) usando o store.

### Fase 2 — CRUDs simples (mesmo template aplicado N vezes)
Para cada módulo abaixo: criar `services/`, `hooks/` (com `*.keys.ts`), conectar a página existente, substituir mock pelo `useQuery`, e ligar formulários a `useMutation`.
- **02.1** Brands (não tem página ainda — talvez só serviço por enquanto, consumido pelo formulário de Veículos).
- **02.2** Categories (idem).
- **02.3** Vehicle Optionals — substituir o `optionalsStore` em memória pelo serviço real (`/optionals` e `/optionals/profiles`). Já existem `hooks/`, `services/`, página → trocar a implementação.
- **02.4** Customers — ligar [CustomersPage](src/features/customers/pages/CustomersPage.tsx) e [CustomerCreatePage](src/features/customers/pages/CustomerCreatePage.tsx) à API.
- **02.5** Employees — idem (ver regra: create exige `userId`; precisamos do fluxo "criar User → criar Employee" ou adaptar UI).
- **02.6** Vehicles — refazer `CarsPage` / `CarCreatePage` / `CarEditPage` para os novos campos (`renavam`, `chassis`, `engine`, `model` flat, `oldPrice`, flags `isPublished`/`isB2b`/`isB2c`, novo enum de status).
- **02.7** Financial Transactions — nova página/feature `financial/` (não existe hoje; substitui a tela de "Custos do Carro").

### Fase 3 — Pendências do backend (escopo do backend, não do frontend)
Não dá para implementar no frontend agora. Ficam como **bloqueios documentados** até o backend entregar:
- **03.1** Endpoint `Provider` (CRUD) — habilitar página `/providers`.
- **03.2** Endpoint `Sales` — habilitar página `/sales`.
- **03.3** Endpoints de Workflow / Tasks / Teams — habilitar `/my-tasks`, `/workflows`, `/teams`.
- **03.4** Upload de imagens de veículo — habilitar galeria/cover.
- **03.5** Endpoint "me" + roles — para mostrar nome/cargo no sidebar e implementar permissões staff-only.
- **03.6** Portal do cliente.

Enquanto isso: manter as páginas dessas features com mock + banner "🚧 Aguardando endpoint do backend" para não confundir.

---

## 7. Convenções para abrir tasks aqui

- Arquivo: `tasks/NN-titulo-curto.md` (NN = ordem, ex.: `01-auth-flow.md`).
- Frontmatter sugerido:
  ```md
  # NN — Título da Task
  - **Fase**: 0/1/2/3
  - **Depende de**: NN, NN
  - **Status**: pending | in-progress | blocked | done
  - **Bloqueio**: (se blocked, descrever)
  ```
- Conteúdo: **escopo**, **arquivos a tocar**, **endpoint(s) consumido(s)**, **critério de aceite** (tela X exibe lista da API, formulário Y cria registro etc.).
- Sempre referenciar a seção deste documento em vez de duplicar contexto.

---

## 8. Referências rápidas

- Backend: [tempfiles/jgmotors-api/](tempfiles/jgmotors-api/) · [CLAUDE.md](tempfiles/jgmotors-api/CLAUDE.md) · [prisma/schema/](tempfiles/jgmotors-api/prisma/schema/)
- Swagger (quando rodando): `http://localhost:3000/docs`
- Redoc: `http://localhost:3000/redoc`
- Doc de plataforma (frontend, Django-era): [.private-docs/PLATAFORMA.md](.private-docs/PLATAFORMA.md) — usar com cuidado, várias coisas mudaram.
- Setup do frontend: [.private-docs/SETUP_FRONTEND.md](.private-docs/SETUP_FRONTEND.md)
- Regras de código: [CLAUDE.md](CLAUDE.md) · [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)
