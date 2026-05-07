import type { VehicleOptional } from "@/core/models/vehicle-optional"
import type { VehicleOptionalProfile } from "@/core/models/vehicle-optional-profile"

const now = new Date()

let profiles: VehicleOptionalProfile[] = [
  { id: 1, name: "Básico", created_at: now, updated_at: now },
  { id: 2, name: "Conforto", created_at: now, updated_at: now },
  { id: 3, name: "Segurança", created_at: now, updated_at: now },
  { id: 4, name: "Completo", created_at: now, updated_at: now },
]

let optionals: VehicleOptional[] = [
  { id: 1, name: "Ar Condicionado", profile: profiles[0], created_at: now, updated_at: now },
  { id: 2, name: "Direção Hidráulica", profile: profiles[0], created_at: now, updated_at: now },
  { id: 3, name: "Vidros Elétricos", profile: profiles[1], created_at: now, updated_at: now },
  { id: 4, name: "Travas Elétricas", profile: profiles[1], created_at: now, updated_at: now },
  { id: 5, name: "Airbag Frontal", profile: profiles[2], created_at: now, updated_at: now },
  { id: 6, name: "Airbag Lateral", profile: profiles[2], created_at: now, updated_at: now },
  { id: 7, name: "Freios ABS", profile: profiles[2], created_at: now, updated_at: now },
  { id: 8, name: "Sensor de Estacionamento", profile: profiles[1], created_at: now, updated_at: now },
  { id: 9, name: "Câmera de Ré", profile: profiles[1], created_at: now, updated_at: now },
  { id: 10, name: "Central Multimídia", profile: profiles[1], created_at: now, updated_at: now },
  { id: 11, name: "Bluetooth", profile: profiles[1], created_at: now, updated_at: now },
  { id: 12, name: "Banco de Couro", profile: profiles[3], created_at: now, updated_at: now },
  { id: 13, name: "Teto Solar", profile: profiles[3], created_at: now, updated_at: now },
  { id: 14, name: "Rodas de Liga Leve", profile: null, created_at: now, updated_at: now },
  { id: 15, name: "Faróis de LED", profile: null, created_at: now, updated_at: now },
]

let nextOptionalId = optionals.length + 1
let nextProfileId = profiles.length + 1

export const optionalsStore = {
  /* ── Optionals ──────────────────────────────────────────────── */
  listOptionals(): VehicleOptional[] {
    return [...optionals]
  },

  createOptional(name: string, profileId: number | null): VehicleOptional {
    const created = new Date()
    const profile = profileId ? profiles.find((p) => p.id === profileId) ?? null : null
    const optional: VehicleOptional = {
      id: nextOptionalId++,
      name,
      profile,
      created_at: created,
      updated_at: created,
    }
    optionals = [...optionals, optional]
    return optional
  },

  updateOptional(id: number, name: string, profileId: number | null): VehicleOptional {
    const profile = profileId ? profiles.find((p) => p.id === profileId) ?? null : null
    let updated: VehicleOptional | undefined
    optionals = optionals.map((o) => {
      if (o.id !== id) return o
      updated = { ...o, name, profile, updated_at: new Date() }
      return updated
    })
    if (!updated) throw new Error(`Opcional ${id} não encontrado`)
    return updated
  },

  deleteOptional(id: number): void {
    optionals = optionals.filter((o) => o.id !== id)
  },

  /* ── Profiles ────────────────────────────────────────────────── */
  listProfiles(): VehicleOptionalProfile[] {
    return [...profiles]
  },

  createProfile(name: string): VehicleOptionalProfile {
    const created = new Date()
    const profile: VehicleOptionalProfile = {
      id: nextProfileId++,
      name,
      created_at: created,
      updated_at: created,
    }
    profiles = [...profiles, profile]
    return profile
  },

  updateProfile(id: number, name: string): VehicleOptionalProfile {
    let updated: VehicleOptionalProfile | undefined
    profiles = profiles.map((p) => {
      if (p.id !== id) return p
      updated = { ...p, name, updated_at: new Date() }
      return updated
    })
    if (!updated) throw new Error(`Perfil ${id} não encontrado`)
    optionals = optionals.map((o) =>
      o.profile?.id === id ? { ...o, profile: updated! } : o,
    )
    return updated
  },

  deleteProfile(id: number): void {
    profiles = profiles.filter((p) => p.id !== id)
    optionals = optionals.map((o) =>
      o.profile?.id === id ? { ...o, profile: null } : o,
    )
  },

  countOptionalsByProfile(id: number): number {
    return optionals.filter((o) => o.profile?.id === id).length
  },
}
