import { Car } from "lucide-react"

import { type AppDataTableColumn } from "@/components/shared/AppDataTable"
import { cn } from "@/lib/utils"
import { formatCurrency, formatMileage } from "@/utils/formatters"
import type { Vehicle, VehicleStatus } from "@/types/vehicles"

const STATUS_CONFIG: Record<VehicleStatus, { label: string; className: string }> = {
  AVAILABLE:        { label: "Disponível",      className: "bg-success-bg text-success" },
  RESERVED:         { label: "Reservado",        className: "bg-info-bg text-info" },
  SOLD:             { label: "Vendido",          className: "bg-muted text-muted-foreground" },
  AWAITING_RELEASE: { label: "Ag. Liberação",   className: "bg-warning-bg text-warning" },
  IN_TRANSIT:       { label: "Em Trânsito",      className: "bg-info-bg text-info" },
  IN_YARD:          { label: "No Pátio",         className: "bg-warning-bg text-warning" },
  IN_PREPARATION:   { label: "Em Preparação",    className: "bg-warning-bg text-warning" },
}

const FUEL_LABELS: Record<string, string> = {
  FLEX:     "Flex",
  GASOLINE: "Gasolina",
  ETHANOL:  "Álcool",
  DIESEL:   "Diesel",
  ELECTRIC: "Elétrico",
  HYBRID:   "Híbrido",
  GNV:      "GNV",
}

export const vehicleBaseColumns: AppDataTableColumn<Vehicle>[] = [
  {
    key: "model",
    header: "Veículo",
    render: (_, row) => (
      <div className="flex items-center gap-3">
        <div className="flex size-9 shrink-0 items-center justify-center rounded-md bg-silver-100 dark:bg-silver-800">
          <Car className="size-4 text-brand-600 dark:text-silver-300" />
        </div>
        <div>
          <p className="font-semibold text-foreground">{row.model}</p>
          <p className="text-xs text-muted-foreground">
            {row.color} · {formatMileage(row.mileage)}
          </p>
        </div>
      </div>
    ),
  },
  {
    key: "licensePlate",
    header: "Placa",
    className: "hidden sm:table-cell",
    render: (value) => (
      <span className="rounded-md bg-muted px-2 py-0.5 font-mono text-xs font-medium text-foreground">
        {value as string}
      </span>
    ),
  },
  {
    key: "modelYear",
    header: "Ano",
    align: "center",
    className: "hidden md:table-cell text-muted-foreground",
  },
  {
    key: "fuelType",
    header: "Combustível",
    className: "hidden lg:table-cell text-muted-foreground text-sm",
    render: (value) => FUEL_LABELS[value as string] ?? String(value),
  },
  {
    key: "status",
    header: "Status",
    render: (value) => {
      const cfg = STATUS_CONFIG[value as VehicleStatus]
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
    key: "price",
    header: "Preço",
    align: "right",
    className: "font-semibold text-foreground",
    render: (value) => formatCurrency(Number(value)),
  },
]
