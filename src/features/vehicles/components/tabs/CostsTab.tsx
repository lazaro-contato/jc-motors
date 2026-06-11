import { useFormContext } from "react-hook-form"

import { AppInput } from "@/components/shared/AppInput"

import type { VehicleEditData } from "../../data/vehicle.schema"

export function CostsTab() {
  const {
    register,
    formState: { errors },
  } = useFormContext<VehicleEditData>()

  return (
    <div className="grid gap-4 md:grid-cols-2 md:gap-5">
      <AppInput
        label="Preço de compra"
        type="number"
        error={errors.purchasePrice?.message}
        {...register("purchasePrice")}
      />
      <AppInput
        label="Custos de reparo"
        type="number"
        error={errors.repairCost?.message}
        {...register("repairCost")}
      />
    </div>
  )
}
