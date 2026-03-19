export type FuelType = "Gasolina" | "Álcool" | "Flex" | "Diesel" | "Elétrico" | "Híbrido"
export type TransmissionType = "Manual" | "Automático" | "CVT" | "Automatizado"
export type VehicleStatus = "available" | "preparing" | "reserved" | "sold"

export interface CarBrand {
  id: number
  name: string
}

export interface CarModel {
  id: number
  name: string
  brand: CarBrand
}

export interface CarImage {
  id: number
  car: number
  image: string
  order: number
}

export interface Vehicle extends Record<string, unknown> {
  id: number
  car_model: CarModel
  year_manufacture: number
  year_model: number
  color: string
  mileage: number
  plate: string
  chassis: string | null
  fuel: FuelType | null
  transmission: TransmissionType | null
  purchase_price: string
  sale_price: string
  status: VehicleStatus
  description: string | null
  cover_image: string | null
  images: CarImage[]
  provider: number | null
  created_at: string
  updated_at: string
}
