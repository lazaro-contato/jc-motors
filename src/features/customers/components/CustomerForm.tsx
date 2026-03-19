import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Users } from "lucide-react"

import { AppButton } from "@/components/shared/AppButton"
import { AppInput } from "@/components/shared/AppInput"
import { AppSelect } from "@/components/shared/AppSelect"
import { AppTextarea } from "@/components/shared/AppTextarea"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

import {
  customerSchema,
  type CustomerFormData,
  PERSON_TYPE_OPTIONS,
  STATUS_OPTIONS,
} from "../data/customer.schema"

export type { CustomerFormData } from "../data/customer.schema"

/* ── Component ───────────────────────────────────────────────────────────── */

interface CustomerFormProps {
  onSubmit: (data: CustomerFormData) => void
  onCancel: () => void
  isSubmitting?: boolean
}

export function CustomerForm({ onSubmit, onCancel, isSubmitting = false }: CustomerFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CustomerFormData>({
    resolver: zodResolver(customerSchema),
    defaultValues: { person_type: "PF" },
  })

  const personType = watch("person_type")
  const documentPlaceholder = personType === "PF" ? "000.000.000-00" : "00.000.000/0000-00"
  const documentLabel = personType === "PF" ? "CPF" : "CNPJ"

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Dados pessoais */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <div className="flex size-9 items-center justify-center rounded-xl bg-brand-50 dark:bg-brand-500/15">
              <Users className="size-4 text-brand-500 dark:text-brand-300" />
            </div>
            <div>
              <CardTitle className="text-base">Dados do Cliente</CardTitle>
              <CardDescription>Informações pessoais ou da empresa</CardDescription>
            </div>
          </div>
        </CardHeader>
        <Separator />
        <CardContent className="grid gap-4 pt-5 md:grid-cols-3 md:gap-5 md:pt-6">
          <AppInput
            label="Nome Completo / Razão Social"
            placeholder="Ex.: João da Silva ou Empresa ABC Ltda."
            error={errors.full_name?.message}
            {...register("full_name")}
          />
          <AppSelect
            label="Tipo de Pessoa"
            placeholder="Selecione o tipo..."
            options={PERSON_TYPE_OPTIONS}
            value={watch("person_type")}
            onValueChange={(v: string) => setValue("person_type", v as "PF" | "PJ", { shouldValidate: true })}
            error={errors.person_type?.message}
          />
          <AppInput
            label={documentLabel}
            placeholder={documentPlaceholder}
            error={errors.document?.message}
            {...register("document")}
          />
        </CardContent>
      </Card>

      {/* Contato */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-base">Contato</CardTitle>
          <CardDescription>E-mail e telefone para comunicação</CardDescription>
        </CardHeader>
        <Separator />
        <CardContent className="grid gap-4 pt-5 md:grid-cols-2 md:gap-5 md:pt-6">
          <AppInput
            label="E-mail"
            type="email"
            placeholder="contato@email.com"
            error={errors.email?.message}
            {...register("email")}
          />
          <AppInput
            label="Telefone"
            type="tel"
            placeholder="(00) 00000-0000"
            error={errors.phone?.message}
            {...register("phone")}
          />
        </CardContent>
      </Card>

      {/* Endereço e Status */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-base">Endereço e Status</CardTitle>
          <CardDescription>Localização e situação cadastral</CardDescription>
        </CardHeader>
        <Separator />
        <CardContent className="grid gap-4 pt-5 md:grid-cols-3 md:gap-5 md:pt-6">
          <div className="md:col-span-2">
            <AppTextarea
              label="Endereço"
              placeholder="Rua, número, bairro, cidade - UF"
              rows={2}
              {...register("address")}
            />
          </div>
          <AppSelect
            label="Status"
            placeholder="Selecione o status..."
            options={STATUS_OPTIONS}
            value={watch("is_active")}
            onValueChange={(v: string) => setValue("is_active", v as "true" | "false", { shouldValidate: true })}
            error={errors.is_active?.message}
          />
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <Button type="button" variant="outline" onClick={onCancel} className="w-full sm:w-auto">
          Cancelar
        </Button>
        <AppButton type="submit" isLoading={isSubmitting} className="w-full sm:w-auto">
          Salvar Cliente
        </AppButton>
      </div>
    </form>
  )
}
