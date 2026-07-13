import { RotateCcw } from "lucide-react"

import { AppInput } from "@/components/shared/AppInput"
import { Button } from "@/components/ui/button"
import { useCalculatorStore } from "@/store/calculator.store"

import { FieldGroup } from "../FieldGroup"

export function SettingsTab() {
  const {
    anoRef,
    impostoMargemPct,
    metaEbitdaPct,
    negociarMinPct,
    kmIdealAno,
    setSetting,
    reset,
  } = useCalculatorStore()

  return (
    <div className="space-y-8">
      <FieldGroup
        title="Parâmetros Globais"
        description="Valem para todos os cálculos. As alterações são salvas automaticamente e refletem nos resultados na hora."
      >
        <AppInput
          label="Ano de Referência"
          type="number"
          hint="Usado no cálculo do KM Máximo"
          value={anoRef}
          onChange={(e) => setSetting("anoRef", Number(e.target.value) || 0)}
        />
        <AppInput
          label="KM Ideal por Ano"
          type="number"
          hint="Padrão: 15.000 km"
          value={kmIdealAno}
          onChange={(e) => setSetting("kmIdealAno", Number(e.target.value) || 0)}
        />
        <AppInput
          label="Imposto sobre a Margem (%)"
          type="number"
          hint="Padrão: 7%"
          value={impostoMargemPct}
          onChange={(e) =>
            setSetting("impostoMargemPct", Number(e.target.value) || 0)
          }
        />

        <AppInput
          label="Meta de EBITDA (%)"
          type="number"
          hint="Acima disso a decisão é Comprar"
          value={metaEbitdaPct}
          onChange={(e) =>
            setSetting("metaEbitdaPct", Number(e.target.value) || 0)
          }
        />
        <AppInput
          label="EBITDA Mínimo p/ Negociar (%)"
          type="number"
          hint="Abaixo disso a decisão é Sem Margem"
          value={negociarMinPct}
          onChange={(e) =>
            setSetting("negociarMinPct", Number(e.target.value) || 0)
          }
        />
      </FieldGroup>

      <div className="flex justify-end">
        <Button type="button" variant="outline" onClick={reset}>
          <RotateCcw className="size-4" />
          Restaurar padrões
        </Button>
      </div>
    </div>
  )
}
