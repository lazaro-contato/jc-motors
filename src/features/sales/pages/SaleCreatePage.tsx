import { useNavigate } from "@tanstack/react-router"

import { AppPageHeader } from "@/components/shared/AppPageHeader"

import { SaleForm, type SaleFormData } from "../components/SaleForm"

export function SaleCreatePage() {
  const navigate = useNavigate()

  function handleSubmit(data: SaleFormData) {
    // TODO: conectar ao serviço real
    console.warn("Registrar venda:", data)
    navigate({ to: "/sales" })
  }

  function handleCancel() {
    navigate({ to: "/sales" })
  }

  return (
    <div className="space-y-6">
      <AppPageHeader
        title="Nova Venda"
        subtitle="Preencha os dados para registrar uma nova venda."
        onBack={handleCancel}
      />

      <SaleForm
        onSubmit={handleSubmit}
        onCancel={handleCancel}
      />
    </div>
  )
}
