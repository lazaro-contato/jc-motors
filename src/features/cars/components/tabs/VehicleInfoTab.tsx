import { Controller, useFormContext } from "react-hook-form"

import { AppInput } from "@/components/shared/AppInput"
import { AppSearchSelect } from "@/components/shared/AppSearchSelect"
import { useBrands } from "@/features/brands/hooks/useBrands"
import { useCategories } from "@/features/categories/hooks/useCategories"
import {
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

  const { data: brandsData } = useBrands({ limit: 100 })
  const { data: categoriesData } = useCategories({ limit: 100 })

  const brandOptions = brandsData?.data.map((b) => ({ label: b.name, value: b.id })) ?? []
  const categoryOptions = categoriesData?.data.map((c) => ({ label: c.name, value: c.id })) ?? []

  return (
    <div className="grid gap-4 md:grid-cols-3 md:gap-5">
      <AppInput label="Placa" error={errors.licensePlate?.message} {...register("licensePlate")} />
      <AppInput label="Renavam" error={errors.renavam?.message} {...register("renavam")} />
      <AppInput label="Chassi" error={errors.chassis?.message} {...register("chassis")} />

      <Controller
        name="brandId"
        control={control}
        render={({ field }) => (
          <AppSearchSelect
            label="Marca"
            options={brandOptions}
            value={field.value}
            onChange={field.onChange}
            placeholder="Selecione..."
            error={errors.brandId?.message}
          />
        )}
      />
      <AppInput label="Modelo" error={errors.model?.message} {...register("model")} />
      <AppInput label="Cor" error={errors.color?.message} {...register("color")} />

      <AppInput label="Ano de Fabricação" type="number" error={errors.manufactureYear?.message} {...register("manufactureYear")} />
      <AppInput label="Ano do Modelo" type="number" error={errors.modelYear?.message} {...register("modelYear")} />
      <AppInput label="Quilometragem" type="number" error={errors.mileage?.message} {...register("mileage")} />

      <Controller
        name="fuelType"
        control={control}
        render={({ field }) => (
          <AppSearchSelect
            label="Combustível"
            options={FUEL_OPTIONS}
            value={field.value}
            onChange={field.onChange}
            placeholder="Selecione..."
            error={errors.fuelType?.message}
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
        name="categoryId"
        control={control}
        render={({ field }) => (
          <AppSearchSelect
            label="Categoria"
            options={categoryOptions}
            value={field.value}
            onChange={field.onChange}
            placeholder="Selecione..."
            error={errors.categoryId?.message}
          />
        )}
      />
      <AppInput label="Preço antigo" type="number" hint="Opcional" error={errors.oldPrice?.message} {...register("oldPrice")} />
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
