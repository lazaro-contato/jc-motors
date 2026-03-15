import { CheckCircle2, Clock, Loader2, Users } from "lucide-react"

import { Card, CardContent } from "@/components/ui/card"

const METRICS = [
  { label: "Clientes Ativos", value: "127", icon: <Users className="size-4" />, delta: "+4 este mês" },
  { label: "Vendas Concluídas", value: "4", icon: <CheckCircle2 className="size-4" />, delta: "1 cancelada no mês" },
  { label: "Workflows Abertos", value: "9", icon: <Loader2 className="size-4" />, delta: "5 veículos · 4 vendas" },
  { label: "Tempo Médio Prep.", value: "4 d", icon: <Clock className="size-4" />, delta: "-1 dia vs. mês ant." },
]

export function SecondaryMetrics() {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:gap-4 xl:grid-cols-4">
      {METRICS.map((m) => (
        <Card key={m.label}>
          <CardContent className="flex items-center gap-3 pb-4 pt-4">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-accent text-muted-foreground">
              {m.icon}
            </div>
            <div className="min-w-0">
              <p className="truncate text-xs text-muted-foreground">{m.label}</p>
              <p className="text-lg font-bold text-foreground">{m.value}</p>
              <p className="truncate text-[11px] text-muted-foreground">{m.delta}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
