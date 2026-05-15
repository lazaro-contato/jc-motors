# 01 — Remover `src/core/` e migrar features para o padrão feature-based

- **Fase**: 0 (fundamentos)
- **Depende de**: tipos em [src/types/](../src/types/) e services em [src/features/*/services/](../src/features/) (já criados na conversa anterior).
- **Status**: pending
- **Bloqueio**: —

## Contexto

`src/core/` foi escrito assumindo o backend Django antigo (snake_case, rotas `/auth/signin`, `Pagination` no formato DRF com `count/next/previous/results`, schemas Zod com mensagens próprias). O backend atual é NestJS (camelCase, rotas `/auth/sign-in`, `Pagination = { data, total, page, limit }`) e a arquitetura oficial é **feature-based** (ver [CLAUDE.md §3](../CLAUDE.md) e [tasks/00-CONTEXT.md §5](00-CONTEXT.md)).

Hoje ainda existem **20 imports vivos** de `@/core/` espalhados em `features/optionals/` e `features/cars/`. Esta task substitui esses imports e remove `src/core/` por completo.

## Escopo

### 1. `features/optionals/` — substituir tipos e service

Arquivos a tocar:

- [src/features/optionals/hooks/useOptionalMutations.ts](../src/features/optionals/hooks/useOptionalMutations.ts)
- [src/features/optionals/hooks/usePresetMutations.ts](../src/features/optionals/hooks/usePresetMutations.ts)
- [src/features/optionals/hooks/useOptionals.ts](../src/features/optionals/hooks/useOptionals.ts)
- [src/features/optionals/hooks/usePresets.ts](../src/features/optionals/hooks/usePresets.ts)
- [src/features/optionals/hooks/queries.ts](../src/features/optionals/hooks/queries.ts)
- [src/features/optionals/components/OptionalsTable.tsx](../src/features/optionals/components/OptionalsTable.tsx)
- [src/features/optionals/components/OptionalFormDialog.tsx](../src/features/optionals/components/OptionalFormDialog.tsx)
- [src/features/optionals/components/PresetFormDialog.tsx](../src/features/optionals/components/PresetFormDialog.tsx)
- [src/features/optionals/components/PresetsCard.tsx](../src/features/optionals/components/PresetsCard.tsx)
- [src/features/optionals/pages/OptionalsPage.tsx](../src/features/optionals/pages/OptionalsPage.tsx)

Trocas de import:
- `@/core/models/vehicle-optional` → `@/types/optionals` (`VehicleOptional`)
- `@/core/models/vehicle-optional-preset` → `@/types/optionals` (`VehicleOptionalProfile`)
- `@/core/models/pagination` → `@/types/pagination`
- `@/core/dto/create-vehicle-optional.dto` → `@/types/optionals` (`CreateOptionalDTO`)
- `@/core/dto/update-vehicle-optional-dto` → `@/types/optionals` (`UpdateOptionalDTO`)
- `@/core/dto/create-vehicle-optional-preset.dto` → `@/types/optionals` (`CreateOptionalProfileDTO`)
- `@/core/dto/update-vehicle-optional-preset.dto` → `@/types/optionals` (`UpdateOptionalProfileDTO`)

Trocas de comportamento:
- `VehicleOptionalRepository` → `optionalsService` ([src/features/optionals/services/optionals.service.ts](../src/features/optionals/services/optionals.service.ts)).
- `optionalsStore` (mock em memória) → `optionalsService` real.
- Para presets: passar a usar `optionalProfilesService` ([src/features/optionals/services/optional-profiles.service.ts](../src/features/optionals/services/optional-profiles.service.ts)).

Mudanças de shape que cascatam nos componentes:
- `id: number` → `id: string` (UUID).
- `created_at: Date` / `updated_at: Date` → `createdAt: string` / `updatedAt: string` (ISO).
- `preset` (objeto aninhado) → não existe na API atual; opcional pertence a um profile via M:N. Decidir UI: hoje a tela mostra "preset do opcional"; backend modela como "profile contém vários optionals". Pode ser preciso inverter o sentido da relação na UI.
- `Pagination<T>`: `results` → `data`, `count` → `total`, `next/previous` deixam de existir.

Decisão de naming a tomar nesta task:
- Backend chama de `VehicleOptionalProfile`; código atual chama de `Preset`. Recomendado **renomear "Preset" para "Profile"** em toda a feature (`PresetFormDialog` → `ProfileFormDialog`, `usePresetMutations` → `useOptionalProfileMutations`, etc.) para alinhar com o backend e evitar tradução mental. A label PT-BR ("Preset" / "Conjunto") fica só na UI.

Schemas Zod:
- Os antigos DTOs em `core/dto/` eram **schemas Zod** com mensagens. Os novos tipos em `@/types/optionals` são apenas type aliases. Se os formulários em [OptionalFormDialog.tsx](../src/features/optionals/components/OptionalFormDialog.tsx) e [PresetFormDialog.tsx](../src/features/optionals/components/PresetFormDialog.tsx) usavam `zodResolver(schema)`, recriar os schemas dentro de `src/features/optionals/data/optional.schema.ts` (padrão CLAUDE.md §4.3).

Apagar:
- [src/features/optionals/data/optionals-store.ts](../src/features/optionals/data/optionals-store.ts) — mock store em memória, sem uso após migração.

### 2. `features/cars/` — remover hooks/componentes que usam Repository

Arquivos a tocar:

- [src/features/cars/hooks/useCreateOptional.ts](../src/features/cars/hooks/useCreateOptional.ts) — substituir `VehicleOptionalRepository` por `optionalsService.create`.
- [src/features/cars/hooks/useUpdateOptional.ts](../src/features/cars/hooks/useUpdateOptional.ts) — idem `update`.
- [src/features/cars/hooks/useGetOptionals.ts](../src/features/cars/hooks/useGetOptionals.ts) — só tem um import comentado de `@/core/repositories/...`; trocar pelo service ou remover comentário e implementar com `optionalsService.list`.
- [src/features/cars/components/optionals/optionals-data.ts](../src/features/cars/components/optionals/optionals-data.ts) — mock data; trocar tipos para `@/types/optionals` e `@/types/pagination` ou apagar se não estiver mais sendo usado.

Observação: existe duplicação entre os hooks de optionals em `features/optionals/hooks/` e `features/cars/hooks/`. Avaliar consolidar tudo em `features/optionals/hooks/` e importar de lá no formulário de carro (sub-task se virar grande).

### 3. Apagar `src/core/`

Após os passos 1 e 2 não há mais imports vivos:

```
rm -rf src/core/
```

Conferir antes:
```
grep -r "@/core/" src/
```
deve retornar vazio.

## Critério de aceite

- [ ] `grep -r "@/core/" src/` retorna **0 resultados**.
- [ ] `src/core/` não existe mais no repositório.
- [ ] `npm run typecheck` passa sem erros.
- [ ] `npm run lint` passa sem erros novos.
- [ ] Página `/optionals` carrega sem erros de runtime (mesmo que ainda mostre erro de rede se o backend não estiver no ar — só não pode quebrar com `Cannot read property 'X' of undefined`).
- [ ] Formulários de criar/editar opcional e profile funcionam contra o backend NestJS local (`POST /optionals`, `POST /optionals/profiles`).
- [ ] Decisão de naming "Preset → Profile" aplicada (ou explicitamente registrada que se decidiu manter "Preset" como label de UI).

## Fora de escopo

- Refatorar a tela de optionals para refletir a relação M:N real (profile → optionals) — isso é uma task de UX separada se a UI atual estava modelando errado.
- Remover `src/core/lib/local-storage.ts` se nada mais usar fora de `core/` — confirmar com `grep`.
- Wiring das outras features (customers, employees, vehicles) — task própria.

## Referências
- [tasks/00-CONTEXT.md §4.3](00-CONTEXT.md) — discrepâncias de shape backend ↔ frontend.
- [src/features/optionals/services/optionals.service.ts](../src/features/optionals/services/optionals.service.ts)
- [src/features/optionals/services/optional-profiles.service.ts](../src/features/optionals/services/optional-profiles.service.ts)
- [src/types/optionals.ts](../src/types/optionals.ts) · [src/types/pagination.ts](../src/types/pagination.ts)
