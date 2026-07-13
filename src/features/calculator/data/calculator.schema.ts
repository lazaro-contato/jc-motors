import { z } from "zod"

/* ── Helpers ─────────────────────────────────────────────────────────────── */

/**
 * Campo monetário/numérico: campo vazio conta como 0 (é uma calculadora, não
 * um cadastro). `z.coerce.number()` já resolve isso — Number("") === 0 — e,
 * ao contrário de `z.preprocess`, preserva o tipo de entrada, mantendo o
 * `zodResolver` corretamente tipado.
 */
const money = z.coerce.number().min(0, "Não pode ser negativo")

const year = z.coerce
  .number()
  .min(1900, "Ano inválido")
  .max(2100, "Ano inválido")

/* ── Schema ──────────────────────────────────────────────────────────────── */

export const calculatorSchema = z.object({
  // Referências do carro (spec §3)
  km:     money,
  anoFab: year,
  anoMod: year,
  fipe:   money,
  compra: money,
  venda:  money,

  // Custos operacionais (spec §5.1)
  frete:           money,
  mecanica:        money,
  funilariaCusto:  money,
  eletrica:        money,
  higienizacao:    money,
  autoAvaliar:     money,
  cautelar:        money,
  vistoriaEntrada: money,
  comissao:        money,
  despachante:     money,
  outros:          money,

  // Qualidade do carro (spec §3)
  cautelarStatus: z.enum(["APROVADO", "APONTAMENTO", "REPROVADO", "PENDENTE"]),
  funilariaNivel: z.enum(["LEVE", "MEDIA", "PESADA"]),
  pecasPintura:   z.coerce
    .number()
    .int("Deve ser inteiro")
    .min(0, "Não pode ser negativo"),
})

/**
 * `z.coerce` faz o tipo de ENTRADA dos campos numéricos ser `unknown` (o input
 * do DOM entrega string). Por isso o formulário é tipado com o input e o
 * resolver entrega o output já coagido — é o que mantém o `zodResolver`
 * corretamente tipado. Os enums seguem tipados normalmente nos dois lados.
 */
export type CalculatorFormInput = z.input<typeof calculatorSchema>

export type CalculatorFormData = z.output<typeof calculatorSchema>

/* ── Custos operacionais padrão ──────────────────────────────────────────── */

/**
 * Custos que já entram pré-preenchidos no formulário. São apenas o ponto de
 * partida — o usuário edita livremente por veículo.
 */
export const DEFAULT_COSTS = {
  frete:           1000,
  mecanica:        1000,
  funilariaCusto:  800,
  eletrica:        0,
  higienizacao:    400,
  autoAvaliar:     1000,
  cautelar:        125,
  vistoriaEntrada: 125,
  comissao:        1000,
  despachante:     350,
  outros:          0,
} as const

/* ── Valores iniciais ────────────────────────────────────────────────────── */

export const CALCULATOR_FORM_DEFAULTS: CalculatorFormData = {
  km:     0,
  anoFab: new Date().getFullYear(),
  anoMod: new Date().getFullYear(),
  fipe:   0,
  compra: 0,
  venda:  0,

  ...DEFAULT_COSTS,

  cautelarStatus: "PENDENTE",
  funilariaNivel: "LEVE",
  pecasPintura:   0,
}

/* ── Opções de select ────────────────────────────────────────────────────── */

export const CAUTELAR_STATUS_OPTIONS = [
  { label: "Pendente",    value: "PENDENTE" },
  { label: "Aprovado",    value: "APROVADO" },
  { label: "Apontamento", value: "APONTAMENTO" },
  { label: "Reprovado",   value: "REPROVADO" },
]

export const FUNILARIA_NIVEL_OPTIONS = [
  { label: "Leve",   value: "LEVE" },
  { label: "Média",  value: "MEDIA" },
  { label: "Pesada", value: "PESADA" },
]

/* ── Custos operacionais (para renderizar em loop) ───────────────────────── */

export const COST_FIELDS = [
  { name: "frete",           label: "Frete" },
  { name: "mecanica",        label: "Mecânica" },
  { name: "funilariaCusto",  label: "Funilaria" },
  { name: "eletrica",        label: "Elétrica" },
  { name: "higienizacao",    label: "Higienização" },
  { name: "autoAvaliar",     label: "Autoavaliação" },
  { name: "cautelar",        label: "Vistoria Cautelar" },
  { name: "vistoriaEntrada", label: "Vistoria de Entrada" },
  { name: "comissao",        label: "Comissão" },
  { name: "despachante",     label: "Despachante" },
  { name: "outros",          label: "Outros" },
] as const satisfies ReadonlyArray<{
  name: keyof CalculatorFormData
  label: string
}>

/* ── Tabs ────────────────────────────────────────────────────────────────── */

export type CalculatorTab = "vehicle" | "settings"

export const CALCULATOR_TABS: { id: CalculatorTab; label: string }[] = [
  { id: "vehicle",  label: "Dados do Veículo" },
  { id: "settings", label: "Configurações" },
]
