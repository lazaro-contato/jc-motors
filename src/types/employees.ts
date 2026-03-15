export interface EmployeeUser {
  id: number
  email: string
  is_active: boolean
  is_staff: boolean
  date_joined: string
}

export interface Employee {
  id: number
  user: EmployeeUser
  full_name: string
  phone: string | null
  role: string | null
  is_active: boolean
  created_at: string
  updated_at: string
}
