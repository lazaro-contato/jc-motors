import { Pencil, Plus, Trash2 } from "lucide-react"
import { useMemo, useState } from "react"

import type { VehicleOptional } from "@/types/optionals"

import { AppButton } from "@/components/shared/AppButton"
import {
  AppDataTable,
  type AppDataTableColumn,
} from "@/components/shared/AppDataTable"
import { Button } from "@/components/ui/button"

const PAGE_SIZE = 10

interface OptionalsTableProps {
  optionals: VehicleOptional[]
  isLoading: boolean
  onCreate: () => void
  onEdit: (optional: VehicleOptional) => void
  onDelete: (optional: VehicleOptional) => void
}

interface OptionalRow extends Record<string, unknown> {
  id: string
  name: string
  raw: VehicleOptional
}

export function OptionalsTable({
  optionals,
  isLoading,
  onCreate,
  onEdit,
  onDelete,
}: OptionalsTableProps) {
  const [query, setQuery] = useState("")
  const [page, setPage] = useState(1)

  const rows = useMemo<OptionalRow[]>(
    () =>
      optionals.map((o) => ({
        id: o.id,
        name: o.name,
        raw: o,
      })),
    [optionals],
  )

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim()
    if (!q) return rows
    return rows.filter((r) => r.name.toLowerCase().includes(q))
  }, [rows, query])

  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const columns: AppDataTableColumn<OptionalRow>[] = [
    {
      key: "name",
      header: "Opcional",
      render: (_, row) => (
        <span className="font-medium text-foreground">{row.name}</span>
      ),
    },
    {
      key: "_actions",
      header: "",
      align: "right",
      render: (_, row) => (
        <div className="flex items-center justify-end gap-1">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="size-7 rounded-lg text-muted-foreground hover:text-foreground"
            onClick={() => onEdit(row.raw)}
            aria-label={`Editar ${row.name}`}
          >
            <Pencil className="size-3.5" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="size-7 rounded-lg text-muted-foreground hover:text-danger"
            onClick={() => onDelete(row.raw)}
            aria-label={`Excluir ${row.name}`}
          >
            <Trash2 className="size-3.5" />
          </Button>
        </div>
      ),
    },
  ]

  return (
    <AppDataTable
      title="Opcionais"
      columns={columns}
      data={paginated}
      total={filtered.length}
      page={page}
      pageSize={PAGE_SIZE}
      onPageChange={setPage}
      searchPlaceholder="Buscar opcional..."
      onSearch={(q) => {
        setQuery(q)
        setPage(1)
      }}
      isLoading={isLoading}
      emptyText="Nenhum opcional cadastrado."
      headerAction={
        <AppButton size="sm" className="gap-2" onClick={onCreate}>
          <Plus className="size-4" />
          Novo opcional
        </AppButton>
      }
    />
  )
}
