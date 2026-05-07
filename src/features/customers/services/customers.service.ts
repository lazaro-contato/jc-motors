import { api } from "@/lib/api"
import type {
  CreateCustomerDTO,
  Customer,
  UpdateCustomerDTO,
} from "@/types/customers"
import type { Pagination, PaginationParams } from "@/types/pagination"

export const customersService = {
  list: (params: PaginationParams = {}) =>
    api
      .get<Pagination<Customer>>("/customers", { params })
      .then((r) => r.data),

  getById: (id: string) =>
    api.get<Customer>(`/customers/${id}`).then((r) => r.data),

  create: (dto: CreateCustomerDTO) =>
    api.post<Customer>("/customers", dto).then((r) => r.data),

  update: (id: string, dto: UpdateCustomerDTO) =>
    api.patch<Customer>(`/customers/${id}`, dto).then((r) => r.data),

  delete: (id: string) =>
    api.delete<Customer>(`/customers/${id}`).then((r) => r.data),
}
