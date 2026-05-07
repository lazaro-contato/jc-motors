export type CustomerType = "PF" | "PJ"

export interface Customer {
  id: string
  userId: string | null
  fullName: string
  personType: CustomerType
  document: string
  email: string
  phone: string | null
  addressId: string | null
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface CreateCustomerDTO {
  fullName: string
  personType: CustomerType
  document: string
  email: string
  phone?: string
  userId?: string
  addressId?: string
  isActive?: boolean
}

export type UpdateCustomerDTO = Partial<CreateCustomerDTO>
