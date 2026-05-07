import { api } from "@/lib/api"
import type {
  CreateEmployeeDTO,
  Employee,
  UpdateEmployeeDTO,
} from "@/types/employees"
import type { Pagination, PaginationParams } from "@/types/pagination"

export const employeesService = {
  list: (params: PaginationParams = {}) =>
    api
      .get<Pagination<Employee>>("/employees", { params })
      .then((r) => r.data),

  getById: (id: string) =>
    api.get<Employee>(`/employees/${id}`).then((r) => r.data),

  create: (dto: CreateEmployeeDTO) =>
    api.post<Employee>("/employees", dto).then((r) => r.data),

  update: (id: string, dto: UpdateEmployeeDTO) =>
    api.patch<Employee>(`/employees/${id}`, dto).then((r) => r.data),

  delete: (id: string) =>
    api.delete<Employee>(`/employees/${id}`).then((r) => r.data),
}
