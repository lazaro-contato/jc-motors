import { Controller, useFormContext } from "react-hook-form"

import { AppInput } from "@/components/shared/AppInput"
import { AppSelect } from "@/components/shared/AppSelect"

import {
  CAUTELAR_STATUS_OPTIONS,
  COST_FIELDS,
  FUNILARIA_NIVEL_OPTIONS,
  type CalculatorFormInput,
} from "../../data/calculator.schema"
import { FieldGroup } from "../FieldGroup"

export function VehicleDataTab() {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext<CalculatorFormInput>()

  return (
    <div className="space-y-8">
      <FieldGroup
        title="Referências do Veículo"
        description="Quilometragem, anos e valores de compra e venda"
      >
        <AppInput
          label="Quilometragem"
          type="number"
          placeholder="Ex.: 45000"
          error={errors.km?.message}
          {...register("km")}
        />
        <AppInput
          label="Ano de Fabricação"
          type="number"
          placeholder="Ex.: 2020"
          error={errors.anoFab?.message}
          {...register("anoFab")}
        />
        <AppInput
          label="Ano do Modelo"
          type="number"
          hint="Informativo — não entra nos cálculos"
          placeholder="Ex.: 2021"
          error={errors.anoMod?.message}
          {...register("anoMod")}
        />

        <AppInput
          label="Valor FIPE"
          type="number"
          placeholder="Ex.: 60000"
          error={errors.fipe?.message}
          {...register("fipe")}
        />
        <AppInput
          label="Valor de Compra"
          type="number"
          placeholder="Ex.: 50000"
          error={errors.compra?.message}
          {...register("compra")}
        />
        <AppInput
          label="Valor de Venda"
          type="number"
          placeholder="Ex.: 60000"
          error={errors.venda?.message}
          {...register("venda")}
        />
      </FieldGroup>

      <FieldGroup
        title="Custos Operacionais"
        description="Todos os custos somados no cálculo"
      >
        {COST_FIELDS.map((field) => (
          <AppInput
            key={field.name}
            label={field.label}
            type="number"
            placeholder="0"
            error={errors[field.name]?.message}
            {...register(field.name)}
          />
        ))}
      </FieldGroup>

      <FieldGroup
        title="Qualidade do Veículo"
        description="Define o risco de compra"
      >
        <Controller
          name="cautelarStatus"
          control={control}
          render={({ field }) => (
            <AppSelect
              label="Status da Cautelar"
              options={CAUTELAR_STATUS_OPTIONS}
              value={field.value}
              onValueChange={field.onChange}
              error={errors.cautelarStatus?.message}
            />
          )}
        />
        <Controller
          name="funilariaNivel"
          control={control}
          render={({ field }) => (
            <AppSelect
              label="Nível de Funilaria"
              options={FUNILARIA_NIVEL_OPTIONS}
              value={field.value}
              onValueChange={field.onChange}
              error={errors.funilariaNivel?.message}
            />
          )}
        />
        <AppInput
          label="Peças a Pintar"
          type="number"
          hint="3 ou mais eleva o risco"
          placeholder="0"
          error={errors.pecasPintura?.message}
          {...register("pecasPintura")}
        />
      </FieldGroup>
    </div>
  )
}
