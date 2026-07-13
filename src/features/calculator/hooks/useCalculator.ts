import { useMemo } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, useWatch } from "react-hook-form"

import { useCalculatorStore } from "@/store/calculator.store"
import type { CalculatorInput, CalculatorSettings } from "@/types/calculator"

import {
  calculatorSchema,
  CALCULATOR_FORM_DEFAULTS,
  type CalculatorFormData,
  type CalculatorFormInput,
} from "../data/calculator.schema"
import { calculate } from "../lib/calculator.engine"

/**
 * Inputs numéricos do RHF entregam string. Como a calculadora recalcula a cada
 * tecla (inclusive com o formulário parcialmente preenchido), coagimos aqui em
 * vez de depender do parse do zod — campo vazio ou inválido vale 0.
 */
function toNumber(value: unknown): number {
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : 0
}

export function useCalculator() {
  const form = useForm<CalculatorFormInput, unknown, CalculatorFormData>({
    resolver: zodResolver(calculatorSchema),
    defaultValues: CALCULATOR_FORM_DEFAULTS,
    mode: "onChange",
  })

  const values = useWatch({ control: form.control })

  const { anoRef, impostoMargemPct, metaEbitdaPct, negociarMinPct, kmIdealAno } =
    useCalculatorStore()

  const result = useMemo(() => {
    const input: CalculatorInput = {
      km:     toNumber(values.km),
      anoFab: toNumber(values.anoFab),
      anoMod: toNumber(values.anoMod),
      fipe:   toNumber(values.fipe),
      compra: toNumber(values.compra),
      venda:  toNumber(values.venda),

      frete:           toNumber(values.frete),
      mecanica:        toNumber(values.mecanica),
      funilariaCusto:  toNumber(values.funilariaCusto),
      eletrica:        toNumber(values.eletrica),
      higienizacao:    toNumber(values.higienizacao),
      autoAvaliar:     toNumber(values.autoAvaliar),
      cautelar:        toNumber(values.cautelar),
      vistoriaEntrada: toNumber(values.vistoriaEntrada),
      comissao:        toNumber(values.comissao),
      despachante:     toNumber(values.despachante),
      outros:          toNumber(values.outros),

      cautelarStatus: values.cautelarStatus ?? "PENDENTE",
      funilariaNivel: values.funilariaNivel ?? "LEVE",
      pecasPintura:   toNumber(values.pecasPintura),
    }

    // A store guarda percentuais em pontos percentuais; o motor consome decimais.
    const settings: CalculatorSettings = {
      anoRef,
      impostoMargem: impostoMargemPct / 100,
      metaEbitda:    metaEbitdaPct / 100,
      negociarMin:   negociarMinPct / 100,
      kmIdealAno,
    }

    return calculate(input, settings)
  }, [
    values,
    anoRef,
    impostoMargemPct,
    metaEbitdaPct,
    negociarMinPct,
    kmIdealAno,
  ])

  function reset() {
    form.reset(CALCULATOR_FORM_DEFAULTS)
  }

  return { form, result, reset }
}
