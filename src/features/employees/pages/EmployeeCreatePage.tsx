import { useNavigate } from "@tanstack/react-router"

import { AppPageHeader } from "@/components/shared/AppPageHeader"

import { EmployeeForm, type EmployeeFormData } from "../components/EmployeeForm"

export function EmployeeCreatePage() {
  const navigate = useNavigate()

  function handleSubmit(data: EmployeeFormData) {
    // TODO: conectar ao serviço real
    console.warn("Criar funcionário:", data)
    navigate({ to: "/employees" })
  }

  function handleCancel() {
    navigate({ to: "/employees" })
  }

  return (
    <div className="space-y-6">
      <AppPageHeader
        title="Novo Funcionário"
        subtitle="Preencha os dados para cadastrar um novo funcionário."
        onBack={handleCancel}
      />

      <EmployeeForm
        onSubmit={handleSubmit}
        onCancel={handleCancel}
      />
    </div>
  )
}
