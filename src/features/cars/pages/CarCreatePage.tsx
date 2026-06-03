import { useNavigate } from "@tanstack/react-router"
import { toast } from "sonner"

import { AppPageHeader } from "@/components/shared/AppPageHeader"
import { useCreateVehicle } from "../hooks/useVehicleMutations"
import { CarForm, type CarCreateData } from "../components/CarForm"

export function CarCreatePage() {
  const navigate = useNavigate()
  const createVehicle = useCreateVehicle()

  async function handleSubmit(data: CarCreateData) {
    try {
      const vehicle = await createVehicle.mutateAsync(data)
      toast.success("Veículo cadastrado com sucesso")
      navigate({ to: "/cars/$id/edit", params: { id: vehicle.id } })
    } catch {
      toast.error("Erro ao cadastrar veículo")
    }
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
        isSubmitting={createVehicle.isPending}
      />
    </div>
  )
}
