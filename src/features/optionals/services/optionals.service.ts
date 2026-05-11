import type {
  CreateOptionalDTO,
  UpdateOptionalDTO,
  VehicleOptional,
} from "@/types/optionals"
import type { Pagination, PaginationParams } from "@/types/pagination"

import { api } from "@/lib/api"

export const optionalsService = {
  list: (params: PaginationParams = {}) =>
    api
      .get<Pagination<VehicleOptional>>("/optionals", { params })
      .then((r) => r.data),

  getById: (id: string) =>
    api.get<VehicleOptional>(`/optionals/${id}`).then((r) => r.data),

  create: (dto: CreateOptionalDTO) =>
    api.post<VehicleOptional>("/optionals", dto).then((r) => r.data),

  update: (id: string, dto: UpdateOptionalDTO) =>
    api.patch<VehicleOptional>(`/optionals/${id}`, dto).then((r) => r.data),

  delete: (id: string) =>
    api.delete<VehicleOptional>(`/optionals/${id}`).then((r) => r.data),
}
