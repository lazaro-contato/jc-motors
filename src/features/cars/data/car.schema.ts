import { z } from "zod"

export const carSchema = z.object({
  brand:            z.string().min(1, "Selecione a marca"),
  model:            z.string().min(1, "Informe o modelo"),
  year_manufacture: z.coerce.number({ invalid_type_error: "Informe o ano" }).min(1900, "Ano inválido").max(2030, "Ano inválido"),
  year_model:       z.coerce.number({ invalid_type_error: "Informe o ano" }).min(1900, "Ano inválido").max(2030, "Ano inválido"),
  color:            z.string().min(1, "Informe a cor"),
  plate:            z.string().min(7, "Placa inválida"),
  chassis:          z.string().optional(),
  mileage:          z.coerce.number({ invalid_type_error: "Informe a quilometragem" }).min(0, "Quilometragem inválida"),
  fuel:             z.string().min(1, "Selecione o combustível"),
  transmission:     z.string().min(1, "Selecione o câmbio"),
  purchase_price:   z.coerce.number({ invalid_type_error: "Informe o preço" }).positive("Preço deve ser positivo"),
  sale_price:       z.coerce.number({ invalid_type_error: "Informe o preço" }).positive("Preço deve ser positivo"),
  provider_id:      z.string().optional(),
  status:           z.string().min(1, "Selecione o status"),
  description:      z.string().optional(),
})

export type CarFormData = z.infer<typeof carSchema>

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
  { label: "Flex",       value: "Flex" },
  { label: "Gasolina",   value: "Gasolina" },
  { label: "Álcool",     value: "Álcool" },
  { label: "Diesel",     value: "Diesel" },
  { label: "Elétrico",   value: "Elétrico" },
  { label: "Híbrido",    value: "Híbrido" },
]

export const TRANSMISSION_OPTIONS = [
  { label: "Manual",      value: "Manual" },
  { label: "Automático",  value: "Automático" },
  { label: "CVT",         value: "CVT" },
  { label: "Automatizado", value: "Automatizado" },
]

export const STATUS_OPTIONS = [
  { label: "Disponível",    value: "available" },
  { label: "Em preparação", value: "preparing" },
  { label: "Reservado",     value: "reserved" },
  { label: "Vendido",       value: "sold" },
]

export const PROVIDER_OPTIONS = [
  { label: "Auto Peças São Paulo Ltda.",   value: "1" },
  { label: "Brasil Motors Importação",     value: "2" },
  { label: "Concessionária Premium SP",    value: "3" },
  { label: "Distribuidora Nacional Auto",  value: "4" },
]
