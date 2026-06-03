import { useState } from "react"
import { useNavigate } from "@tanstack/react-router"
import { Plus } from "lucide-react"

import { AppButton } from "@/components/shared/AppButton"
import { AppDataTable } from "@/components/shared/AppDataTable"
import { AppPageHeader } from "@/components/shared/AppPageHeader"

import { customerColumns } from "../components/CustomersTable"
import { useCustomers } from "../hooks/useCustomers"

const PAGE_SIZE = 10

export function CustomersPage() {
  const navigate = useNavigate()
  const [page, setPage] = useState(1)

  const { data } = useCustomers({ page, limit: PAGE_SIZE })

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
        columns={customerColumns}
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
