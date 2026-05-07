import { api } from "@/lib/api"
import type {
  CreateFinancialTransactionDTO,
  FinancialTransaction,
  UpdateFinancialTransactionDTO,
} from "@/types/financial"
import type { Pagination, PaginationParams } from "@/types/pagination"

export const financialService = {
  list: (params: PaginationParams = {}) =>
    api
      .get<Pagination<FinancialTransaction>>("/financial", { params })
      .then((r) => r.data),

  getById: (id: string) =>
    api.get<FinancialTransaction>(`/financial/${id}`).then((r) => r.data),

  create: (dto: CreateFinancialTransactionDTO) =>
    api.post<FinancialTransaction>("/financial", dto).then((r) => r.data),

  update: (id: string, dto: UpdateFinancialTransactionDTO) =>
    api
      .patch<FinancialTransaction>(`/financial/${id}`, dto)
      .then((r) => r.data),

  delete: (id: string) =>
    api.delete<FinancialTransaction>(`/financial/${id}`).then((r) => r.data),
}
