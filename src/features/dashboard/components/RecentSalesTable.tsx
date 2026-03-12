import { Car, ChevronRight, Eye } from "lucide-react"

import { AppDataTable, type AppDataTableColumn } from "@/components/shared/AppDataTable"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { RECENT_SALES, SALE_STATUS, type RecentSale, type SaleStatus } from "../data/dashboard.mock"

const columns: AppDataTableColumn<RecentSale>[] = [
  {
    key: "vehicle",
    header: "Veículo",
    render: (_, row) => (
      <div className="flex items-center gap-2.5">
        <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-brand-50 dark:bg-brand-500/15">
          <Car className="size-3.5 text-brand-500 dark:text-brand-300" />
        </div>
        <div>
          <p className="text-sm font-medium text-foreground">{row.vehicle}</p>
          <p className="text-xs text-muted-foreground">{row.date}</p>
        </div>
      </div>
    ),
  },
  { key: "customer", header: "Cliente", className: "text-sm text-muted-foreground" },
  { key: "employee", header: "Vendedor", className: "text-sm text-muted-foreground" },
  { key: "price", header: "Valor", align: "right", className: "font-semibold text-foreground text-sm" },
  {
    key: "status",
    header: "Status",
    render: (value) => {
      const cfg = SALE_STATUS[value as SaleStatus]
      return (
        <span className={cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold", cfg.className)}>
          {cfg.label}
        </span>
      )
    },
  },
  {
    key: "_actions",
    header: "",
    align: "right",
    render: () => (
      <Button variant="ghost" size="icon" className="size-7 rounded-lg text-muted-foreground hover:text-foreground">
        <Eye className="size-3.5" />
      </Button>
    ),
  },
]

export function RecentSalesTable() {
  return (
    <AppDataTable
      title="Vendas Recentes"
      columns={columns}
      data={RECENT_SALES}
      total={RECENT_SALES.length}
      page={1}
      pageSize={5}
      headerAction={
        <Button variant="ghost" size="sm" className="h-7 gap-1 text-xs text-muted-foreground">
          Ver todas <ChevronRight className="size-3" />
        </Button>
      }
      emptyText="Nenhuma venda recente."
    />
  )
}
