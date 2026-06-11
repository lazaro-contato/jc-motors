import { useFormContext } from "react-hook-form"

import { AppInput } from "@/components/shared/AppInput"
import { AppSelect } from "@/components/shared/AppSelect"

import { STATE_OPTIONS, type ProviderFormData } from "../../data/provider.schema"

export function LocationTab() {
  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<ProviderFormData>()

  return (
    <div className="grid gap-4 md:grid-cols-3 md:gap-5">
      <div className="md:col-span-2">
        <AppInput
          label="Cidade"
          placeholder="Ex.: São Paulo"
          error={errors.city?.message}
          {...register("city")}
        />
      </div>
      <AppSelect
        label="UF"
        options={STATE_OPTIONS}
        value={watch("state") ?? ""}
        onValueChange={(v) => setValue("state", v, { shouldValidate: true })}
        placeholder="Estado"
        error={errors.state?.message}
      />
    </div>
  )
}
