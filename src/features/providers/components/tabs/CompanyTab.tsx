import { useFormContext } from "react-hook-form"

import { AppCNPJInput } from "@/components/shared/AppCNPJInput"
import { AppInput } from "@/components/shared/AppInput"
import { AppSelect } from "@/components/shared/AppSelect"

import { STATUS_OPTIONS, type ProviderFormData } from "../../data/provider.schema"

export function CompanyTab() {
  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<ProviderFormData>()

  return (
    <div className="grid gap-4 md:grid-cols-3 md:gap-5">
      <AppInput
        label="Razão Social"
        placeholder="Ex.: Auto Peças São Paulo Ltda."
        error={errors.name?.message}
        {...register("name")}
      />
      <AppCNPJInput error={errors.cnpj?.message} {...register("cnpj")} />
      <AppSelect
        label="Status"
        placeholder="Selecione o status..."
        options={STATUS_OPTIONS}
        value={watch("status")}
        onValueChange={(v) =>
          setValue("status", v as "active" | "inactive", { shouldValidate: true })
        }
        error={errors.status?.message}
      />
    </div>
  )
}
