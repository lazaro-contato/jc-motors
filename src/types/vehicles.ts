export type FuelType =
  | "FLEX"
  | "GASOLINE"
  | "ETHANOL"
  | "DIESEL"
  | "ELECTRIC"
  | "HYBRID"
  | "GNV"

export type TransmissionType =
  | "MANUAL"
  | "AUTOMATIC"
  | "CVT"
  | "SEMI_AUTO"
  | "DUAL_CLUTCH"

export type VehicleStatus =
  | "AWAITING_RELEASE"
  | "IN_TRANSIT"
  | "IN_YARD"
  | "SOLD"
  | "RESERVED"
  | "IN_PREPARATION"

export interface Vehicle {
  id: string
  licensePlate: string
  renavam: string
  chassis: string
  model: string
  color: string
  manufactureYear: number
  modelYear: number
  mileage: number
  fuelType: FuelType
  engine: string
  transmission: TransmissionType
  oldPrice: string | null
  price: string
  isPublished: boolean
  isB2bVisible: boolean
  isB2cVisible: boolean
  status: VehicleStatus
  brandId: string
  categoryId: string
  providerId: string
  createdAt: string
  updatedAt: string
}

export interface CreateVehicleDTO {
  licensePlate: string
  renavam: string
  chassis: string
  model: string
  color: string
  manufactureYear: number
  modelYear: number
  mileage: number
  fuelType: FuelType
  engine: string
  transmission: TransmissionType
  price: number
  oldPrice?: number
  brandId: string
  categoryId: string
  providerId: string
  status?: VehicleStatus
  isPublished?: boolean
  isB2bVisible?: boolean
  isB2cVisible?: boolean
}

export type UpdateVehicleDTO = Partial<CreateVehicleDTO>
