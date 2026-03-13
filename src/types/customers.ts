export type PersonType = "PF" | "PJ"
export type CustomerStatus = "active" | "inactive"

export interface Customer extends Record<string, unknown> {
  id: number
  full_name: string
  person_type: PersonType
  document: string
  email: string
  phone: string | null
  address: string | null
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface CreateCustomerDTO {
  full_name: string
  person_type: PersonType
  document: string
  email: string
  phone?: string
  address?: string
  is_active: boolean
}
