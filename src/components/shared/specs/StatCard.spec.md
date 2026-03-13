# StatCard

**Arquivo:** `src/components/shared/StatCard.tsx`
**Tipo:** Componente shared
**Prefixo:** nenhum (exceção justificada — nome semântico do domínio)

---

## Propósito

Card de KPI (Key Performance Indicator) para dashboards. Exibe um rótulo, valor principal, ícone colorido e indicador de tendência (alta/baixa) com ícone direcional. Usado em fileiras de métricas no topo de páginas analíticas.

---

## Props

| Prop | Tipo | Padrão | Descrição |
|---|---|---|---|
| `label` | `string` | **obrigatório** | Rótulo da métrica (ex.: "Faturamento") |
| `value` | `string` | **obrigatório** | Valor principal formatado (ex.: "R$ 350,4K") |
| `icon` | `ReactNode` | **obrigatório** | Ícone exibido no círculo colorido à direita |
| `intent` | `"brand" \| "success" \| "warning" \| "danger" \| "info"` | `"brand"` | Cor do círculo de ícone |
| `trend` | `string` | — | Texto da tendência (ex.: "+2,45% este mês") |
| `trendDirection` | `"up" \| "down"` | `"up"` | Define cor e ícone da tendência |
| `className` | `string` | — | Classes extras no `Card` |

---

## Variantes de intent (ícone)

| Intent | Light | Dark |
|---|---|---|
| `brand` | `bg-brand-100 text-brand-500` | `bg-brand-500/15 text-brand-300` |
| `success` | `bg-success-bg text-success` | — (token adaptativo) |
| `warning` | `bg-warning-bg text-warning` | — (token adaptativo) |
| `danger` | `bg-danger-bg text-danger` | — (token adaptativo) |
| `info` | `bg-info-bg text-info` | — (token adaptativo) |

---

## Comportamento

### Tendência
- `trendDirection="up"`: texto em `text-success` + ícone `TrendingUp`.
- `trendDirection="down"`: texto em `text-danger` + ícone `TrendingDown`.
- `trend` ausente: a seção de tendência não é renderizada.

### Layout
- Ícone: círculo de `size-11` (`44px`) com `rounded-full`, fixo à direita do conteúdo.
- Valor: `text-2xl font-bold tracking-tight`.
- Rótulo: `text-xs font-medium text-muted-foreground` com `truncate` para labels longas.
- Card: `flex-1 min-w-[160px]` — cresce igualmente em layouts `flex`.

---

## Dependências

| Dependência | Uso |
|---|---|
| `@/components/ui/card` | `Card`, `CardContent` (shadcn) |
| `lucide-react` (`TrendingUp`, `TrendingDown`) | Ícones de tendência |
| `@/lib/utils` (`cn`) | Composição de classes Tailwind |

---

## Exemplos de uso

```tsx
// Básico com intent brand
<StatCard
  label="Faturamento"
  value="R$ 350,4K"
  icon={<BarChart2 className="size-5" />}
/>

// Com tendência de alta
<StatCard
  label="Veículos Vendidos"
  value="24"
  icon={<Car className="size-5" />}
  intent="success"
  trend="+12% este mês"
  trendDirection="up"
/>

// Com tendência de baixa
<StatCard
  label="Estoque"
  value="8"
  icon={<Package className="size-5" />}
  intent="warning"
  trend="-3 unidades"
  trendDirection="down"
/>

// Fileira de KPIs (layout recomendado)
<div className="flex gap-4 flex-wrap">
  <StatCard label="Receita" value="R$ 1,2M" icon={<DollarSign />} intent="brand" trend="+5%" />
  <StatCard label="Clientes" value="142" icon={<Users />} intent="info" />
  <StatCard label="Pendências" value="3" icon={<AlertCircle />} intent="warning" trend="-2" trendDirection="down" />
</div>
```

---

## Onde é usado

- `DashboardPage` — fileira de KPIs no topo da página
- Qualquer página analítica que exiba métricas resumidas
