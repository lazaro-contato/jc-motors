# 02 — Implementações Pendentes (O que falta fazer)

- **Fase**: 0 / 1 / 2
- **Status**: in-progress
- **Atualizado em**: 2026-05-11 (refresh automático no api.ts)

---

## Resumo do progresso

| Item | Status | Observação |
|------|--------|------------|
| 00.1 Decidir arquitetura (feature-based) | ✅ Done | Decidido. Doc `01-remove-core.md` criado. |
| 00.2 Atualizar `.env` / `api.ts` | ✅ Done | `.env.example` aponta para `:3000`. `api.ts` usa `VITE_API_URL` com fallback `:3000`. Refresh automático no 401 implementado com single-flight (`refreshPromise`) e flag `_retry` anti-loop. |
| 00.3 Reescrever `src/types/` (camelCase + UUID) | ✅ Done | Todos os tipos refeitos: `auth`, `cars`, `customers`, `employees`, `optionals`, `brand`, `category`, `financial`, `pagination`, `address`, `user`. |
| 00.4 Refatorar `auth.store.ts` | ✅ Done | Store com `{ accessToken, refreshToken, user: { id, email } }`, persist. |
| 00.5 Criar `src/lib/labels.ts` (mapas PT-BR) | ✅ Done | Labels + variants tipados para `VehicleStatus`, `FuelType`, `TransmissionType`, `CustomerType`, `TransactionType`, `TransactionStatus`. Componente `AppStatusBadge` criado consumindo o mapa de variants. |
| 01.1 Criar `auth.service.ts` | ✅ Done | `signIn`, `signUp`, `refreshToken`. |
| 01.2 Refazer `LoginPage` (formulário real) | ❌ Pendente | Página é placeholder sem form. |
| 01.3 Guard de rota (`beforeLoad`) | ⚠️ Parcial | `guards.tsx` existe com `requireAuth()` mas NÃO está aplicado nas rotas. |
| 02.1 Brands (service/hooks/page) | ⚠️ Parcial | Service feito. Faltam hooks e página. |
| 02.2 Categories (service/hooks/page) | ⚠️ Parcial | Service feito. Faltam hooks e página. |
| 02.3 Optionals (migrar para API real) | ✅ Done | CRUD de optionals e profiles ligado à API. Hooks: `useOptionals`, `useOptionalMutations`, `useProfiles`, `useProfileMutations`. Mock store removido. Convenção "Preset → Profile" aplicada. |
| 02.4 Customers (hooks + conectar página) | ⚠️ Parcial | Service feito. Faltam hooks. Páginas com mock. |
| 02.5 Employees (hooks + conectar página) | ⚠️ Parcial | Service feito. Faltam hooks. Páginas com mock. |
| 02.6 Vehicles (hooks + refazer páginas) | ⚠️ Parcial | Service feito. Faltam hooks. Páginas com mock/schema antigo. |
| 02.7 Financial (feature completa) | ⚠️ Parcial | Service feito. Faltam hooks, página, rota, link no sidebar. |
| Task 01 — Remover `src/core/` | ✅ Done | `src/core/` apagado. `grep "@/core/" src/` retorna vazio. `npm run typecheck` passa. |

---

## O que precisa ser implementado

### Fase 0 — Fundamentos (restante)

#### ✅ 0.1 — Criar `src/lib/labels.ts` — **CONCLUÍDA**

Arquivo [src/lib/labels.ts](../src/lib/labels.ts) criado com mapas tipados (`as const satisfies Record<EnumType, ...>`):
- `VehicleStatus` → `vehicleStatusLabels` + `vehicleStatusVariants`
- `FuelType` → `fuelTypeLabels`
- `TransmissionType` → `transmissionTypeLabels`
- `CustomerType` → `customerTypeLabels`
- `TransactionType` → `transactionTypeLabels` + `transactionTypeVariants`
- `TransactionStatus` → `transactionStatusLabels` + `transactionStatusVariants`

Também exporta `LabelVariant` (`default | success | warning | danger | info`) e `labelVariantClasses` apontando para tokens do design system (`bg-success-bg text-success`, etc.).

Componente [AppStatusBadge](../src/components/shared/AppStatusBadge.tsx) criado em `components/shared/` consumindo `labelVariantClasses`. `npm run typecheck` passa. Pronto para uso nas tabelas/badges das próximas tasks (veículos, transações) — basta `<AppStatusBadge label={vehicleStatusLabels[v.status]} variant={vehicleStatusVariants[v.status]} />`.

---

#### ✅ 0.2 — Refresh automático no interceptor 401 — **CONCLUÍDA**

Implementação em [src/lib/api.ts](../src/lib/api.ts):

- **Request interceptor:** injeta `Authorization: Bearer <accessToken>` se ainda não vier setado (assim a chamada de refresh pode sobrescrever com o `refreshToken`).
- **Response interceptor:** ao receber 401:
  - **Em `/auth/refresh-token`**: refreshToken expirou → `logoutAndRedirect()`.
  - **Em `/auth/sign-in` ou `/auth/sign-up`**: credenciais inválidas → propaga erro pro caller (sem refresh, sem logout).
  - **Em qualquer outra rota:** tenta `refreshAccessToken()` uma única vez (`originalRequest._retry`), atualiza tokens via `useAuthStore.setTokens()` e re-executa a request original com o novo `accessToken`.
  - **Se já houve `_retry` e ainda assim deu 401:** sessão definitivamente quebrada → `logoutAndRedirect()`.
- **Single-flight:** `refreshPromise` evita múltiplas chamadas simultâneas de refresh quando várias requests pegam 401 ao mesmo tempo (queries paralelas do TanStack Query). Todas aguardam o mesmo refresh.
- **Anti-loop:** flag `_retry` + check de URL nunca aciona refresh recursivamente.
- **Redirect:** `window.location.href = '/login'` só se ainda não estiver lá (evita reload desnecessário).

Também ajustado [auth.service.ts](../src/features/auth/services/auth.service.ts): `refreshToken` agora recebe o token como parâmetro e injeta no header explicitamente (não depende mais do interceptor injetar o `accessToken`).

**Critério de aceite:**
- [x] Sessão não expira enquanto o refreshToken for válido — refresh transparente
- [x] Sem loop infinito em caso de refreshToken expirado — flag `_retry` + skip em `/auth/refresh-token`
- [x] Sem múltiplos refreshes paralelos — single-flight via `refreshPromise`
- [x] `npm run typecheck` passa

---

### Fase 1 — Auth real

#### 1.1 — Implementar `LoginPage` com formulário funcional

**Arquivos a tocar:**
- `src/features/auth/pages/LoginPage.tsx`

**Escopo:**
- Formulário com React Hook Form + Zod (email + senha, min 6 chars)
- Chamar `authService.signIn()` no submit
- Popular o `useAuthStore` com a response
- Redirecionar para `/` após login com sucesso
- Exibir toast de erro em caso de falha
- Design alinhado com o design system (usar `AppInput`, `AppButton`)

**Critério de aceite:**
- [ ] Login funciona contra o backend NestJS
- [ ] Token é persistido (refresh de página mantém sessão)
- [ ] Erro de credenciais exibe feedback visual
- [ ] Redirect para dashboard após sucesso

---

#### 1.2 — Ativar guard de rota no router

**Arquivos a tocar:**
- `src/router/index.tsx`

**Escopo:**
- Aplicar `requireAuth()` como `beforeLoad` no `appRoute` (protege todas as rotas filhas)
- Garantir que `/login` não redireciona se já autenticado (redirect para `/`)

**Critério de aceite:**
- [ ] Acessar qualquer rota sem token redireciona para `/login`
- [ ] Após login, navegar livremente entre rotas protegidas
- [ ] Acessar `/login` autenticado redireciona para `/`

---

### ✅ Fase 2 — Remover `src/core/` (Task 01) — **CONCLUÍDA**

> Detalhes em [tasks/01-remove-core.md](01-remove-core.md)

Todos os imports `@/core/` migrados (`@/types/optionals`, `@/types/pagination`, services correspondentes). `src/core/` apagado. Mock stores (`optionals-store.ts`, `optionals-data.ts`) e hooks mortos (`useCreateOptional`, `useUpdateOptional`, `queries.ts` de cars) removidos.

**Decisões registradas:**
- Convenção de naming: backend chama `VehicleOptionalProfile`, frontend usa `Profile`/`profiles` (mais curto). PT-BR migrou de "preset" para "perfil".
- O `OptionalFormDialog` não tem mais select de profile e a `OptionalsTable` perdeu a coluna "Perfil" — backend modela a relação M:N **no lado do profile** (`VehicleOptionalProfile.vehicleOptionalIds[]`), então não dá pra setar "este optional pertence a X profile" diretamente no optional. Reconstruir essa UX é tarefa separada (precisa de `include` no backend ou múltiplas chamadas).

---

### Fase 2 — CRUDs (conectar páginas à API)

#### 2.1 — Brands: hooks + integração no formulário de Veículos

**Arquivos a criar:**
- `src/features/brands/hooks/queries.ts`
- `src/features/brands/hooks/useBrands.ts`

**Escopo:**
- Hooks de `useQuery` para listar brands (usado como select no form de veículo)
- Não precisa de página/CRUD completo na UI por enquanto — apenas consumido como combobox

**Critério de aceite:**
- [ ] Formulário de veículo puxa marcas da API real
- [ ] Sem mock data hardcoded para marcas

---

#### 2.2 — Categories: hooks + integração no formulário de Veículos

**Arquivos a criar:**
- `src/features/categories/hooks/queries.ts`
- `src/features/categories/hooks/useCategories.ts`

**Escopo:** Mesmo padrão de Brands.

**Critério de aceite:**
- [ ] Formulário de veículo puxa categorias da API real

---

#### ✅ 2.3 — Optionals: conectar página à API real — **CONCLUÍDA**

Concluído junto com a Task 01.
- `OptionalsPage` consome `useOptionals` + `useProfiles` (paginação unwrapped: `data?.data`).
- `useOptionalMutations` (create/update/delete) e `useProfileMutations` apontam para os services reais.
- Mock store deletado.
- Hooks duplicados removidos (mantidos `useProfiles` / `useProfileMutations`, descartados `useOptionalProfile*`).

**Pendência conhecida (out of scope):** select/coluna de "profile" no formulário/tabela de optionals — removido. Reconstruir como M:N de verdade exige mudança no backend (incluir `vehicleOptionalIds` ao listar profiles) ou hooks compostos no frontend.

---

#### 2.4 — Customers: hooks + conectar páginas

**Arquivos a criar:**
- `src/features/customers/hooks/queries.ts`
- `src/features/customers/hooks/useCustomers.ts`
- `src/features/customers/hooks/useCustomerMutations.ts`

**Arquivos a modificar:**
- `src/features/customers/pages/CustomersPage.tsx` — trocar mock por `useCustomers()`
- `src/features/customers/pages/CustomerCreatePage.tsx` — usar `useCreateCustomer()`
- `src/features/customers/components/CustomersTable.tsx` — ajustar tipos se necessário

**Critério de aceite:**
- [ ] Listagem de clientes vem da API
- [ ] Criar cliente via formulário persiste no backend
- [ ] Paginação funcional
- [ ] Sem mock data

---

#### 2.5 — Employees: hooks + conectar páginas

**Arquivos a criar:**
- `src/features/employees/hooks/queries.ts`
- `src/features/employees/hooks/useEmployees.ts`
- `src/features/employees/hooks/useEmployeeMutations.ts`

**Arquivos a modificar:**
- `src/features/employees/pages/EmployeesPage.tsx`
- `src/features/employees/pages/EmployeeCreatePage.tsx`
- `src/features/employees/components/EmployeesTable.tsx`

**Decisão de UX necessária:**
- Backend exige `userId` para criar employee. Opções:
  1. Criar um User automaticamente antes de criar Employee (fluxo transparente)
  2. Exigir que o admin selecione um User existente (select/combobox)
  3. Criar ambos num único formulário (sign-up + employee data)

**Critério de aceite:**
- [ ] Listagem vem da API
- [ ] Criar funcionário funciona (com o fluxo de userId definido)
- [ ] Edição parcial funciona (sem alterar userId)
- [ ] Sem mock data

---

#### 2.6 — Vehicles: hooks + refazer páginas

**Arquivos a criar:**
- `src/features/cars/hooks/useVehicles.ts`
- `src/features/cars/hooks/useVehicle.ts`
- `src/features/cars/hooks/useVehicleMutations.ts`
- Atualizar `src/features/cars/hooks/queries.ts` (query keys de vehicles)

**Arquivos a modificar:**
- `src/features/cars/pages/CarsPage.tsx` — trocar mock por `useVehicles()`
- `src/features/cars/pages/CarCreatePage.tsx` — formulário para novos campos
- `src/features/cars/pages/CarEditPage.tsx` — popular com `useVehicle(id)`
- `src/features/cars/components/CarForm.tsx` — adaptar ao novo schema (renavam, chassis, engine, model flat, brandId, categoryId, flags isPublished/isB2b/isB2c)
- `src/features/cars/data/car.schema.ts` — schema Zod atualizado

**Mudanças de modelo:**
- Antes: `car_model: { brand, name }` → Agora: `model: string` + `brandId` (select de marca separado)
- Antes: `purchase_price`, `sale_price` → Agora: `price`, `oldPrice`
- Novos campos: `renavam`, `chassis`, `engine`, `isPublished`, `isB2bVisible`, `isB2cVisible`
- Status: novo enum `AWAITING_RELEASE|IN_TRANSIT|IN_YARD|SOLD|RESERVED|IN_PREPARATION`

**Critério de aceite:**
- [ ] Listagem de veículos vem da API com paginação
- [ ] Criar veículo com todos os campos obrigatórios funciona
- [ ] Editar veículo carrega dados e persiste alterações
- [ ] Selects de Brand e Category buscam da API (depende de 2.1 e 2.2)
- [ ] Badges de status usam o novo mapa de labels/cores

---

#### 2.7 — Financial Transactions: feature nova

**Arquivos a criar:**
- `src/features/financial/hooks/queries.ts`
- `src/features/financial/hooks/useFinancialTransactions.ts`
- `src/features/financial/hooks/useFinancialMutations.ts`
- `src/features/financial/pages/FinancialPage.tsx`
- `src/features/financial/components/FinancialTable.tsx`
- `src/features/financial/components/FinancialForm.tsx`
- `src/features/financial/data/financial.schema.ts`

**Arquivos a modificar:**
- `src/router/index.tsx` — adicionar rota `/financial`
- `src/components/layout/Sidebar.tsx` — adicionar link

**Escopo:**
- Página de listagem com filtros (tipo, status)
- Formulário de criação/edição
- Substituir a aba "Custos do Carro" por link para transações filtradas por `vehicleId`

**Critério de aceite:**
- [ ] CRUD completo de transações financeiras
- [ ] Filtros por tipo (pagar/receber) e status
- [ ] Paginação funcional
- [ ] Rota registrada e link no sidebar

---

### Fase 3 — Bloqueios de backend (documentar, não implementar)

Estas features **não podem** ser integradas até o backend entregar os endpoints. Manter páginas com banner informativo.

| Feature | Endpoint necessário | Página mockada |
|---------|-------------------|----------------|
| **Providers** | `CRUD /providers` (controller não existe) | `/providers` |
| **Sales** | Módulo `sales` inteiro | `/sales` |
| **Workflow / Tasks** | Módulos `workflow`, `tasks`, `teams` | `/my-tasks` |
| **Upload de imagens** | Entidade `VehicleImage` + upload | Galeria no detalhe do veículo |
| **Endpoint "me" + roles** | `GET /auth/me` ou buscar Employee por userId | Nome/cargo no sidebar/header |
| **Portal do cliente** | Endpoints de portal | Não existe ainda |

**Ação imediata:** Adicionar banner `🚧 Em desenvolvimento — aguardando API` nas páginas de Providers, Sales e MyTasks para não confundir usuários durante desenvolvimento.

---

## Ordem recomendada de execução

```
✅ src/lib/labels.ts (00.5)                    ← concluído (+ AppStatusBadge)
✅ Refresh automático no api.ts (00.2)         ← concluído (single-flight + anti-loop)
✅ Remover src/core/ (task 01)                 ← concluído
✅ Optionals → API real (02.3)                 ← concluído (junto com task 01)

Próximos:
1. LoginPage funcional (01.1)                  ← refresh já pronto, hora de logar de verdade
2. Guard de rota (01.2)                        ← depende de 1
3. Brands hooks (02.1)                         ← sem dependência
4. Categories hooks (02.2)                     ← sem dependência
5. Vehicles → API real (02.6)                  ← depende de 3, 4 (+ AppStatusBadge ✅)
6. Customers → API real (02.4)                 ← sem dependência
7. Employees → API real (02.5)                 ← depende de decisão UX
8. Financial feature nova (02.7)               ← AppStatusBadge ✅ pronto
9. Banners nas páginas bloqueadas (Fase 3)     ← sem dependência
```

**Paralelizável:** Itens 3, 4, 6, 9 podem ser feitos em paralelo.

---

## Referências

- [tasks/00-CONTEXT.md](00-CONTEXT.md) — Documento mestre de contexto
- [tasks/01-remove-core.md](01-remove-core.md) — Task detalhada de remoção do `src/core/`
- [CLAUDE.md](../CLAUDE.md) — Regras de arquitetura e geração de código
