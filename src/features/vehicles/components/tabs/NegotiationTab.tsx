import { useFormContext } from "react-hook-form"

import { AppInput } from "@/components/shared/AppInput"
import { AppTextarea } from "@/components/shared/AppTextarea"

import type { VehicleEditData } from "../../data/vehicle.schema"

export function NegotiationTab() {
  const {
    register,
    formState: { errors },
  } = useFormContext<VehicleEditData>()

  return (
    <div className="grid gap-4 md:grid-cols-2 md:gap-5">
      <AppInput
        label="Desconto"
        type="number"
        hint="Valor em reais"
        error={errors.discount?.message}
        {...register("discount")}
      />
      <div className="md:col-span-2">
        <AppTextarea
          label="Observações da negociação"
          placeholder="Anote condições, contrapropostas e detalhes acordados..."
          rows={5}
          error={errors.negotiationNotes?.message}
          {...register("negotiationNotes")}
        />
      </div>
    </div>
  )
}
