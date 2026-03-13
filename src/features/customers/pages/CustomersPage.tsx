import { useState } from "react"
import { useNavigate } from "@tanstack/react-router"
import { Plus } from "lucide-react"

import { AppButton } from "@/components/shared/AppButton"
import { AppDataTable } from "@/components/shared/AppDataTable"
import { AppPageHeader } from "@/components/shared/AppPageHeader"

import { customerColumns } from "../components/CustomersTable"
import { CUSTOMERS } from "../data/customers.mock"

export function CustomersPage() {
  const navigate = useNavigate()
  const [query, setQuery] = useState("")
  const [page, setPage] = useState(1)
  const PAGE_SIZE = 10

  const filtered = CUSTOMERS.filter(
    (c) =>
      c.full_name.toLowerCase().includes(query.toLowerCase()) ||
      c.email.toLowerCase().includes(query.toLowerCase()) ||
      c.document.includes(query),
  )

  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

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

      {/* Table */}
      <AppDataTable
        columns={customerColumns}
        data={paginated}
        total={filtered.length}
        page={page}
        pageSize={PAGE_SIZE}
        onPageChange={setPage}
        searchPlaceholder="Buscar por nome, e-mail ou documento..."
        onSearch={(q) => {
          setQuery(q)
          setPage(1)
        }}
        emptyText="Nenhum cliente encontrado."
      />
    </div>
  )
}
