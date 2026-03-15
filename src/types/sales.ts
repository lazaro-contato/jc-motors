export type SaleStatus = "open" | "completed" | "canceled"

export interface SaleCar {
  id: number
  brand: string
  model: string
  plate: string
  year_model: number
}

export interface SaleCustomer {
  id: number
  full_name: string
  document: string
}

export interface SaleEmployee {
  id: number
  full_name: string
  role: string | null
}

export interface Sale extends Record<string, unknown> {
  id: number
  car: SaleCar
  customer: SaleCustomer
  employee: SaleEmployee
  sale_price: string
  status: SaleStatus
  notes: string | null
  sold_at: string | null
  created_at: string
  updated_at: string
}
