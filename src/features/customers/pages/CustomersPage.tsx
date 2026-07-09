import { useMemo, useState } from "react"
import { useNavigate } from "@tanstack/react-router"
import { Eye, Pencil, Plus, Trash2 } from "lucide-react"

import { AppButton } from "@/components/shared/AppButton"
import { AppDataTable, type AppDataTableColumn } from "@/components/shared/AppDataTable"
import { AppPageHeader } from "@/components/shared/AppPageHeader"
import { Button } from "@/components/ui/button"
import type { Customer } from "@/types/customers"

import { customerBaseColumns } from "../components/CustomersTable"
import { useCustomers } from "../hooks/useCustomers"

const PAGE_SIZE = 10

export function CustomersPage() {
  const navigate = useNavigate()
  const [page, setPage] = useState(1)

  const { data } = useCustomers({ page, limit: PAGE_SIZE })

  const columns = useMemo<AppDataTableColumn<Customer>[]>(
    () => [
      ...customerBaseColumns,
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
            >
              <Eye className="size-3.5" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="size-7 rounded-lg text-muted-foreground hover:text-foreground"
              onClick={() => navigate({ to: "/customers/$id/edit", params: { id: row.id } })}
            >
              <Pencil className="size-3.5" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="size-7 rounded-lg text-muted-foreground hover:text-danger"
            >
              <Trash2 className="size-3.5" />
            </Button>
          </div>
        ),
      },
    ],
    [navigate],
  )

  return (
    <div className="space-y-6">
      <AppPageHeader
        title="Clientes"
        subtitle="Gerencie os clientes cadastrados na plataforma."
        action={
          <AppButton className="gap-2" onClick={() => navigate({ to: "/customers/new" })}>
            <Plus className="size-4" />
            Novo Cliente
          </AppButton>
        }
      />

      <AppDataTable
        columns={columns}
        data={data?.data ?? []}
        total={data?.total ?? 0}
        page={page}
        pageSize={PAGE_SIZE}
        onPageChange={setPage}
        searchPlaceholder="Buscar por nome, e-mail ou documento..."
        onSearch={() => setPage(1)}
        emptyText="Nenhum cliente encontrado."
      />
    </div>
  )
}
