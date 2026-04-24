import { useState } from "react"
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

import { CarEditTabs } from "../components/CarEditTabs"
import { carEditSchema, type CarEditData, type CarStep } from "../data/car.schema"

/* ── Mock loader (substituir por useQuery) ───────────────────────────────── */

interface MockCar extends Partial<CarEditData> {
  id: string
  pending_steps: CarStep[]
}

function loadMockCar(id: string): MockCar {
  return {
    id,
    plate: "ABC-1D23",
    renavam: "01234567890",
    chassis: "9BR53ZEC2LB123456",
    brand: "Honda",
    model: "Civic EXL 2.0",
    color: "Branco Perolizado",
    year_manufacture: 2024,
    year_model: 2025,
    mileage: 12400,
    fuel: "Flex",
    engine: "2.0",
    transmission: "Automático",
    category_id: "2",
    price: 150000,
    is_public: true,
    is_b2b: false,
    is_b2c: true,
    status: "available",
    optionals: ["1", "5", "7"],
    pending_steps: ["optionals", "negotiation", "costs"],
  }
}

/* ── Page ────────────────────────────────────────────────────────────────── */

export function CarEditPage() {
  const navigate = useNavigate()
  const { id } = useParams({ strict: false }) as { id: string }

  const [car, setCar] = useState<MockCar>(() => loadMockCar(id))
  const [activeTab, setActiveTab] = useState<CarStep>("vehicle")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<CarEditData>({
    resolver: zodResolver(carEditSchema),
    defaultValues: car,
  })

  const isDirty = form.formState.isDirty
  const guard = useUnsavedChangesGuard(isDirty)

  async function persist(data: CarEditData) {
    setIsSubmitting(true)
    try {
      // TODO: conectar ao serviço real
      console.warn("Salvar veículo:", data)
      await new Promise((r) => setTimeout(r, 400))
      setCar((prev) => ({
        ...prev,
        ...data,
        pending_steps: prev.pending_steps.filter((s) => s !== activeTab),
      }))
      form.reset(data)
      toast.success("Alterações salvas")
    } finally {
      setIsSubmitting(false)
    }
  }

  function handleSaveAndExit() {
    form.handleSubmit(async (data) => {
      await persist(data)
      navigate({ to: "/cars" })
    })()
  }

  function handleSaveAndContinue() {
    form.handleSubmit(persist)()
  }

  return (
    <div className="space-y-6">
      <AppPageHeader
        title="Editar Veículo"
        subtitle={`Placa ${car.plate ?? id} · complete as informações do veículo`}
        onBack={() => navigate({ to: "/cars" })}
      />

      <FormProvider {...form}>
        <Card>
          <CardContent className="pt-6">
            <CarEditTabs
              value={activeTab}
              onValueChange={setActiveTab}
              pendingSteps={car.pending_steps}
            />
          </CardContent>
        </Card>

        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Button type="button" variant="outline" onClick={() => navigate({ to: "/cars" })}>
            Cancelar
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={handleSaveAndExit}
            disabled={isSubmitting}
          >
            Salvar e sair
          </Button>
          <AppButton
            type="button"
            onClick={handleSaveAndContinue}
            isLoading={isSubmitting}
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
