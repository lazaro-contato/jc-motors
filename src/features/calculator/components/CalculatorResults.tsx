import {
  Banknote,
  Gauge,
  Percent,
  Target,
  TrendingUp,
} from "lucide-react"

import { AppStatusBadge } from "@/components/shared/AppStatusBadge"
import { StatCard } from "@/components/shared/StatCard"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import {
  decisaoLabels,
  decisaoVariants,
  riscoCompraLabels,
  riscoCompraVariants,
  statusKmLabels,
  statusKmVariants,
  type LabelVariant,
} from "@/lib/labels"
import { cn } from "@/lib/utils"
import type { CalculatorResult, Decisao } from "@/types/calculator"
import { formatCurrency, formatMileage, formatPercent } from "@/utils/formatters"

/* ── Banner da decisão ───────────────────────────────────────────────────── */

const BANNER_CLASSES = {
  default: "border-border bg-muted",
  success: "border-success/30 bg-success-bg",
  warning: "border-warning/30 bg-warning-bg",
  danger: "border-danger/30 bg-danger-bg",
  info: "border-info/30 bg-info-bg",
} satisfies Record<LabelVariant, string>

const BANNER_TEXT = {
  default: "text-muted-foreground",
  success: "text-success",
  warning: "text-warning",
  danger: "text-danger",
  info: "text-info",
} satisfies Record<LabelVariant, string>

const DECISAO_DESCRIPTIONS = {
  COMPRAR: "O EBITDA atinge a meta. Negócio aprovado.",
  NEGOCIAR: "O EBITDA está abaixo da meta, mas ainda dentro da faixa negociável.",
  SEM_MARGEM: "O EBITDA está abaixo do mínimo aceitável para negociar.",
  FORA_SHOWROOM: "Quilometragem acima do limite — não pode ir para o showroom.",
  NAO_COMPRAR: "Risco de compra alto. Não avançar com este veículo.",
} satisfies Record<Decisao, string>

/* ── Linha do detalhamento ───────────────────────────────────────────────── */

interface BreakdownRowProps {
  label: string
  value: string
  hint?: string
  emphasis?: boolean
}

function BreakdownRow({ label, value, hint, emphasis }: BreakdownRowProps) {
  return (
    <div className="flex items-baseline justify-between gap-4 py-2.5">
      <div className="min-w-0">
        <p
          className={cn(
            "text-sm",
            emphasis ? "font-semibold text-foreground" : "text-muted-foreground",
          )}
        >
          {label}
        </p>
        {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
      </div>
      <p
        className={cn(
          "shrink-0 tabular-nums",
          emphasis
            ? "text-base font-bold text-foreground"
            : "text-sm font-medium text-foreground",
        )}
      >
        {value}
      </p>
    </div>
  )
}

/* ── Componente ──────────────────────────────────────────────────────────── */

interface CalculatorResultsProps {
  result: CalculatorResult
}

export function CalculatorResults({ result }: CalculatorResultsProps) {
  const decisaoVariant = decisaoVariants[result.decisao]

  const currencyOrDash = (value: number | null) =>
    value === null ? "—" : formatCurrency(value)

  const diferenca = result.diferencaNegociar

  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="text-base">Resultado</CardTitle>
        <CardDescription>
          Calculado ao vivo conforme os dados e as configurações
        </CardDescription>
      </CardHeader>
      <Separator />

      <CardContent className="space-y-6 pt-6">
        {/* Decisão */}
        <div
          className={cn(
            "rounded-lg border p-5",
            BANNER_CLASSES[decisaoVariant],
          )}
        >
          <p className="text-xs font-medium text-muted-foreground">Decisão</p>
          <p
            className={cn(
              "mt-1 text-2xl font-bold tracking-tight",
              BANNER_TEXT[decisaoVariant],
            )}
          >
            {decisaoLabels[result.decisao]}
          </p>
          <p className="mt-1.5 text-sm text-muted-foreground">
            {DECISAO_DESCRIPTIONS[result.decisao]}
          </p>
        </div>

        {/* Classificações */}
        <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">
              Risco de Compra
            </span>
            <AppStatusBadge
              label={riscoCompraLabels[result.riscoCompra]}
              variant={riscoCompraVariants[result.riscoCompra]}
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">Status KM</span>
            <AppStatusBadge
              label={statusKmLabels[result.statusKm]}
              variant={statusKmVariants[result.statusKm]}
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">KM Máximo</span>
            <span className="text-sm font-semibold tabular-nums text-foreground">
              {formatMileage(result.kmMax)}
            </span>
          </div>
        </div>

        {/* KPIs */}
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            label="EBITDA"
            value={formatPercent(result.ebitda)}
            icon={<Percent className="size-5" />}
            intent={decisaoVariant === "success" ? "success" : "brand"}
          />
          <StatCard
            label="ROI"
            value={formatPercent(result.roi)}
            icon={<TrendingUp className="size-5" />}
            intent="info"
          />
          <StatCard
            label="Proposta Máxima"
            value={currencyOrDash(result.propostaMaxima)}
            icon={<Target className="size-5" />}
            intent="brand"
          />
          <StatCard
            label="Diferença a Negociar"
            value={currencyOrDash(diferenca)}
            icon={<Banknote className="size-5" />}
            intent={
              diferenca !== null && diferenca > 0 ? "warning" : "success"
            }
          />
        </div>

        {/* Detalhamento */}
        <div>
          <h3 className="mb-1 flex items-center gap-2 text-sm font-semibold text-foreground">
            <Gauge className="size-4 text-muted-foreground" />
            Detalhamento
          </h3>
          <div className="divide-y divide-border">
            <BreakdownRow
              label="Custos Operacionais"
              value={formatCurrency(result.custosOperacionais)}
            />
            <BreakdownRow
              label="Margem"
              hint="Venda − Compra"
              value={formatCurrency(result.margem)}
            />
            <BreakdownRow
              label="Imposto"
              hint="Margem × alíquota"
              value={formatCurrency(result.imposto)}
            />
            <BreakdownRow
              label="Custo Total"
              hint="Compra + custos + imposto"
              value={formatCurrency(result.custoTotal)}
            />
            <BreakdownRow
              label="Ponto de Equilíbrio"
              hint="Compra máxima que ainda entrega a meta"
              value={currencyOrDash(result.pontoEquilibrio)}
            />
            <BreakdownRow
              label="Equação Final"
              hint="Margem − imposto − custos"
              value={formatCurrency(result.equacaoFinal)}
              emphasis
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
