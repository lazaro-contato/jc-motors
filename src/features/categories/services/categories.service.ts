import { api } from "@/lib/api"
import type {
  Category,
  CreateCategoryDTO,
  UpdateCategoryDTO,
} from "@/types/category"
import type { Pagination, PaginationParams } from "@/types/pagination"

export const categoriesService = {
  list: (params: PaginationParams = {}) =>
    api
      .get<Pagination<Category>>("/categories", { params })
      .then((r) => r.data),

  getById: (id: string) =>
    api.get<Category>(`/categories/${id}`).then((r) => r.data),

  create: (dto: CreateCategoryDTO) =>
    api.post<Category>("/categories", dto).then((r) => r.data),

  update: (id: string, dto: UpdateCategoryDTO) =>
    api.patch<Category>(`/categories/${id}`, dto).then((r) => r.data),

  delete: (id: string) =>
    api.delete<Category>(`/categories/${id}`).then((r) => r.data),
}
