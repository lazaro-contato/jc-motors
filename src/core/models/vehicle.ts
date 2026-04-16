import type { FuelType } from "./fuel-type"
import type { TransmissionType } from "./transmission-type"
import type { VehicleStatus } from "./vehicle-status"

export interface Vehicle {
    id: number
    license_plate: string
    renavam: string
    chassis: string
    brand: string
    model: string
    color: string
    manufacture_year: number
    model_year: number
    mileage: number
    fuel_type: FuelType
    transmission: TransmissionType
    old_price: number | null
    price: number
    is_published: boolean
    is_b2b_visible: boolean
    is_b2c_visible: boolean
    status: VehicleStatus
    category_display: string
}