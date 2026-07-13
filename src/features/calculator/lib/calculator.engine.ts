import type {
  CalculatorInput,
  CalculatorResult,
  CalculatorSettings,
  Decisao,
  RiscoCompra,
  StatusKm,
} from "@/types/calculator"

/* ── §2. KM Max ──────────────────────────────────────────────────────────── */

export function calcKmMax(
  anoRef: number,
  anoFab: number,
  kmIdealAno: number,
): number {
  const idade = Math.max(1, anoRef - anoFab + 1)
  return idade * kmIdealAno
}

/* ── §5.1. Custos operacionais ───────────────────────────────────────────── */

export function calcCustosOperacionais(input: CalculatorInput): number {
  return (
    input.frete +
    input.mecanica +
    input.funilariaCusto +
    input.eletrica +
    input.higienizacao +
    input.autoAvaliar +
    input.cautelar +
    input.vistoriaEntrada +
    input.comissao +
    input.despachante +
    input.outros
  )
}

/* ── §5.8. Ponto de equilíbrio ───────────────────────────────────────────── */

/**
 * Maior valor de compra que ainda entrega a meta de EBITDA.
 * Retorna `null` quando indefinido (impostoMargem = 100%), equivalendo ao
 * SEERRO(...; "") da planilha original.
 *
 * Precedência (spec §5.8, nota): a divisão por (1 - impostoMargem) aplica-se
 * apenas ao termo ((metaEbitda * venda) + custosOperacionais).
 */
export function calcPontoEquilibrio(
  venda: number,
  custosOperacionais: number,
  metaEbitda: number,
  impostoMargem: number,
): number | null {
  const denominador = 1 - impostoMargem
  if (denominador === 0) return null

  const resultado =
    venda - (metaEbitda * venda + custosOperacionais) / denominador

  return Number.isFinite(resultado) ? resultado : null
}

/* ── §4.1. Risco de compra ───────────────────────────────────────────────── */

export function calcRiscoCompra(input: CalculatorInput): RiscoCompra {
  if (input.cautelarStatus === "REPROVADO") return "ALTO"
  if (input.funilariaNivel === "PESADA") return "ALTO"

  if (
    input.cautelarStatus === "APONTAMENTO" ||
    input.funilariaNivel === "MEDIA" ||
    input.pecasPintura >= 3
  ) {
    return "MEDIO"
  }

  return "BAIXO"
}

/* ── §4.2. Status KM ─────────────────────────────────────────────────────── */

export function calcStatusKm(km: number, kmMax: number): StatusKm {
  return km <= kmMax ? "APROVADO" : "REPROVADO"
}

/* ── §4.3. Decisão ───────────────────────────────────────────────────────── */

export function calcDecisao(
  riscoCompra: RiscoCompra,
  statusKm: StatusKm,
  ebitda: number,
  metaEbitda: number,
  negociarMin: number,
): Decisao {
  if (riscoCompra === "ALTO") return "NAO_COMPRAR"
  if (statusKm === "REPROVADO") return "FORA_SHOWROOM"
  if (ebitda >= metaEbitda) return "COMPRAR"
  if (ebitda >= negociarMin) return "NEGOCIAR"
  return "SEM_MARGEM"
}

/* ── Orquestração (spec §6) ──────────────────────────────────────────────── */

/** Divisão protegida — evita Infinity/NaN quando o denominador é zero. */
function divide(numerador: number, denominador: number): number {
  if (denominador === 0) return 0
  const resultado = numerador / denominador
  return Number.isFinite(resultado) ? resultado : 0
}

export function calculate(
  input: CalculatorInput,
  settings: CalculatorSettings,
): CalculatorResult {
  const kmMax = calcKmMax(settings.anoRef, input.anoFab, settings.kmIdealAno)

  const custosOperacionais = calcCustosOperacionais(input)

  // §5.2 — o spec traz `compra - venda`, mas o sinal está invertido: essa
  // definição torna a margem negativa em toda operação lucrativa e é
  // incompatível com o Ponto de Equilíbrio (§5.8). Comprando exatamente no
  // ponto de equilíbrio, o EBITDA precisa igualar a meta — o que só acontece
  // com `venda - compra`. Confirmado com o time antes de implementar.
  const margem = input.venda - input.compra

  // §5.3 — imposto = margem * impostoMargem (o próprio spec afirma essa
  // equivalência na observação de 5.3).
  const imposto = margem * settings.impostoMargem

  const custoTotal = input.compra + custosOperacionais + imposto

  const equacaoFinal = margem - imposto - custosOperacionais

  const ebitda = divide(equacaoFinal, input.venda)
  const roi = divide(equacaoFinal, input.compra)

  const pontoEquilibrio = calcPontoEquilibrio(
    input.venda,
    custosOperacionais,
    settings.metaEbitda,
    settings.impostoMargem,
  )

  const propostaMaxima = pontoEquilibrio
  const diferencaNegociar =
    pontoEquilibrio === null ? null : input.compra - pontoEquilibrio

  const riscoCompra = calcRiscoCompra(input)
  const statusKm = calcStatusKm(input.km, kmMax)
  const decisao = calcDecisao(
    riscoCompra,
    statusKm,
    ebitda,
    settings.metaEbitda,
    settings.negociarMin,
  )

  return {
    kmMax,
    custosOperacionais,
    margem,
    imposto,
    custoTotal,
    equacaoFinal,
    ebitda,
    roi,
    pontoEquilibrio,
    propostaMaxima,
    diferencaNegociar,
    riscoCompra,
    statusKm,
    decisao,
  }
}
