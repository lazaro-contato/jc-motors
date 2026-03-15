import { useState } from "react"
import { useNavigate } from "@tanstack/react-router"
import { Plus } from "lucide-react"

import { AppButton } from "@/components/shared/AppButton"
import { AppDataTable } from "@/components/shared/AppDataTable"
import { AppPageHeader } from "@/components/shared/AppPageHeader"

import { employeeColumns } from "../components/EmployeesTable"
import { EMPLOYEES } from "../data/employees.mock"

export function EmployeesPage() {
  const navigate = useNavigate()
  const [query, setQuery] = useState("")
  const [page, setPage] = useState(1)
  const PAGE_SIZE = 10

  const filtered = EMPLOYEES.filter(
    (e) =>
      e.full_name.toLowerCase().includes(query.toLowerCase()) ||
      e.user.email.toLowerCase().includes(query.toLowerCase()) ||
      (e.role ?? "").toLowerCase().includes(query.toLowerCase()),
  )

  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  return (
    <div className="space-y-6">
      <AppPageHeader
        title="Funcionários"
        subtitle="Gerencie os funcionários cadastrados na plataforma."
        action={
          <AppButton className="gap-2" onClick={() => navigate({ to: "/employees/new" })}>
            <Plus className="size-4" />
            Novo Funcionário
          </AppButton>
        }
      />

      <AppDataTable
        columns={employeeColumns}
        data={paginated}
        total={filtered.length}
        page={page}
        pageSize={PAGE_SIZE}
        onPageChange={setPage}
        searchPlaceholder="Buscar por nome, e-mail ou cargo..."
        onSearch={(q) => {
          setQuery(q)
          setPage(1)
        }}
        emptyText="Nenhum funcionário encontrado."
      />
    </div>
  )
}
