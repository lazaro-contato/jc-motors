/* ── Enums de entrada ────────────────────────────────────────────────────── */

export type CautelarStatus = "APROVADO" | "APONTAMENTO" | "REPROVADO" | "PENDENTE"

export type FunilariaNivel = "LEVE" | "MEDIA" | "PESADA"

/* ── Enums de saída ──────────────────────────────────────────────────────── */

export type RiscoCompra = "ALTO" | "MEDIO" | "BAIXO"

export type StatusKm = "APROVADO" | "REPROVADO"

export type Decisao =
  | "NAO_COMPRAR"
  | "FORA_SHOWROOM"
  | "COMPRAR"
  | "NEGOCIAR"
  | "SEM_MARGEM"

/* ── Parâmetros globais ──────────────────────────────────────────────────── */

/**
 * Parâmetros globais como o motor de cálculo os consome.
 * Percentuais aqui são SEMPRE decimais (0.07 = 7%).
 * A store guarda em pontos percentuais (7) — a conversão acontece no hook.
 */
export interface CalculatorSettings {
  anoRef: number
  impostoMargem: number
  metaEbitda: number
  negociarMin: number
  kmIdealAno: number
}

/* ── Entrada por veículo ─────────────────────────────────────────────────── */

export interface CalculatorInput {
  km: number
  anoFab: number
  /** Capturado mas ainda sem uso em nenhuma fórmula (spec §7.3). */
  anoMod: number
  fipe: number
  compra: number
  venda: number

  frete: number
  mecanica: number
  /** Custo de funilaria em R$ — distinto de `funilariaNivel` (spec §3, nota). */
  funilariaCusto: number
  eletrica: number
  higienizacao: number
  autoAvaliar: number
  cautelar: number
  vistoriaEntrada: number
  comissao: number
  despachante: number
  outros: number

  cautelarStatus: CautelarStatus
  funilariaNivel: FunilariaNivel
  pecasPintura: number
}

/* ── Resultado ───────────────────────────────────────────────────────────── */

export interface CalculatorResult {
  kmMax: number
  custosOperacionais: number
  margem: number
  imposto: number
  custoTotal: number
  equacaoFinal: number
  ebitda: number
  roi: number
  /** `null` quando a fórmula é indefinida (equivale ao SEERRO(...;"") do Excel). */
  pontoEquilibrio: number | null
  propostaMaxima: number | null
  diferencaNegociar: number | null
  riscoCompra: RiscoCompra
  statusKm: StatusKm
  decisao: Decisao
}
