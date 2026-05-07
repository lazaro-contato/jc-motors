export type State =
  | "RO" | "AC" | "AM" | "RR" | "PA" | "AP" | "TO"
  | "MA" | "PI" | "CE" | "RN" | "PB" | "PE" | "AL" | "SE" | "BA"
  | "MG" | "ES" | "RJ" | "SP"
  | "PR" | "SC" | "RS"
  | "MS" | "MT" | "GO" | "DF"

export interface City {
  id: string
  name: string
  state: State
  latitude: number
  longitude: number
  area: number
  createdAt: string
  updatedAt: string
}

export interface Address {
  id: string
  zipCode: string
  street: string
  number: string
  complement: string | null
  neighborhood: string
  latitude: number | null
  longitude: number | null
  cityId: string
  createdAt: string
  updatedAt: string
}
