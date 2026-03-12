export type ProviderStatus = "active" | "inactive"

export interface Provider {
  id: number
  name: string
  cnpj: string
  contact: string
  phone: string
  email: string
  city: string
  state: string
  status: ProviderStatus
  createdAt: string
}
