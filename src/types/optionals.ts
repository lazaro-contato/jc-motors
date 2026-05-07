export interface VehicleOptional {
  id: string
  name: string
  isActive: boolean
  vehicleId: string | null
  createdAt: string
  updatedAt: string
}

export interface VehicleOptionalProfile {
  id: string
  name: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface CreateOptionalDTO {
  name: string
  vehicleId?: string
  isActive?: boolean
}

export type UpdateOptionalDTO = Partial<CreateOptionalDTO>

export interface CreateOptionalProfileDTO {
  name: string
  vehicleOptionalIds?: string[]
  isActive?: boolean
}

export type UpdateOptionalProfileDTO = Partial<CreateOptionalProfileDTO>
