export interface Employee {
  id: string
  userId: string
  fullName: string
  phone: string | null
  role: string | null
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface CreateEmployeeDTO {
  userId: string
  fullName: string
  phone?: string
  role?: string
  isActive?: boolean
}

export type UpdateEmployeeDTO = Partial<Omit<CreateEmployeeDTO, "userId">>
