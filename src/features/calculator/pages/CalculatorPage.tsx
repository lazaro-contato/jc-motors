import { useState } from "react"
import { RotateCcw } from "lucide-react"
import { FormProvider } from "react-hook-form"

import { AppPageHeader } from "@/components/shared/AppPageHeader"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

import { CalculatorResults } from "../components/CalculatorResults"
import { CalculatorTabs } from "../components/CalculatorTabs"
import type { CalculatorTab } from "../data/calculator.schema"
import { useCalculator } from "../hooks/useCalculator"

export function CalculatorPage() {
  const [activeTab, setActiveTab] = useState<CalculatorTab>("vehicle")
  const { form, result, reset } = useCalculator()

  return (
    <div className="space-y-6">
      <AppPageHeader
        title="Calculadora"
        subtitle="Avalie a viabilidade da compra de um veículo."
        action={
          <Button type="button" variant="outline" onClick={reset}>
            <RotateCcw className="size-4" />
            Limpar dados
          </Button>
        }
      />

      <FormProvider {...form}>
        <Card>
          <CardContent className="pt-6">
            <CalculatorTabs value={activeTab} onValueChange={setActiveTab} />
          </CardContent>
        </Card>
      </FormProvider>

      <CalculatorResults result={result} />
    </div>
  )
}
