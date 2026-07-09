import { z } from "zod"

/* ── Create schema ───────────────────────────────────────────────────────── */

export const vehicleCreateSchema = z.object({
  providerId:      z.string().min(1, "Selecione o fornecedor"),
  licensePlate:    z.string().min(7, "Placa inválida"),
  renavam:         z.string().min(1, "Informe o Renavam"),
  chassis:         z.string().min(1, "Informe o chassi"),
  brandId:         z.string().min(1, "Selecione a marca"),
  model:           z.string().min(1, "Informe o modelo"),
  color:           z.string().min(1, "Informe a cor"),
  manufactureYear: z.coerce.number().min(1900, "Ano inválido").max(2030, "Ano inválido"),
  modelYear:       z.coerce.number().min(1900, "Ano inválido").max(2030, "Ano inválido"),
  mileage:         z.coerce.number().min(0, "Quilometragem inválida"),
  fuelType:        z.enum(["FLEX", "GASOLINE", "ETHANOL", "DIESEL", "ELECTRIC", "HYBRID", "GNV"], {
                     errorMap: () => ({ message: "Selecione o combustível" }),
                   }),
  engine:          z.string().min(1, "Informe o motor"),
  transmission:    z.enum(["MANUAL", "AUTOMATIC", "CVT", "SEMI_AUTO", "DUAL_CLUTCH"], {
                     errorMap: () => ({ message: "Selecione o câmbio" }),
                   }),
  categoryId:      z.string().min(1, "Selecione a categoria"),
  oldPrice:        z.preprocess((v) => (v === "" || v == null ? undefined : v), z.coerce.number().positive().optional()),
  price:           z.preprocess((v) => (v === "" || v == null ? undefined : v), z.coerce.number().positive("Preço inválido").optional()),
  isPublished:     z.boolean().default(false),
  isB2bVisible:    z.boolean().default(false),
  isB2cVisible:    z.boolean().default(false),
  status:          z.enum(
                     ["AWAITING_RELEASE", "IN_TRANSIT", "IN_YARD", "AVAILABLE", "RESERVED", "SOLD", "IN_PREPARATION"],
                     { errorMap: () => ({ message: "Selecione o status" }) },
                   ).optional(),
})

export type VehicleCreateData = z.infer<typeof vehicleCreateSchema>

/* ── Edit schema ─────────────────────────────────────────────────────────── */

export const vehicleEditSchema = vehicleCreateSchema.extend({
  providerId:       z.string().optional(),
  price:            z.coerce.number().positive("Preço inválido"),
  status:           z.enum(
                      ["AWAITING_RELEASE", "IN_TRANSIT", "IN_YARD", "AVAILABLE", "RESERVED", "SOLD", "IN_PREPARATION"],
                      { errorMap: () => ({ message: "Selecione o status" }) },
                    ),
  optionals:        z.array(z.string()).default([]),
  negotiationNotes: z.string().optional(),
  discount:         z.preprocess((v) => (v === "" || v == null ? undefined : v), z.coerce.number().min(0).optional()),
  purchasePrice:    z.preprocess((v) => (v === "" || v == null ? undefined : v), z.coerce.number().min(0).optional()),
  repairCost:       z.preprocess((v) => (v === "" || v == null ? undefined : v), z.coerce.number().min(0).optional()),
})

export type VehicleEditData = z.infer<typeof vehicleEditSchema>

/* ── Backwards compat ────────────────────────────────────────────────────── */

export const vehicleSchema = vehicleCreateSchema
export type VehicleFormData = VehicleCreateData

/* ── Select options ──────────────────────────────────────────────────────── */

export const FUEL_OPTIONS = [
  { label: "Flex",           value: "FLEX" },
  { label: "Gasolina",       value: "GASOLINE" },
  { label: "Álcool",         value: "ETHANOL" },
  { label: "Diesel",         value: "DIESEL" },
  { label: "Elétrico",       value: "ELECTRIC" },
  { label: "Híbrido",        value: "HYBRID" },
  { label: "GNV",            value: "GNV" },
]

export const TRANSMISSION_OPTIONS = [
  { label: "Manual",          value: "MANUAL" },
  { label: "Automático",      value: "AUTOMATIC" },
  { label: "CVT",             value: "CVT" },
  { label: "Semi-automático", value: "SEMI_AUTO" },
  { label: "Dupla Embreagem", value: "DUAL_CLUTCH" },
]

export const STATUS_OPTIONS = [
  { label: "Disponível",           value: "AVAILABLE" },
  { label: "Aguardando Liberação", value: "AWAITING_RELEASE" },
  { label: "Em Trânsito",          value: "IN_TRANSIT" },
  { label: "No Pátio",             value: "IN_YARD" },
  { label: "Em Preparação",        value: "IN_PREPARATION" },
  { label: "Reservado",            value: "RESERVED" },
  { label: "Vendido",              value: "SOLD" },
]

/* ── Steps ───────────────────────────────────────────────────────────────── */

export type VehicleStep = "vehicle" | "optionals" | "negotiation" | "costs"

export const VEHICLE_STEPS: { id: VehicleStep; label: string }[] = [
  { id: "vehicle",     label: "Informações do Veículo" },
  { id: "optionals",   label: "Opcionais" },
  { id: "negotiation", label: "Negociação" },
  { id: "costs",       label: "Custos" },
]
