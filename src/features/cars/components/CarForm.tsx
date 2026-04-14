import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import { Car, DollarSign, Globe } from "lucide-react";

import { AppButton } from "@/components/shared/AppButton";
import { AppInput } from "@/components/shared/AppInput";
import { AppSearchSelect } from "@/components/shared/AppSearchSelect";
import { Button } from "@/components/ui/button";
import {
  carCreateSchema,
  type CarCreateData,
  BRAND_OPTIONS,
  FUEL_OPTIONS,
  TRANSMISSION_OPTIONS,
  STATUS_OPTIONS,
  CATEGORY_OPTIONS,
} from "../data/car.schema";
import { CheckboxRow } from "./CheckBoxRow";
import { SectionCard } from "./SectionCard";

export type { CarCreateData, CarFormData } from "../data/car.schema";

interface CarFormProps {
  onSubmit: (data: CarCreateData) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export function CarForm({
  onSubmit,
  onCancel,
  isSubmitting = false,
}: CarFormProps) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<CarCreateData>({
    resolver: zodResolver(carCreateSchema),
    defaultValues: {
      is_public: false,
      is_b2b: false,
      is_b2c: false,
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <SectionCard
        icon={<Car className="size-4 text-brand-600 dark:text-silver-300" />}
        title="Informações do Veículo"
        description="Dados de identificação e características do veículo"
      >
        <AppInput
          label="Placa"
          placeholder="ABC-1D23"
          error={errors.plate?.message}
          {...register("plate")}
        />
        <AppInput
          label="Renavam"
          placeholder="Ex.: 01234567890"
          error={errors.renavam?.message}
          {...register("renavam")}
        />
        <AppInput
          label="Chassi"
          placeholder="Ex.: 9BR53ZEC2LB123456"
          error={errors.chassis?.message}
          {...register("chassis")}
        />

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
        <AppInput
          label="Motor"
          placeholder="Ex.: 2.0 Turbo"
          error={errors.engine?.message}
          {...register("engine")}
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

        <Controller
          name="category_id"
          control={control}
          render={({ field }) => (
            <AppSearchSelect
              label="Categoria"
              options={CATEGORY_OPTIONS}
              value={field.value}
              onChange={field.onChange}
              placeholder="Selecione..."
              error={errors.category_id?.message}
            />
          )}
        />
      </SectionCard>

      <SectionCard
        icon={
          <DollarSign className="size-4 text-brand-600 dark:text-silver-300" />
        }
        title="Precificação"
        description="Valores de venda e status inicial do veículo"
      >
        <AppInput
          label="Preço antigo"
          type="number"
          hint="Opcional"
          placeholder="Ex.: 120000"
          error={errors.old_price?.message}
          {...register("old_price")}
        />
        <AppInput
          label="Preço"
          type="number"
          placeholder="Ex.: 110000"
          error={errors.price?.message}
          {...register("price")}
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
              placeholder="Selecione..."
              error={errors.status?.message}
            />
          )}
        />
      </SectionCard>

      <SectionCard
        icon={<Globe className="size-4 text-brand-600 dark:text-silver-300" />}
        title="Publicação"
        description="Onde este veículo ficará visível"
        columns={1}
      >
        <div className="flex flex-col gap-3">
          <Controller
            name="is_public"
            control={control}
            render={({ field }) => (
              <CheckboxRow
                label="Publicar no site (público)"
                description="Veículo aparece no site institucional."
                checked={field.value}
                onChange={field.onChange}
              />
            )}
          />
          <Controller
            name="is_b2b"
            control={control}
            render={({ field }) => (
              <CheckboxRow
                label="Publicar para empresas (B2B)"
                description="Disponível no catálogo B2B."
                checked={field.value}
                onChange={field.onChange}
              />
            )}
          />
          <Controller
            name="is_b2c"
            control={control}
            render={({ field }) => (
              <CheckboxRow
                label="Publicar para clientes (B2C)"
                description="Disponível no catálogo B2C."
                checked={field.value}
                onChange={field.onChange}
              />
            )}
          />
        </div>
      </SectionCard>

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="w-full sm:w-auto"
        >
          Cancelar
        </Button>
        <AppButton
          type="submit"
          isLoading={isSubmitting}
          className="w-full sm:w-auto"
        >
          Criar e continuar
        </AppButton>
      </div>
    </form>
  );
}
