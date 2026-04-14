import { useNavigate } from "@tanstack/react-router"

import { AppPageHeader } from "@/components/shared/AppPageHeader"

import { CarForm, type CarCreateData } from "../components/CarForm"

export function CarCreatePage() {
  const navigate = useNavigate()

  function handleSubmit(data: CarCreateData) {
    // TODO: conectar ao serviço real — usar ID retornado pelo backend
    console.warn("Cadastrar veículo:", data)
    const newId = String(Date.now())
    navigate({ to: "/cars/$id/edit", params: { id: newId } })
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
