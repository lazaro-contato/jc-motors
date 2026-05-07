import { api } from "@/lib/api"
import type { Brand, CreateBrandDTO, UpdateBrandDTO } from "@/types/brand"
import type { Pagination, PaginationParams } from "@/types/pagination"

export const brandsService = {
  list: (params: PaginationParams = {}) =>
    api
      .get<Pagination<Brand>>("/brands", { params })
      .then((r) => r.data),

  getById: (id: string) =>
    api.get<Brand>(`/brands/${id}`).then((r) => r.data),

  create: (dto: CreateBrandDTO) =>
    api.post<Brand>("/brands", dto).then((r) => r.data),

  update: (id: string, dto: UpdateBrandDTO) =>
    api.patch<Brand>(`/brands/${id}`, dto).then((r) => r.data),

  delete: (id: string) =>
    api.delete<Brand>(`/brands/${id}`).then((r) => r.data),
}
