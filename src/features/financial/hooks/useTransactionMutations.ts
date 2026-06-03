import { useMutation, useQueryClient } from "@tanstack/react-query"

import { financialKeys } from "./queries"
import { financialService } from "../services/financial.service"

import type {
  CreateFinancialTransactionDTO,
  UpdateFinancialTransactionDTO,
} from "@/types/financial"

export function useCreateTransaction() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (dto: CreateFinancialTransactionDTO) =>
      financialService.create(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: financialKeys.all })
    },
  })
}

export function useUpdateTransaction() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      id,
      dto,
    }: {
      id: string
      dto: UpdateFinancialTransactionDTO
    }) => financialService.update(id, dto),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: financialKeys.all })
      queryClient.invalidateQueries({ queryKey: financialKeys.detail(id) })
    },
  })
}

export function useDeleteTransaction() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => financialService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: financialKeys.all })
    },
  })
}
