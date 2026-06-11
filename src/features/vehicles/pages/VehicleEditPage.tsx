import { useEffect, useState } from "react"
import { useNavigate, useParams } from "@tanstack/react-router"
import { zodResolver } from "@hookform/resolvers/zod"
import { FormProvider, useForm } from "react-hook-form"
import { toast } from "sonner"

import { AppButton } from "@/components/shared/AppButton"
import { AppPageHeader } from "@/components/shared/AppPageHeader"
import { AppUnsavedChangesDialog } from "@/components/shared/AppUnsavedChangesDialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useUnsavedChangesGuard } from "@/hooks/useUnsavedChangesGuard"

import { VehicleEditTabs } from "../components/VehicleEditTabs"
import { vehicleEditSchema, type VehicleEditData, type VehicleStep } from "../data/vehicle.schema"
import { useVehicle } from "../hooks/useVehicle"
import { useUpdateVehicle } from "../hooks/useVehicleMutations"

export function VehicleEditPage() {
  const navigate = useNavigate()
  const { id } = useParams({ strict: false }) as { id: string }
  const [activeTab, setActiveTab] = useState<VehicleStep>("vehicle")

  const { data: vehicle, isPending: isLoading } = useVehicle(id)
  const updateVehicle = useUpdateVehicle()

  const form = useForm<VehicleEditData>({
    resolver: zodResolver(vehicleEditSchema),
  })

  useEffect(() => {
    if (!vehicle) return
    form.reset({
      licensePlate:    vehicle.licensePlate,
      renavam:         vehicle.renavam,
      chassis:         vehicle.chassis,
      brandId:         vehicle.brandId,
      model:           vehicle.model,
      color:           vehicle.color,
      manufactureYear: vehicle.manufactureYear,
      modelYear:       vehicle.modelYear,
      mileage:         vehicle.mileage,
      fuelType:        vehicle.fuelType,
      engine:          vehicle.engine,
      transmission:    vehicle.transmission,
      categoryId:      vehicle.categoryId,
      oldPrice:        vehicle.oldPrice ? Number(vehicle.oldPrice) : undefined,
      price:           Number(vehicle.price),
      isPublished:     vehicle.isPublished,
      isB2bVisible:    vehicle.isB2bVisible,
      isB2cVisible:    vehicle.isB2cVisible,
      status:          vehicle.status,
      optionals:       [],
    })
  }, [vehicle, form])

  const isDirty = form.formState.isDirty
  const guard = useUnsavedChangesGuard(isDirty)

  async function persist(data: VehicleEditData) {
    try {
      const { optionals: _o, negotiationNotes: _n, discount: _d, purchasePrice: _p, repairCost: _r, ...vehicleFields } = data
      await updateVehicle.mutateAsync({ id, dto: vehicleFields })
      form.reset(data)
      toast.success("Alterações salvas")
    } catch {
      toast.error("Erro ao salvar veículo")
    }
  }

  function handleSaveAndExit() {
    form.handleSubmit(async (data) => {
      await persist(data)
      navigate({ to: "/vehicles" })
    })()
  }

  function handleSaveAndContinue() {
    form.handleSubmit(persist)()
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <AppPageHeader
          title="Editar Veículo"
          subtitle="Carregando..."
          onBack={() => navigate({ to: "/vehicles" })}
        />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <AppPageHeader
        title="Editar Veículo"
        subtitle={`Placa ${vehicle?.licensePlate ?? id} · complete as informações do veículo`}
        onBack={() => navigate({ to: "/vehicles" })}
      />

      <FormProvider {...form}>
        <Card>
          <CardContent className="pt-6">
            <VehicleEditTabs
              value={activeTab}
              onValueChange={setActiveTab}
              pendingSteps={[]}
            />
          </CardContent>
        </Card>

        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Button type="button" variant="outline" onClick={() => navigate({ to: "/vehicles" })}>
            Cancelar
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={handleSaveAndExit}
            disabled={updateVehicle.isPending}
          >
            Salvar e sair
          </Button>
          <AppButton
            type="button"
            onClick={handleSaveAndContinue}
            isLoading={updateVehicle.isPending}
          >
            Salvar e continuar
          </AppButton>
        </div>
      </FormProvider>

      <AppUnsavedChangesDialog
        open={guard.isBlocked}
        onOpenChange={(open) => !open && guard.cancel()}
        onConfirm={guard.confirm}
        onCancel={guard.cancel}
      />
    </div>
  )
}
