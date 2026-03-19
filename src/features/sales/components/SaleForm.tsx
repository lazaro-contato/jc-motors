import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, Controller } from "react-hook-form"
import { Car, DollarSign } from "lucide-react"

import { AppButton } from "@/components/shared/AppButton"
import { AppInput } from "@/components/shared/AppInput"
import { AppSearchSelect } from "@/components/shared/AppSearchSelect"
import { AppTextarea } from "@/components/shared/AppTextarea"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

import { saleSchema, type SaleFormData } from "../data/sale.schema"
import {
  AVAILABLE_CARS_OPTIONS,
  CUSTOMERS_OPTIONS,
  EMPLOYEES_OPTIONS,
} from "../data/sales.mock"

export type { SaleFormData } from "../data/sale.schema"

/* ── Component ───────────────────────────────────────────────────────────── */

interface SaleFormProps {
  onSubmit: (data: SaleFormData) => void
  onCancel: () => void
  isSubmitting?: boolean
}

export function SaleForm({ onSubmit, onCancel, isSubmitting = false }: SaleFormProps) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<SaleFormData>({
    resolver: zodResolver(saleSchema),
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Veículo e Partes */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <div className="flex size-9 items-center justify-center rounded-md bg-silver-100 dark:bg-silver-800">
              <Car className="size-4 text-brand-600 dark:text-silver-300" />
            </div>
            <div>
              <CardTitle className="text-base">Dados da Venda</CardTitle>
              <CardDescription>Veículo, cliente e vendedor responsável</CardDescription>
            </div>
          </div>
        </CardHeader>
        <Separator />
        <CardContent className="grid gap-4 pt-5 md:grid-cols-3 md:gap-5 md:pt-6">
          <Controller
            name="car_id"
            control={control}
            render={({ field }) => (
              <AppSearchSelect
                label="Veículo"
                options={AVAILABLE_CARS_OPTIONS}
                value={field.value}
                onChange={field.onChange}
                placeholder="Selecione o veículo..."
                searchPlaceholder="Buscar veículo..."
                error={errors.car_id?.message}
              />
            )}
          />
          <Controller
            name="customer_id"
            control={control}
            render={({ field }) => (
              <AppSearchSelect
                label="Cliente"
                options={CUSTOMERS_OPTIONS}
                value={field.value}
                onChange={field.onChange}
                placeholder="Selecione o cliente..."
                searchPlaceholder="Buscar cliente..."
                error={errors.customer_id?.message}
              />
            )}
          />
          <Controller
            name="employee_id"
            control={control}
            render={({ field }) => (
              <AppSearchSelect
                label="Vendedor"
                options={EMPLOYEES_OPTIONS}
                value={field.value}
                onChange={field.onChange}
                placeholder="Selecione o vendedor..."
                searchPlaceholder="Buscar vendedor..."
                error={errors.employee_id?.message}
              />
            )}
          />
        </CardContent>
      </Card>

      {/* Financeiro e Observações */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <div className="flex size-9 items-center justify-center rounded-md bg-silver-100 dark:bg-silver-800">
              <DollarSign className="size-4 text-brand-600 dark:text-silver-300" />
            </div>
            <div>
              <CardTitle className="text-base">Financeiro</CardTitle>
              <CardDescription>Valor acordado e observações da venda</CardDescription>
            </div>
          </div>
        </CardHeader>
        <Separator />
        <CardContent className="grid gap-4 pt-5 md:grid-cols-2 md:gap-5 md:pt-6">
          <AppInput
            label="Valor da Venda (R$)"
            type="number"
            placeholder="Ex.: 150000"
            hint="Informe o valor em reais sem pontos ou vírgulas"
            error={errors.sale_price?.message}
            {...register("sale_price")}
          />
          <div className="md:col-span-2">
            <AppTextarea
              label="Observações"
              placeholder="Informações adicionais sobre a venda..."
              rows={3}
              {...register("notes")}
            />
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <Button type="button" variant="outline" onClick={onCancel} className="w-full sm:w-auto">
          Cancelar
        </Button>
        <AppButton type="submit" isLoading={isSubmitting} className="w-full sm:w-auto">
          Registrar Venda
        </AppButton>
      </div>
    </form>
  )
}
