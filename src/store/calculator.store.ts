import { create } from "zustand"
import { persist } from "zustand/middleware"

/**
 * Parâmetros globais da calculadora (spec §1).
 *
 * Os percentuais são guardados em PONTOS PERCENTUAIS (7 = 7%), que é como o
 * usuário digita. A conversão para decimal (0.07), que é o formato consumido
 * pelo motor de cálculo, acontece no `useCalculator`. Isso resolve o ponto em
 * aberto §7.2 do spec e evita erro de escala nas fórmulas.
 */
export interface CalculatorSettingsState {
  anoRef: number
  impostoMargemPct: number
  metaEbitdaPct: number
  negociarMinPct: number
  kmIdealAno: number
}

export const CALCULATOR_DEFAULTS: CalculatorSettingsState = {
  anoRef: new Date().getFullYear(),
  impostoMargemPct: 7,
  metaEbitdaPct: 8,
  negociarMinPct: 6,
  kmIdealAno: 15000,
}

interface CalculatorStore extends CalculatorSettingsState {
  setSetting: <K extends keyof CalculatorSettingsState>(
    key: K,
    value: CalculatorSettingsState[K],
  ) => void
  reset: () => void
}

export const useCalculatorStore = create<CalculatorStore>()(
  persist(
    (set) => ({
      ...CALCULATOR_DEFAULTS,
      setSetting: (key, value) => set({ [key]: value } as Partial<CalculatorStore>),
      reset: () => set({ ...CALCULATOR_DEFAULTS }),
    }),
    {
      name: "jcmotors-calculator-settings",
    },
  ),
)
