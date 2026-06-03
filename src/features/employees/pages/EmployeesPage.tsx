import { useState } from "react"
import { useNavigate } from "@tanstack/react-router"
import { Plus } from "lucide-react"

import { AppButton } from "@/components/shared/AppButton"
import { AppDataTable } from "@/components/shared/AppDataTable"
import { AppPageHeader } from "@/components/shared/AppPageHeader"

import { employeeColumns } from "../components/EmployeesTable"
import { useEmployees } from "../hooks/useEmployees"

const PAGE_SIZE = 10

export function EmployeesPage() {
  const navigate = useNavigate()
  const [page, setPage] = useState(1)

  const { data } = useEmployees({ page, limit: PAGE_SIZE })

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
        data={data?.data ?? []}
        total={data?.total ?? 0}
        page={page}
        pageSize={PAGE_SIZE}
        onPageChange={setPage}
        searchPlaceholder="Buscar por nome ou cargo..."
        onSearch={() => setPage(1)}
        emptyText="Nenhum funcionário encontrado."
      />
    </div>
  )
}
