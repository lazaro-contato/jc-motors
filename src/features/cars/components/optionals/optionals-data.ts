import type { VehicleOptional } from "@/core/models/vehicle-optional"
import type { Pagination } from "@/core/models/pagination"

export interface OptionalItem {
  id: string
  name: string
}

export interface OptionalPreset {
  id: string
  name: string
  optionalIds: string[]
}

export const MOCK_OPTIONALS: OptionalItem[] = [
  { id: "1", name: "Ar Condicionado" },
  { id: "2", name: "Direção Hidráulica" },
  { id: "3", name: "Vidros Elétricos" },
  { id: "4", name: "Travas Elétricas" },
  { id: "5", name: "Airbag Frontal" },
  { id: "6", name: "Airbag Lateral" },
  { id: "7", name: "Freios ABS" },
  { id: "8", name: "Sensor de Estacionamento" },
  { id: "9", name: "Câmera de Ré" },
  { id: "10", name: "Central Multimídia" },
  { id: "11", name: "Bluetooth" },
  { id: "12", name: "Banco de Couro" },
  { id: "13", name: "Teto Solar" },
  { id: "14", name: "Rodas de Liga Leve" },
  { id: "15", name: "Faróis de LED" },
  { id: "16", name: "Piloto Automático" },
  { id: "17", name: "Controle de Tração" },
  { id: "18", name: "Alarme" },
  { id: "19", name: "Retrovisores Elétricos" },
  { id: "20", name: "Chave Presencial" },
]

/** Resposta paginada mock (mesmo formato da API) para desenvolvimento sem backend. */
export function getMockVehicleOptionalsPagination(): Pagination<VehicleOptional> {
  const now = new Date()
  return {
    count: MOCK_OPTIONALS.length,
    next: null,
    previous: null,
    results: MOCK_OPTIONALS.map((o) => ({
      id: Number(o.id),
      name: o.name,
      created_at: now,
      updated_at: now,
    })),
  }
}

export const MOCK_PRESETS: OptionalPreset[] = [
  {
    id: "basic",
    name: "Básico",
    optionalIds: ["1", "2", "3", "4", "18"],
  },
  {
    id: "comfort",
    name: "Conforto",
    optionalIds: ["1", "2", "3", "4", "10", "11", "12", "19", "20"],
  },
  {
    id: "safety",
    name: "Segurança",
    optionalIds: ["5", "6", "7", "8", "9", "17"],
  },
  {
    id: "full",
    name: "Completo",
    optionalIds: [
      "1", "2", "3", "4", "5", "6", "7", "8", "9", "10",
      "11", "12", "13", "14", "15", "16", "17", "18", "19", "20",
    ],
  },
]
