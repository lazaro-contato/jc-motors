import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { KeyRound, UserSquare } from "lucide-react"

import { AppButton } from "@/components/shared/AppButton"
import { AppInput } from "@/components/shared/AppInput"
import { AppPhoneInput } from "@/components/shared/AppPhoneInput"
import { AppSelect } from "@/components/shared/AppSelect"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

import {
  employeeSchema,
  type EmployeeFormData,
  ACCESS_LEVEL_OPTIONS,
  STATUS_OPTIONS,
} from "../data/employee.schema"

export type { EmployeeFormData } from "../data/employee.schema"

/* ── Component ───────────────────────────────────────────────────────────── */

interface EmployeeFormProps {
  onSubmit: (data: EmployeeFormData) => void
  onCancel: () => void
  isSubmitting?: boolean
}

export function EmployeeForm({ onSubmit, onCancel, isSubmitting = false }: EmployeeFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<EmployeeFormData>({
    resolver: zodResolver(employeeSchema),
    defaultValues: {},
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Dados de Acesso */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <div className="flex size-9 items-center justify-center rounded-md bg-silver-100 dark:bg-silver-800">
              <KeyRound className="size-4 text-brand-600 dark:text-silver-300" />
            </div>
            <div>
              <CardTitle className="text-base">Dados de Acesso</CardTitle>
              <CardDescription>Credenciais de login do funcionário</CardDescription>
            </div>
          </div>
        </CardHeader>
        <Separator />
        <CardContent className="grid gap-4 pt-5 md:grid-cols-3 md:gap-5 md:pt-6">
          <AppInput
            label="E-mail"
            type="email"
            placeholder="funcionario@jcmotors.com.br"
            error={errors.email?.message}
            {...register("email")}
          />
          <AppInput
            label="Senha"
            type="password"
            placeholder="Mínimo 8 caracteres"
            error={errors.password?.message}
            {...register("password")}
          />
          <AppSelect
            label="Nível de Acesso"
            placeholder="Selecione o nível..."
            options={ACCESS_LEVEL_OPTIONS}
            value={watch("is_staff")}
            onValueChange={(v: string) => setValue("is_staff", v as "true" | "false", { shouldValidate: true })}
            error={errors.is_staff?.message}
          />
        </CardContent>
      </Card>

      {/* Dados Pessoais */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <div className="flex size-9 items-center justify-center rounded-md bg-silver-100 dark:bg-silver-800">
              <UserSquare className="size-4 text-brand-600 dark:text-silver-300" />
            </div>
            <div>
              <CardTitle className="text-base">Dados Pessoais</CardTitle>
              <CardDescription>Informações do funcionário</CardDescription>
            </div>
          </div>
        </CardHeader>
        <Separator />
        <CardContent className="grid gap-4 pt-5 md:grid-cols-2 md:gap-5 md:pt-6">
          <AppInput
            label="Nome Completo"
            placeholder="Ex.: João da Silva"
            error={errors.full_name?.message}
            {...register("full_name")}
          />
          <AppInput
            label="Cargo"
            placeholder="Ex.: Vendedor, Gerente..."
            error={errors.role?.message}
            {...register("role")}
          />
          <AppPhoneInput
            error={errors.phone?.message}
            {...register("phone")}
          />
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
          Salvar Funcionário
        </AppButton>
      </div>
    </form>
  )
}
