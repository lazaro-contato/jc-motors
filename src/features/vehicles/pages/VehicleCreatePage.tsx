import { useNavigate } from "@tanstack/react-router"
import { toast } from "sonner"

import { AppPageHeader } from "@/components/shared/AppPageHeader"
import { useCreateVehicle } from "../hooks/useVehicleMutations"
import { VehicleForm, type VehicleCreateData } from "../components/VehicleForm"

export function VehicleCreatePage() {
  const navigate = useNavigate()
  const createVehicle = useCreateVehicle()

  async function handleSubmit(data: VehicleCreateData) {
    try {
      const vehicle = await createVehicle.mutateAsync(data)
      toast.success("Veículo cadastrado com sucesso")
      navigate({ to: "/vehicles/$id/edit", params: { id: vehicle.id } })
    } catch {
      toast.error("Erro ao cadastrar veículo")
    }
  }

  function handleCancel() {
    navigate({ to: "/vehicles" })
  }

  return (
    <div className="space-y-6">
      <AppPageHeader
        title="Novo Veículo"
        subtitle="Preencha os dados para cadastrar um novo veículo no estoque."
        onBack={handleCancel}
      />

      <VehicleForm
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        isSubmitting={createVehicle.isPending}
      />
    </div>
  )
}
