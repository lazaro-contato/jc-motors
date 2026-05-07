import { api } from "@/lib/api"
import type { Pagination, PaginationParams } from "@/types/pagination"
import type {
  CreateVehicleDTO,
  UpdateVehicleDTO,
  Vehicle,
} from "@/types/cars"

export const vehiclesService = {
  list: (params: PaginationParams = {}) =>
    api
      .get<Pagination<Vehicle>>("/vehicles", { params })
      .then((r) => r.data),

  getById: (id: string) =>
    api.get<Vehicle>(`/vehicles/${id}`).then((r) => r.data),

  create: (dto: CreateVehicleDTO) =>
    api.post<Vehicle>("/vehicles", dto).then((r) => r.data),

  update: (id: string, dto: UpdateVehicleDTO) =>
    api.patch<Vehicle>(`/vehicles/${id}`, dto).then((r) => r.data),

  delete: (id: string) =>
    api.delete<Vehicle>(`/vehicles/${id}`).then((r) => r.data),
}
