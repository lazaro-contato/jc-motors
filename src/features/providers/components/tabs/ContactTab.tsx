import { useFormContext } from "react-hook-form"

import { AppInput } from "@/components/shared/AppInput"
import { AppPhoneInput } from "@/components/shared/AppPhoneInput"

import type { ProviderFormData } from "../../data/provider.schema"

export function ContactTab() {
  const {
    register,
    formState: { errors },
  } = useFormContext<ProviderFormData>()

  return (
    <div className="grid gap-4 md:grid-cols-3 md:gap-5">
      <AppInput
        label="Nome do Responsável"
        placeholder="Ex.: João da Silva"
        error={errors.contact?.message}
        {...register("contact")}
      />
      <AppInput
        label="E-mail"
        type="email"
        placeholder="contato@empresa.com.br"
        error={errors.email?.message}
        {...register("email")}
      />
      <AppPhoneInput error={errors.phone?.message} {...register("phone")} />
    </div>
  )
}
