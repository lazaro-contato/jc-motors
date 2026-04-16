import type { City } from "./city"

export interface Address {
    id: number
    zip_code: string
    street: string
    number: string
    complement: string | null
    neighborhood: string
    latitude: number | null
    longitude: number | null
    city: City
}
