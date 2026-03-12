import { useState } from "react"
import { useNavigate } from "@tanstack/react-router"
import { Plus } from "lucide-react"

import { AppDataTable } from "@/components/shared/AppDataTable"
import { AppButton } from "@/components/shared/AppButton"

import { providerColumns } from "../components/ProvidersTable"
import { PROVIDERS } from "../data/providers.mock"

export default function ProvidersPage() {
  const navigate = useNavigate()
  const [query, setQuery] = useState("")
  const [page, setPage] = useState(1)
  const PAGE_SIZE = 10

  const filtered = PROVIDERS.filter(
    (p) =>
      p.name.toLowerCase().includes(query.toLowerCase()) ||
      p.contact.toLowerCase().includes(query.toLowerCase()) ||
      p.cnpj.includes(query),
  )

  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Fornecedores
          </h1>
          <p className="mt-0.5 text-sm text-muted-foreground">
            Gerencie os fornecedores e parceiros comerciais.
          </p>
        </div>
        <AppButton
          className="gap-2"
          onClick={() => navigate({ to: "/providers/new" })}
        >
          <Plus className="size-4" />
          Novo Fornecedor
        </AppButton>
      </div>

      {/* Table */}
      <AppDataTable
        columns={providerColumns}
        data={paginated}
        total={filtered.length}
        page={page}
        pageSize={PAGE_SIZE}
        onPageChange={setPage}
        searchPlaceholder="Buscar por nome, CNPJ ou responsável..."
        onSearch={(q) => {
          setQuery(q)
          setPage(1)
        }}
        emptyText="Nenhum fornecedor encontrado."
      />
    </div>
  )
}
