import { z } from "zod"

/* ── Create schema ───────────────────────────────────────────────────────── */

export const carCreateSchema = z.object({
  plate:            z.string().min(7, "Placa inválida"),
  renavam:          z.string().min(1, "Informe o Renavam"),
  chassis:          z.string().min(1, "Informe o chassi"),
  brand:            z.string().min(1, "Selecione a marca"),
  model:            z.string().min(1, "Informe o modelo"),
  color:            z.string().min(1, "Informe a cor"),
  year_manufacture: z.coerce.number().min(1900, "Ano inválido").max(2030, "Ano inválido"),
  year_model:       z.coerce.number().min(1900, "Ano inválido").max(2030, "Ano inválido"),
  mileage:          z.coerce.number().min(0, "Quilometragem inválida"),
  fuel:             z.string().min(1, "Selecione o combustível"),
  engine:           z.string().min(1, "Informe o motor"),
  transmission:     z.string().min(1, "Selecione o câmbio"),
  category_id:      z.string().min(1, "Selecione a categoria"),
  old_price:        z.preprocess((v) => (v === "" || v == null ? undefined : v), z.coerce.number().positive().optional()),
  price:            z.coerce.number().positive("Preço inválido"),
  is_public:        z.boolean().default(false),
  is_b2b:           z.boolean().default(false),
  is_b2c:           z.boolean().default(false),
  status:           z.string().min(1, "Selecione o status"),
})

export type CarCreateData = z.infer<typeof carCreateSchema>

/* ── Edit schema ─────────────────────────────────────────────────────────── */

export const carEditSchema = carCreateSchema.extend({
  // Opcionais (placeholder — será expandido futuramente)
  optionals:        z.array(z.string()).default([]),
  // Negociação
  negotiation_notes: z.string().optional(),
  discount:          z.preprocess((v) => (v === "" || v == null ? undefined : v), z.coerce.number().min(0).optional()),
  // Custos
  purchase_price:    z.preprocess((v) => (v === "" || v == null ? undefined : v), z.coerce.number().min(0).optional()),
  repair_cost:       z.preprocess((v) => (v === "" || v == null ? undefined : v), z.coerce.number().min(0).optional()),
})

export type CarEditData = z.infer<typeof carEditSchema>

/* ── Backwards compat ────────────────────────────────────────────────────── */

export const carSchema = carCreateSchema
export type CarFormData = CarCreateData

/* ── Opções de select ────────────────────────────────────────────────────── */

export const BRAND_OPTIONS = [
  { label: "BMW",        value: "BMW" },
  { label: "Chevrolet",  value: "Chevrolet" },
  { label: "Fiat",       value: "Fiat" },
  { label: "Ford",       value: "Ford" },
  { label: "Honda",      value: "Honda" },
  { label: "Hyundai",    value: "Hyundai" },
  { label: "Jeep",       value: "Jeep" },
  { label: "Nissan",     value: "Nissan" },
  { label: "Renault",    value: "Renault" },
  { label: "Toyota",     value: "Toyota" },
  { label: "Volkswagen", value: "Volkswagen" },
]

export const FUEL_OPTIONS = [
  { label: "Flex",     value: "Flex" },
  { label: "Gasolina", value: "Gasolina" },
  { label: "Álcool",   value: "Álcool" },
  { label: "Diesel",   value: "Diesel" },
  { label: "Elétrico", value: "Elétrico" },
  { label: "Híbrido",  value: "Híbrido" },
]

export const TRANSMISSION_OPTIONS = [
  { label: "Manual",       value: "Manual" },
  { label: "Automático",   value: "Automático" },
  { label: "CVT",          value: "CVT" },
  { label: "Automatizado", value: "Automatizado" },
]

export const STATUS_OPTIONS = [
  { label: "Disponível",    value: "available" },
  { label: "Em preparação", value: "preparing" },
  { label: "Reservado",     value: "reserved" },
  { label: "Vendido",       value: "sold" },
]

export const CATEGORY_OPTIONS = [
  { label: "Hatch",    value: "1" },
  { label: "Sedan",    value: "2" },
  { label: "SUV",      value: "3" },
  { label: "Picape",   value: "4" },
  { label: "Esportivo", value: "5" },
]

export const PROVIDER_OPTIONS = [
  { label: "Auto Peças São Paulo Ltda.",  value: "1" },
  { label: "Brasil Motors Importação",    value: "2" },
  { label: "Concessionária Premium SP",   value: "3" },
  { label: "Distribuidora Nacional Auto", value: "4" },
]

/* ── Steps pendentes ─────────────────────────────────────────────────────── */

export type CarStep = "vehicle" | "optionals" | "negotiation" | "costs"

export const CAR_STEPS: { id: CarStep; label: string }[] = [
  { id: "vehicle",     label: "Informações do Veículo" },
  { id: "optionals",   label: "Opcionais" },
  { id: "negotiation", label: "Negociação" },
  { id: "costs",       label: "Custos" },
]
