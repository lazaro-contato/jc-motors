# Plano de Adaptação Responsiva — JC Motors Web

> **Autor:** Engenharia de Software
> **Data:** 2026-03-14
> **Escopo:** Tornar toda a aplicação visualizável e operável em dispositivos mobile (320px–768px), tablets (768px–1024px) e desktop (1024px+).
> **Estratégia:** Mobile-first — ajustar componentes de dentro para fora, do layout raiz aos sub-componentes de feature.

---

## Índice

1. [Diagnóstico Atual](#1-diagnóstico-atual)
2. [Breakpoints e Convenções](#2-breakpoints-e-convenções)
3. [Fase 1 — Layout Raiz (AppLayout, Sidebar, Header)](#3-fase-1--layout-raiz)
4. [Fase 2 — Componentes Shared](#4-fase-2--componentes-shared)
5. [Fase 3 — Páginas e Sub-componentes de Feature](#5-fase-3--páginas-e-sub-componentes-de-feature)
6. [Fase 4 — Login Page](#6-fase-4--login-page)
7. [Checklist de Validação](#7-checklist-de-validação)
8. [Ordem de Execução](#8-ordem-de-execução)

---

## 1. Diagnóstico Atual

### Problemas identificados por camada

#### Layout (`AppLayout.tsx`, `Sidebar.tsx`, `Header.tsx`)

| Problema | Arquivo | Impacto |
|---|---|---|
| Sidebar fixa em `w-64` / `w-[72px]` sem breakpoint mobile | `Sidebar.tsx:110` | Sidebar ocupa ~256px de telas < 768px — inutiliza o conteúdo |
| Não existe mecanismo de abrir/fechar sidebar em mobile (drawer/overlay) | `Sidebar.tsx` | Sidebar sempre visível — não há como escondê-la em telas pequenas |
| Header tem busca com `w-72` fixo | `Header.tsx:28` | Input de busca transborda em telas < 400px |
| `main` usa `p-6` fixo sem redução para mobile | `AppLayout.tsx:12` | Padding desperdiça espaço valioso em telas pequenas |
| Sem meta viewport explícito (verificar `index.html`) | `index.html` | Pode não escalar corretamente em dispositivos reais |

#### Componentes Shared

| Problema | Arquivo | Impacto |
|---|---|---|
| `AppDataTable` — header com busca `w-44` fixa, paginação com "Anterior"/"Próximo" texto | `AppDataTable.tsx:145,239` | Busca fixa não se adapta; botões de paginação transbordam em mobile |
| `AppDataTable` — células com `px-5` fixo | `AppDataTable.tsx:166,204` | Padding horizontal excessivo em telas pequenas |
| `AppPageHeader` — `flex items-start justify-between` sem wrap | `AppPageHeader.tsx:27` | Título e ação ficam na mesma linha — botão pode sair da viewport em telas estreitas |
| `StatCard` — `min-w-[160px]` forçado | `StatCard.tsx:60` | Pode causar scroll horizontal desnecessário em grids mobile |

#### Páginas

| Problema | Arquivo | Impacto |
|---|---|---|
| Dashboard KPIs: `grid-cols-2` fixo em mobile, quebra para `xl:grid-cols-4` | `DashboardPage.tsx:44` | OK parcialmente, mas `grid-cols-2` pode ser apertado em < 360px |
| Dashboard grid `xl:grid-cols-3` sem `lg` intermediário | `DashboardPage.tsx:83,91` | Salto brusco de 1 coluna para 3 colunas — sem estado intermediário |
| Tabelas de listagem (Cars, Customers, Providers) com 6-7 colunas | Múltiplos | Muitas colunas para telas < 768px — `overflow-x-auto` permite scroll, mas UX é pobre |
| Formulários com `sm:grid-cols-2` / `sm:grid-cols-3` — breakpoint muito baixo para esses grids | `CustomerForm.tsx:62,96,121` | Em 640px algumas colunas ficam muito estreitas |
| Botões de ação do formulário (`flex justify-end`) sem adaptação | `CustomerForm.tsx:143` | Em mobile os botões deveriam ocupar largura total ou ser empilhados |

---

## 2. Breakpoints e Convenções

### Breakpoints Tailwind padrão utilizados

| Token | Largura | Dispositivo |
|---|---|---|
| (sem prefixo) | 0px+ | Mobile portrait (iPhone SE, Galaxy S) |
| `sm:` | ≥ 640px | Mobile landscape / phablet |
| `md:` | ≥ 768px | Tablet portrait |
| `lg:` | ≥ 1024px | Tablet landscape / laptop |
| `xl:` | ≥ 1280px | Desktop |

### Convenções de implementação

1. **Mobile-first**: estilos base são para mobile, prefixos `sm:`, `md:`, `lg:`, `xl:` adicionam complexidade progressivamente.
2. **Sidebar como drawer em mobile**: em telas < `lg` (< 1024px), a sidebar vira um overlay/drawer controlado por botão hamburger no Header.
3. **Tabelas**: manter `overflow-x-auto` mas reduzir padding interno e ocultar colunas secundárias com `hidden md:table-cell`.
4. **Formulários**: stack vertical em mobile (`grid-cols-1`), grid em `md:` (≥ 768px).
5. **Padding e gaps**: reduzir de `p-6` / `gap-6` para `p-4` / `gap-4` em mobile.
6. **Textos**: `text-2xl` → `text-xl` em `h1` de mobile quando necessário.
7. **Touch targets**: botões e links interativos devem ter no mínimo `44px × 44px` de área de toque.

---

## 3. Fase 1 — Layout Raiz

### 3.1 `AppLayout.tsx`

**Objetivo:** Sidebar oculta em mobile, padding adaptativo no `main`.

```diff
- <div className="flex h-screen bg-background">
-   <Sidebar />
-   <div className="flex flex-1 flex-col overflow-hidden">
-     <Header />
-     <main className="flex-1 overflow-auto p-6">

+ <div className="flex h-screen bg-background">
+   <Sidebar />
+   <div className="flex flex-1 flex-col overflow-hidden">
+     <Header />
+     <main className="flex-1 overflow-auto p-4 md:p-6">
```

**Mudanças necessárias:**
- `main` padding: `p-4 md:p-6`
- Importar e gerenciar estado de visibilidade da sidebar (via Zustand store ou Context simples)
- Renderizar overlay/backdrop quando sidebar está aberta em mobile

### 3.2 `Sidebar.tsx` — Drawer mobile

**Objetivo:** Em telas < `lg`, sidebar vira drawer overlay. Em `lg+`, sidebar fica fixa como hoje.

**Mudanças necessárias:**

1. **Criar um store ou context para controlar visibilidade:**
   - `useSidebarStore` (Zustand) com `isOpen`, `toggle()`, `close()` — estado de UI client-side
   - Alternativa: prop `isOpen` + `onClose` controlados pelo `AppLayout`

2. **Wrapper com lógica de breakpoint:**
   - `lg+`: renderiza `<aside>` fixo (comportamento atual)
   - `< lg`: renderiza backdrop (`fixed inset-0 z-40 bg-black/50`) + aside com `fixed left-0 top-0 z-50 h-screen` e animação `translate-x` via Tailwind

3. **Classes da sidebar mobile:**
   ```tsx
   // Mobile drawer
   <div className={cn(
     "fixed inset-0 z-40 bg-black/50 transition-opacity lg:hidden",
     isOpen ? "opacity-100" : "pointer-events-none opacity-0",
   )} onClick={close} />

   <aside className={cn(
     // Mobile: drawer
     "fixed left-0 top-0 z-50 h-screen transition-transform duration-200 lg:relative lg:translate-x-0",
     isOpen ? "translate-x-0" : "-translate-x-full",
     // Desktop: comportamento atual
     collapsed ? "w-[72px]" : "w-64",
     "flex shrink-0 flex-col border-r border-sidebar-border bg-sidebar",
   )}>
   ```

4. **Remover botão de collapse em mobile:** Em telas < `lg`, o collapse não faz sentido — a sidebar sempre abre expandida e fecha completamente.

5. **Fechar sidebar ao navegar:** Adicionar `close()` no clique de cada `NavLink` quando viewport < `lg`.

6. **Fechar sidebar ao clicar fora:** O backdrop já trata isso.

### 3.3 `Header.tsx` — Hamburger e busca adaptativa

**Objetivo:** Adicionar botão hamburger em mobile, tornar busca responsiva.

**Mudanças necessárias:**

1. **Botão hamburger (visível apenas < `lg`):**
   ```tsx
   <button
     className="mr-2 flex size-9 items-center justify-center rounded-xl text-muted-foreground hover:text-foreground lg:hidden"
     onClick={toggleSidebar}
     aria-label="Abrir menu"
   >
     <Menu className="size-5" />
   </button>
   ```

2. **Campo de busca responsivo:**
   ```diff
   - <div className="relative w-72">
   + <div className="relative hidden w-72 sm:block">
   ```
   Em mobile (< `sm`), esconder a barra de busca e mostrar apenas um ícone `Search` que expande um input full-width ao clicar — ou manter oculto se a busca não for crítica no fluxo mobile.

   Alternativa simplificada: `w-40 sm:w-72` para reduzir a largura em mobile sem escondê-la.

3. **Padding adaptativo:**
   ```diff
   - <header className="... px-6">
   + <header className="... px-4 md:px-6">
   ```

---

## 4. Fase 2 — Componentes Shared

### 4.1 `AppPageHeader.tsx`

**Problema:** Em mobile, título e botão de ação na mesma linha transbordam.

**Solução:**
```diff
- onBack
-   ? "flex items-center gap-4"
-   : "flex items-start justify-between",
+ onBack
+   ? "flex items-center gap-3 md:gap-4"
+   : "flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between",
```

**Detalhes:**
- **Modo lista (sem `onBack`):** em mobile, empilhar título em cima e ação embaixo (`flex-col gap-3`); em `sm+`, volta ao layout lado a lado.
- **Modo detalhe (com `onBack`):** gap reduzido em mobile (`gap-3` vs `gap-4`), mas mantém na mesma linha (botão de voltar é pequeno).
- Título `h1`: `text-xl md:text-2xl` para economizar espaço em mobile.

### 4.2 `AppDataTable.tsx`

**Problema:** Header com busca, padding de células e paginação não se adaptam.

**Mudanças necessárias:**

#### Header do Card
```diff
- <CardHeader className="flex-row items-center justify-between space-y-0 border-b border-border py-3">
+ <CardHeader className="flex-col gap-3 border-b border-border py-3 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
```
Em mobile: título em cima, busca + ação embaixo (empilhados).

#### Busca
```diff
- <Input className="h-8 w-44 pl-8 text-xs" ... />
+ <Input className="h-8 w-full pl-8 text-xs sm:w-44" ... />
```

#### Células
```diff
- className="px-5 py-3.5"
+ className="px-3 py-2.5 md:px-5 md:py-3.5"
```
Reduzir padding em mobile para cabimento.

#### Paginação
```diff
- <div className="flex items-center justify-between border-t border-border px-5 py-3">
+ <div className="flex flex-col items-center gap-2 border-t border-border px-3 py-3 sm:flex-row sm:justify-between sm:px-5">
```

Botões de paginação: esconder texto "Anterior"/"Próximo" em mobile, manter apenas ícones:
```tsx
<span className="hidden sm:inline">Anterior</span>
// ...
<span className="hidden sm:inline">Próximo</span>
```

Números de página: em mobile (< `sm`), exibir apenas página atual com setas (sem lista de números).

#### Cabeçalhos da tabela
```diff
- className="px-5 py-3 text-xs ..."
+ className="px-3 py-2.5 text-xs md:px-5 md:py-3 ..."
```

### 4.3 `StatCard.tsx`

**Problema:** `min-w-[160px]` pode causar scroll horizontal.

**Solução:**
```diff
- <Card className={cn("flex-1 min-w-[160px]", className)}>
+ <Card className={cn("flex-1 min-w-0", className)}>
```

Remover `min-w-[160px]` — o card deve encolher livremente dentro do grid. O grid pai controla o número de colunas.

Valor principal: `text-xl md:text-2xl` para caber em cards mais estreitos.

### 4.4 `AppTable.tsx`

**Mudanças:**
- Padding de células: `px-3 py-2 md:px-4 md:py-3`
- Cabeçalhos: `px-3 py-2 md:px-4 md:py-3`
- O `overflow-x-auto` já está presente — OK.

### 4.5 Componentes de formulário (`AppInput`, `AppTextarea`, `AppSelect`, etc.)

**Status:** Já responsivos. Ocupam `w-full` por padrão e se adaptam ao container pai. Nenhuma alteração necessária.

---

## 5. Fase 3 — Páginas e Sub-componentes de Feature

### 5.1 `DashboardPage.tsx`

#### KPI grid
```diff
- <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
+ <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:gap-4 xl:grid-cols-4">
```
Em telas muito estreitas (< `sm`), empilhar KPIs em coluna única.

#### Sales + Tasks grid
```diff
- <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
+ <div className="grid grid-cols-1 gap-4 md:gap-6 lg:grid-cols-2 xl:grid-cols-3">
```
Adicionar breakpoint `lg` intermediário (2 colunas) antes de `xl` (3 colunas).

#### Inventory + TopSellers grid
```diff
- <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
+ <div className="grid grid-cols-1 gap-4 md:gap-6 lg:grid-cols-2 xl:grid-cols-3">
```

#### Greeting header
```diff
- <div className="flex items-start justify-between">
+ <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
```
Empilhar em mobile; lado a lado em `sm+`.

#### Gap entre seções
```diff
- <div className="space-y-6">
+ <div className="space-y-4 md:space-y-6">
```

### 5.2 `SecondaryMetrics.tsx`

```diff
- <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
+ <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:gap-4 xl:grid-cols-4">
```

### 5.3 `RecentSalesTable.tsx`

A tabela tem 6 colunas (Veículo, Cliente, Vendedor, Valor, Status, Ações). Em mobile isso é excessivo.

**Solução:** Ocultar colunas secundárias com classes CSS nas definições de coluna. Isso requer que o `AppDataTable` suporte uma prop `className` nas colunas para `<th>` e `<td>`.

**Colunas ocultas em mobile:**
- `employee` (Vendedor): `hidden md:table-cell`
- `status` (Status): `hidden sm:table-cell`
- `_actions` (Ações): `hidden sm:table-cell`

Isso é feito via `className` nas definições de `AppDataTableColumn`:
```ts
{ key: "employee", header: "Vendedor", className: "hidden md:table-cell" }
```

**Importante:** Para que funcione, o `AppDataTable` precisa aplicar `col.className` também no `<th>`, não apenas no `<td>`. Verificar implementação atual:
- `<th>`: NÃO aplica `col.className` atualmente → **precisa ser corrigido**
- `<td>`: aplica `col.className` → OK

**Fix no `AppDataTable.tsx`:**
```diff
  <th
    key={col.key}
    className={cn(
      "px-3 py-2.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground md:px-5 md:py-3",
      col.align ? alignClass[col.align] : "text-left",
+     col.className,
    )}
  >
```

### 5.4 `CarsPage.tsx` — Colunas da tabela de veículos

Colunas ocultas em mobile:
- `plate` (Placa): `hidden sm:table-cell`
- `year` (Ano): `hidden md:table-cell`
- `fuel` (Combustível): `hidden lg:table-cell`
- `_actions` (Ações): mantém visível mas reduzir para 1-2 ícones em mobile

### 5.5 `CustomersPage.tsx` — Colunas da tabela de clientes

Colunas ocultas em mobile:
- `person_type` (Tipo): `hidden sm:table-cell`
- `document` (Documento): `hidden md:table-cell`
- `phone` (Telefone): `hidden lg:table-cell`

### 5.6 `ProvidersPage.tsx` — Colunas da tabela de fornecedores

Colunas ocultas em mobile:
- `phone` (Telefone): `hidden md:table-cell`
- `city` (Localidade): `hidden lg:table-cell`

### 5.7 Formulários (`CustomerForm.tsx`, `ProviderForm.tsx`)

Os formulários já usam `sm:grid-cols-2` e `sm:grid-cols-3` mas `sm` (640px) pode ser cedo demais para 2 colunas.

**Ajuste:**
```diff
- <CardContent className="grid gap-5 pt-6 sm:grid-cols-2">
+ <CardContent className="grid gap-4 pt-5 md:grid-cols-2 md:gap-5 md:pt-6">
```

```diff
- <CardContent className="grid gap-5 pt-6 sm:grid-cols-3">
+ <CardContent className="grid gap-4 pt-5 md:grid-cols-3 md:gap-5 md:pt-6">
```

**Botões de ação do formulário:**
```diff
- <div className="flex justify-end gap-3">
+ <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
```
Em mobile: botões empilhados com full-width, "Cancelar" abaixo de "Salvar" (por causa de `flex-col-reverse`).
Em `sm+`: layout lado a lado alinhado à direita (comportamento atual).

**Botões full-width em mobile:**
```tsx
<Button type="button" variant="outline" onClick={onCancel} className="w-full sm:w-auto">
  Cancelar
</Button>
<AppButton type="submit" isLoading={isSubmitting} className="w-full sm:w-auto">
  Salvar Cliente
</AppButton>
```

### 5.8 `InventoryCard.tsx`

Grid de legenda: OK em 2 colunas. Manter.

### 5.9 `TopSellersCard.tsx`

```diff
- <Card className="xl:col-span-2">
+ <Card className="lg:col-span-1 xl:col-span-2">
```
Ajustar colspan de acordo com o novo grid intermediário `lg:grid-cols-2`.

### 5.10 `TaskList.tsx`

Layout interno já é flex com `items-start gap-3`. Funciona em mobile. Apenas reduzir padding:
```diff
- "flex items-start gap-3 px-5 py-3.5 ..."
+ "flex items-start gap-3 px-3 py-3 md:px-5 md:py-3.5 ..."
```

---

## 6. Fase 4 — Login Page

A `LoginPage` atual é um placeholder mínimo. Quando for implementada, seguir:

- Container: `px-4 sm:px-0`
- `max-w-sm` já garante centralização em desktop
- Logo/marca: `text-xl md:text-2xl`
- Botão de submit: `w-full` (já é padrão em formulários de login)
- Garantir que o `min-h-screen` funcione corretamente com viewport mobile (considerar `min-h-dvh` para Safari iOS)

```diff
- <div className="flex min-h-screen items-center justify-center">
-   <div className="w-full max-w-sm">
+ <div className="flex min-h-dvh items-center justify-center px-4">
+   <div className="w-full max-w-sm">
```

---

## 7. Checklist de Validação

Após cada fase, validar nos seguintes viewports:

### Viewports obrigatórios

| Dispositivo | Largura | Onde testar |
|---|---|---|
| iPhone SE | 375px | Chrome DevTools |
| iPhone 14 Pro | 393px | Chrome DevTools |
| Samsung Galaxy S21 | 360px | Chrome DevTools |
| iPad Mini | 768px | Chrome DevTools |
| iPad Air | 820px | Chrome DevTools |
| Laptop | 1280px | Janela do browser |
| Desktop Full HD | 1920px | Janela do browser |

### Checklist por viewport

- [ ] **Sidebar:** mobile → drawer com backdrop; tablet landscape + desktop → fixa
- [ ] **Header:** hamburger visível em mobile; busca adaptativa
- [ ] **Dashboard KPIs:** 1 coluna em < 640px, 2 em sm, 4 em xl
- [ ] **Tabelas de listagem:** scroll horizontal funcional; colunas secundárias ocultas em mobile
- [ ] **Formulários:** campos empilhados em mobile; botões full-width em mobile
- [ ] **Paginação:** ícones-only em mobile; texto + ícones em sm+
- [ ] **Page headers:** título e ação empilhados em mobile
- [ ] **Cards:** sem scroll horizontal forçado em nenhum viewport
- [ ] **Touch targets:** todos os botões/links ≥ 44px de área de toque
- [ ] **Texto:** nenhum texto cortado ou transbordando sem `truncate`

---

## 8. Ordem de Execução

As fases devem ser executadas na ordem listada — cada fase depende da anterior.

### Fase 1 — Layout raiz (maior impacto, precisa ser feita primeiro)
1. Criar `useSidebarStore` em `src/store/sidebar.store.ts`
2. Refatorar `Sidebar.tsx` para drawer mobile + sidebar fixa desktop
3. Refatorar `Header.tsx` para hamburger + busca responsiva
4. Ajustar `AppLayout.tsx` para padding responsivo

### Fase 2 — Componentes shared (afeta todas as páginas de uma vez)
5. Ajustar `AppPageHeader.tsx` (stack em mobile)
6. Ajustar `AppDataTable.tsx` (header, cells, pagination, `col.className` no `<th>`)
7. Ajustar `StatCard.tsx` (remover `min-w`, font-size adaptativo)
8. Ajustar `AppTable.tsx` (padding adaptativo)

### Fase 3 — Páginas e sub-componentes
9. `DashboardPage.tsx` — grids e greeting responsivos
10. `SecondaryMetrics.tsx` — grid responsivo
11. Definições de colunas: `CarsPage`, `CustomersTable`, `ProvidersTable`, `RecentSalesTable` — `hidden` classes
12. `CustomerForm.tsx` — breakpoints de grid e botões
13. `ProviderForm.tsx` — breakpoints de grid e botões
14. `TaskList.tsx` — padding adaptativo
15. `TopSellersCard.tsx` — colspan ajustado

### Fase 4 — Login
16. `LoginPage.tsx` — `min-h-dvh` + padding lateral

---

## Notas Técnicas

### Não instalar bibliotecas extras
Toda a responsividade é implementável com Tailwind CSS v4 nativo. Não é necessário instalar bibliotecas como `react-responsive`, `useMediaQuery` ou `react-device-detect`.

### Sidebar drawer — sem `useMediaQuery`
A detecção de viewport para a sidebar é feita puramente via CSS (`lg:hidden`, `hidden lg:block`). O store de sidebar controla apenas o estado de aberto/fechado — não o tipo de layout (drawer vs. fixed). O CSS decide qual renderizar baseado no breakpoint.

### Performance
Nenhuma dessas mudanças afeta bundle size ou performance de renderização. São apenas alterações de classes Tailwind CSS (processadas em build time) e um pequeno store Zustand para a sidebar.

### Testes manuais
Usar Chrome DevTools → Device Toolbar → "Responsive" e arrastar a largura de 320px a 1920px para verificar transições suaves entre breakpoints. Garantir que nenhum elemento "pula" bruscamente ao cruzar um breakpoint.
