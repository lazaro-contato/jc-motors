import type {
  CreateOptionalProfileDTO,
  UpdateOptionalProfileDTO,
  VehicleOptionalProfile,
} from "@/types/optionals"
import type { Pagination, PaginationParams } from "@/types/pagination"

import { api } from "@/lib/api"

export const optionalProfilesService = {
  list: (params: PaginationParams = {}) =>
    api
      .get<Pagination<VehicleOptionalProfile>>("/optionals/profiles", {
        params,
      })
      .then((r) => r.data),

  getById: (id: string) =>
    api
      .get<VehicleOptionalProfile>(`/optionals/profiles/${id}`)
      .then((r) => r.data),

  create: (dto: CreateOptionalProfileDTO) =>
    api
      .post<VehicleOptionalProfile>("/optionals/profiles", dto)
      .then((r) => r.data),

  update: (id: string, dto: UpdateOptionalProfileDTO) =>
    api
      .patch<VehicleOptionalProfile>(`/optionals/profiles/${id}`, dto)
      .then((r) => r.data),

  delete: (id: string) =>
    api
      .delete<VehicleOptionalProfile>(`/optionals/profiles/${id}`)
      .then((r) => r.data),
}
