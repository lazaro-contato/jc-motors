import { ChevronRight } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { INVENTORY_STATUS } from "../data/dashboard.mock"

export function InventoryCard() {
  const total = INVENTORY_STATUS.reduce((sum, s) => sum + s.count, 0)

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between space-y-0 border-b border-border pb-3">
        <CardTitle className="text-base font-semibold">Estoque de Veículos</CardTitle>
        <Badge variant="secondary" className="text-xs font-medium">
          {total} total
        </Badge>
      </CardHeader>
      <CardContent className="pt-4">
        {/* Stacked progress bar */}
        <div className="mb-5 flex h-2.5 w-full overflow-hidden rounded-full">
          {INVENTORY_STATUS.map((s) => (
            <div
              key={s.intent}
              className={cn("h-full", s.color)}
              style={{ width: `${(s.count / total) * 100}%` }}
            />
          ))}
        </div>

        {/* Legend */}
        <div className="grid grid-cols-2 gap-x-6 gap-y-3">
          {INVENTORY_STATUS.map((s) => (
            <div key={s.intent} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className={cn("size-2 shrink-0 rounded-full", s.color)} />
                <span className="text-sm text-muted-foreground">{s.label}</span>
              </div>
              <span className="text-sm font-semibold text-foreground">{s.count}</span>
            </div>
          ))}
        </div>

        <Button variant="outline" size="sm" className="mt-5 w-full gap-1.5 text-xs">
          Ver todos os veículos <ChevronRight className="size-3.5" />
        </Button>
      </CardContent>
    </Card>
  )
}
