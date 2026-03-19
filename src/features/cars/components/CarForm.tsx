import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, Controller } from "react-hook-form"
import { Car, DollarSign, FileText } from "lucide-react"

import { AppButton } from "@/components/shared/AppButton"
import { AppInput } from "@/components/shared/AppInput"
import { AppSearchSelect } from "@/components/shared/AppSearchSelect"
import { AppTextarea } from "@/components/shared/AppTextarea"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

import {
  carSchema,
  type CarFormData,
  BRAND_OPTIONS,
  FUEL_OPTIONS,
  TRANSMISSION_OPTIONS,
  STATUS_OPTIONS,
  PROVIDER_OPTIONS,
} from "../data/car.schema"

export type { CarFormData } from "../data/car.schema"

/* ── Component ───────────────────────────────────────────────────────────── */

interface CarFormProps {
  onSubmit: (data: CarFormData) => void
  onCancel: () => void
  isSubmitting?: boolean
}

export function CarForm({ onSubmit, onCancel, isSubmitting = false }: CarFormProps) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<CarFormData>({
    resolver: zodResolver(carSchema),
    defaultValues: {},
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* ── Informações do Veículo ── */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <div className="flex size-9 items-center justify-center rounded-md bg-silver-100 dark:bg-silver-800">
              <Car className="size-4 text-brand-600 dark:text-silver-300" />
            </div>
            <div>
              <CardTitle className="text-base">Informações do Veículo</CardTitle>
              <CardDescription>Dados de identificação e características do veículo</CardDescription>
            </div>
          </div>
        </CardHeader>
        <Separator />
        <CardContent className="grid gap-4 pt-5 md:grid-cols-3 md:gap-5 md:pt-6">
          <Controller
            name="brand"
            control={control}
            render={({ field }) => (
              <AppSearchSelect
                label="Marca"
                options={BRAND_OPTIONS}
                value={field.value}
                onChange={field.onChange}
                placeholder="Selecione a marca..."
                searchPlaceholder="Buscar marca..."
                error={errors.brand?.message}
              />
            )}
          />
          <AppInput
            label="Modelo"
            placeholder="Ex.: Civic EXL 2.0"
            error={errors.model?.message}
            {...register("model")}
          />
          <AppInput
            label="Cor"
            placeholder="Ex.: Branco Perolizado"
            error={errors.color?.message}
            {...register("color")}
          />
          <AppInput
            label="Ano de Fabricação"
            type="number"
            placeholder="Ex.: 2024"
            error={errors.year_manufacture?.message}
            {...register("year_manufacture")}
          />
          <AppInput
            label="Ano do Modelo"
            type="number"
            placeholder="Ex.: 2025"
            error={errors.year_model?.message}
            {...register("year_model")}
          />
          <AppInput
            label="Placa"
            placeholder="ABC-1D23"
            error={errors.plate?.message}
            {...register("plate")}
          />
          <AppInput
            label="Chassi"
            placeholder="Ex.: 9BR53ZEC2LB123456"
            hint="Opcional"
            error={errors.chassis?.message}
            {...register("chassis")}
          />
          <AppInput
            label="Quilometragem"
            type="number"
            placeholder="Ex.: 12400"
            error={errors.mileage?.message}
            {...register("mileage")}
          />
          <Controller
            name="fuel"
            control={control}
            render={({ field }) => (
              <AppSearchSelect
                label="Combustível"
                options={FUEL_OPTIONS}
                value={field.value}
                onChange={field.onChange}
                placeholder="Selecione..."
                error={errors.fuel?.message}
              />
            )}
          />
          <Controller
            name="transmission"
            control={control}
            render={({ field }) => (
              <AppSearchSelect
                label="Câmbio"
                options={TRANSMISSION_OPTIONS}
                value={field.value}
                onChange={field.onChange}
                placeholder="Selecione..."
                error={errors.transmission?.message}
              />
            )}
          />
        </CardContent>
      </Card>

      {/* ── Financeiro ── */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <div className="flex size-9 items-center justify-center rounded-md bg-silver-100 dark:bg-silver-800">
              <DollarSign className="size-4 text-brand-600 dark:text-silver-300" />
            </div>
            <div>
              <CardTitle className="text-base">Financeiro</CardTitle>
              <CardDescription>Preços de aquisição, venda e fornecedor</CardDescription>
            </div>
          </div>
        </CardHeader>
        <Separator />
        <CardContent className="grid gap-4 pt-5 md:grid-cols-2 md:gap-5 md:pt-6">
          <AppInput
            label="Preço de Compra (R$)"
            type="number"
            placeholder="Ex.: 85000"
            hint="Valor pago na aquisição"
            error={errors.purchase_price?.message}
            {...register("purchase_price")}
          />
          <AppInput
            label="Preço de Venda (R$)"
            type="number"
            placeholder="Ex.: 99990"
            hint="Valor de tabela para venda"
            error={errors.sale_price?.message}
            {...register("sale_price")}
          />
          <Controller
            name="provider_id"
            control={control}
            render={({ field }) => (
              <AppSearchSelect
                label="Fornecedor"
                options={PROVIDER_OPTIONS}
                value={field.value ?? ""}
                onChange={field.onChange}
                placeholder="Selecione o fornecedor..."
                searchPlaceholder="Buscar fornecedor..."
                hint="Opcional"
              />
            )}
          />
          <Controller
            name="status"
            control={control}
            render={({ field }) => (
              <AppSearchSelect
                label="Status"
                options={STATUS_OPTIONS}
                value={field.value}
                onChange={field.onChange}
                placeholder="Selecione o status..."
                error={errors.status?.message}
              />
            )}
          />
        </CardContent>
      </Card>

      {/* ── Descrição ── */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <div className="flex size-9 items-center justify-center rounded-md bg-silver-100 dark:bg-silver-800">
              <FileText className="size-4 text-brand-600 dark:text-silver-300" />
            </div>
            <div>
              <CardTitle className="text-base">Detalhes Adicionais</CardTitle>
              <CardDescription>Observações e descrição do veículo</CardDescription>
            </div>
          </div>
        </CardHeader>
        <Separator />
        <CardContent className="pt-5 md:pt-6">
          <AppTextarea
            label="Descrição"
            placeholder="Descreva o estado do veículo, acessórios, histórico de manutenção..."
            rows={4}
            hint="Opcional — informações adicionais visíveis no detalhe do veículo"
            {...register("description")}
          />
        </CardContent>
      </Card>

      {/* ── Actions ── */}
      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <Button type="button" variant="outline" onClick={onCancel} className="w-full sm:w-auto">
          Cancelar
        </Button>
        <AppButton type="submit" isLoading={isSubmitting} className="w-full sm:w-auto">
          Cadastrar Veículo
        </AppButton>
      </div>
    </form>
  )
}
