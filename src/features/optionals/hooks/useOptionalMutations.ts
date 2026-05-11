import { useMutation, useQueryClient } from "@tanstack/react-query"

import { optionalsKeys } from "./queries"
import { optionalsService } from "../services/optionals.service"

import type {
  CreateOptionalDTO,
  UpdateOptionalDTO,
} from "@/types/optionals"


export function useCreateOptional() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (dto: CreateOptionalDTO) => optionalsService.create(dto),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: optionalsKeys.all })
    },
  })
}

export interface UpdateOptionalVariables {
  id: string
  dto: UpdateOptionalDTO
}

export function useUpdateOptional() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, dto }: UpdateOptionalVariables) =>
      optionalsService.update(id, dto),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: optionalsKeys.all })
    },
  })
}

export function useDeleteOptional() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => optionalsService.delete(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: optionalsKeys.all })
    },
  })
}
