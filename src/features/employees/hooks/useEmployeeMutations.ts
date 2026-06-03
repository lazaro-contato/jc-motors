import { useMutation, useQueryClient } from "@tanstack/react-query"

import { employeesKeys } from "./queries"
import { employeesService } from "../services/employees.service"

import type { CreateEmployeeDTO, UpdateEmployeeDTO } from "@/types/employees"

export function useCreateEmployee() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (dto: CreateEmployeeDTO) => employeesService.create(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: employeesKeys.all })
    },
  })
}

export function useUpdateEmployee() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: UpdateEmployeeDTO }) =>
      employeesService.update(id, dto),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: employeesKeys.all })
      queryClient.invalidateQueries({ queryKey: employeesKeys.detail(id) })
    },
  })
}

export function useDeleteEmployee() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => employeesService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: employeesKeys.all })
    },
  })
}
