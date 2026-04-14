import { Controller, useFormContext } from "react-hook-form"

import { AppInput } from "@/components/shared/AppInput"
import { AppSearchSelect } from "@/components/shared/AppSearchSelect"
import {
  BRAND_OPTIONS,
  CATEGORY_OPTIONS,
  FUEL_OPTIONS,
  STATUS_OPTIONS,
  TRANSMISSION_OPTIONS,
  type CarEditData,
} from "../../data/car.schema"

export function VehicleInfoTab() {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext<CarEditData>()

  return (
    <div className="grid gap-4 md:grid-cols-3 md:gap-5">
      <AppInput label="Placa" error={errors.plate?.message} {...register("plate")} />
      <AppInput label="Renavam" error={errors.renavam?.message} {...register("renavam")} />
      <AppInput label="Chassi" error={errors.chassis?.message} {...register("chassis")} />

      <Controller
        name="brand"
        control={control}
        render={({ field }) => (
          <AppSearchSelect
            label="Marca"
            options={BRAND_OPTIONS}
            value={field.value}
            onChange={field.onChange}
            placeholder="Selecione..."
            error={errors.brand?.message}
          />
        )}
      />
      <AppInput label="Modelo" error={errors.model?.message} {...register("model")} />
      <AppInput label="Cor" error={errors.color?.message} {...register("color")} />

      <AppInput label="Ano de Fabricação" type="number" error={errors.year_manufacture?.message} {...register("year_manufacture")} />
      <AppInput label="Ano do Modelo" type="number" error={errors.year_model?.message} {...register("year_model")} />
      <AppInput label="Quilometragem" type="number" error={errors.mileage?.message} {...register("mileage")} />

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
      <AppInput label="Motor" error={errors.engine?.message} {...register("engine")} />
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
      <AppInput label="Preço antigo" type="number" hint="Opcional" error={errors.old_price?.message} {...register("old_price")} />
      <AppInput label="Preço" type="number" error={errors.price?.message} {...register("price")} />

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
    </div>
  )
}
