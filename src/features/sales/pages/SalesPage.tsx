import { useState } from "react"
import { useNavigate } from "@tanstack/react-router"
import { Plus } from "lucide-react"

import { AppButton } from "@/components/shared/AppButton"
import { AppDataTable } from "@/components/shared/AppDataTable"
import { AppPageHeader } from "@/components/shared/AppPageHeader"
import { cn } from "@/lib/utils"
import type { SaleStatus } from "@/types/sales"

import { saleColumns } from "../components/SalesTable"
import { SALES, SALE_STATUS_OPTIONS } from "../data/sales.mock"

type StatusFilter = SaleStatus | "all"

export function SalesPage() {
  const navigate = useNavigate()
  const [query, setQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all")
  const [page, setPage] = useState(1)
  const PAGE_SIZE = 10

  const filtered = SALES.filter((s) => {
    const matchesStatus = statusFilter === "all" || s.status === statusFilter
    const matchesQuery =
      !query ||
      `${s.car.brand} ${s.car.model}`.toLowerCase().includes(query.toLowerCase()) ||
      s.car.plate.toLowerCase().includes(query.toLowerCase()) ||
      s.customer.full_name.toLowerCase().includes(query.toLowerCase()) ||
      s.employee.full_name.toLowerCase().includes(query.toLowerCase())
    return matchesStatus && matchesQuery
  })

  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  function handleStatusFilter(value: StatusFilter) {
    setStatusFilter(value)
    setPage(1)
  }

  return (
    <div className="space-y-6">
      <AppPageHeader
        title="Vendas"
        subtitle="Acompanhe e gerencie todas as vendas da concessionária."
        action={
          <AppButton className="gap-2" onClick={() => navigate({ to: "/sales/new" })}>
            <Plus className="size-4" />
            Nova Venda
          </AppButton>
        }
      />

      {/* Status filter pills */}
      <div className="flex flex-wrap gap-2">
        {SALE_STATUS_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            onClick={() => handleStatusFilter(opt.value as StatusFilter)}
            className={cn(
              "rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors",
              statusFilter === opt.value
                ? "bg-brand-600 text-white"
                : "bg-muted text-muted-foreground hover:bg-accent hover:text-foreground",
            )}
          >
            {opt.label}
          </button>
        ))}
      </div>

      <AppDataTable
        columns={saleColumns}
        data={paginated}
        total={filtered.length}
        page={page}
        pageSize={PAGE_SIZE}
        onPageChange={setPage}
        searchPlaceholder="Buscar por veículo, cliente ou vendedor..."
        onSearch={(q) => {
          setQuery(q)
          setPage(1)
        }}
        emptyText="Nenhuma venda encontrada."
      />
    </div>
  )
}
