import { useNavigate } from "@tanstack/react-router"

import { AppPageHeader } from "@/components/shared/AppPageHeader"
import { CustomerForm, type CustomerFormData } from "../components/CustomerForm"

export function CustomerCreatePage() {
  const navigate = useNavigate()

  function handleSubmit(data: CustomerFormData) {
    // TODO: conectar ao serviço real
    console.warn("Criar cliente:", data)
    navigate({ to: "/customers" })
  }

  function handleCancel() {
    navigate({ to: "/customers" })
  }

  return (
    <div className="space-y-6">
      <AppPageHeader
        title="Novo Cliente"
        subtitle="Preencha os dados para cadastrar um novo cliente."
        onBack={handleCancel}
      />

      <CustomerForm
        onSubmit={handleSubmit}
        onCancel={handleCancel}
      />
    </div>
  )
}
