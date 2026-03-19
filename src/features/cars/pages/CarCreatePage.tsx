import { useNavigate } from "@tanstack/react-router"

import { AppPageHeader } from "@/components/shared/AppPageHeader"

import { CarForm, type CarFormData } from "../components/CarForm"

export function CarCreatePage() {
  const navigate = useNavigate()

  function handleSubmit(data: CarFormData) {
    // TODO: conectar ao serviço real
    console.warn("Cadastrar veículo:", data)
    navigate({ to: "/cars" })
  }

  function handleCancel() {
    navigate({ to: "/cars" })
  }

  return (
    <div className="space-y-6">
      <AppPageHeader
        title="Novo Veículo"
        subtitle="Preencha os dados para cadastrar um novo veículo no estoque."
        onBack={handleCancel}
      />

      <CarForm
        onSubmit={handleSubmit}
        onCancel={handleCancel}
      />
    </div>
  )
}
