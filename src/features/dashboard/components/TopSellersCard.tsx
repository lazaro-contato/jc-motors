import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TOP_SELLERS } from "../data/dashboard.mock"

export function TopSellersCard() {
  return (
    <Card className="xl:col-span-2">
      <CardHeader className="flex-row items-center justify-between space-y-0 border-b border-border pb-3">
        <CardTitle className="text-base font-semibold">Desempenho por Vendedor</CardTitle>
        <span className="text-xs text-muted-foreground">Março 2026</span>
      </CardHeader>
      <CardContent className="pt-5">
        <div className="space-y-4">
          {TOP_SELLERS.map((seller, i) => (
            <div key={seller.name} className="flex items-center gap-4">
              <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-brand-500/10 text-xs font-bold text-brand-600 dark:text-brand-300">
                {i + 1}
              </div>
              <div className="min-w-0 flex-1">
                <div className="mb-1.5 flex items-center justify-between">
                  <span className="text-sm font-medium text-foreground">{seller.name}</span>
                  <span className="text-sm font-semibold text-foreground">{seller.revenue}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-brand-500 transition-all"
                      style={{ width: `${seller.pct}%` }}
                    />
                  </div>
                  <span className="shrink-0 text-xs text-muted-foreground">{seller.sales} vendas</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
