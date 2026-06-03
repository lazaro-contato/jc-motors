import { useMutation, useQueryClient } from "@tanstack/react-query"

import { customersKeys } from "./queries"
import { customersService } from "../services/customers.service"

import type { CreateCustomerDTO, UpdateCustomerDTO } from "@/types/customers"

export function useCreateCustomer() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (dto: CreateCustomerDTO) => customersService.create(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: customersKeys.all })
    },
  })
}

export function useUpdateCustomer() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: UpdateCustomerDTO }) =>
      customersService.update(id, dto),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: customersKeys.all })
      queryClient.invalidateQueries({ queryKey: customersKeys.detail(id) })
    },
  })
}

export function useDeleteCustomer() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => customersService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: customersKeys.all })
    },
  })
}
