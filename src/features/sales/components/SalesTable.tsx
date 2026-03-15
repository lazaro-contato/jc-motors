import { Car, Eye } from "lucide-react"

import { type AppDataTableColumn } from "@/components/shared/AppDataTable"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { Sale, SaleStatus } from "@/types/sales"
import { formatCurrency, formatDate } from "@/utils/formatters"
import { SALE_STATUS_CONFIG } from "../data/sales.mock"

export const saleColumns: AppDataTableColumn<Sale>[] = [
  {
    key: "id",
    header: "#",
    className: "w-12 font-mono text-xs text-muted-foreground",
    render: (value) => <span>#{value as number}</span>,
  },
  {
    key: "car",
    header: "Veículo",
    render: (_, row) => {
      const car = row.car as Sale["car"]
      return (
        <div className="flex items-center gap-2.5">
          <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-brand-50 dark:bg-brand-500/15">
            <Car className="size-3.5 text-brand-500 dark:text-brand-300" />
          </div>
          <div>
            <p className="font-semibold text-foreground">
              {car.brand} {car.model}
            </p>
            <p className="text-xs text-muted-foreground">
              {car.plate} · {car.year_model}
            </p>
          </div>
        </div>
      )
    },
  },
  {
    key: "customer",
    header: "Cliente",
    className: "hidden sm:table-cell",
    render: (_, row) => (
      <span className="text-sm text-muted-foreground">
        {(row.customer as Sale["customer"]).full_name}
      </span>
    ),
  },
  {
    key: "employee",
    header: "Vendedor",
    className: "hidden md:table-cell",
    render: (_, row) => (
      <span className="text-sm text-muted-foreground">
        {(row.employee as Sale["employee"]).full_name}
      </span>
    ),
  },
  {
    key: "sale_price",
    header: "Valor",
    align: "right",
    render: (value) => (
      <span className="text-sm font-semibold text-foreground">
        {formatCurrency(Number(value as string))}
      </span>
    ),
  },
  {
    key: "status",
    header: "Status",
    className: "hidden sm:table-cell",
    render: (value) => {
      const cfg = SALE_STATUS_CONFIG[value as SaleStatus]
      return (
        <span
          className={cn(
            "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold",
            cfg.className,
          )}
        >
          {cfg.label}
        </span>
      )
    },
  },
  {
    key: "created_at",
    header: "Data",
    className: "hidden lg:table-cell text-sm text-muted-foreground",
    render: (value) => <span>{formatDate(value as string)}</span>,
  },
  {
    key: "_actions",
    header: "",
    align: "right",
    render: () => (
      <Button
        variant="ghost"
        size="icon"
        className="size-7 rounded-lg text-muted-foreground hover:text-foreground"
      >
        <Eye className="size-3.5" />
      </Button>
    ),
  },
]
