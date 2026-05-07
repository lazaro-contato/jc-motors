import { useMutation, useQueryClient } from "@tanstack/react-query"

import type {
  CreateOptionalProfileDTO,
  UpdateOptionalProfileDTO,
} from "@/types/optionals"

import { optionalProfilesService } from "../services/optional-profiles.service"
import { optionalProfilesKeys, optionalsKeys } from "./queries"

export function useCreateOptionalProfile() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (dto: CreateOptionalProfileDTO) =>
      optionalProfilesService.create(dto),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: optionalProfilesKeys.all })
    },
  })
}

export interface UpdateOptionalProfileVariables {
  id: string
  dto: UpdateOptionalProfileDTO
}

export function useUpdateOptionalProfile() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, dto }: UpdateOptionalProfileVariables) =>
      optionalProfilesService.update(id, dto),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: optionalProfilesKeys.all })
      void queryClient.invalidateQueries({ queryKey: optionalsKeys.all })
    },
  })
}

export function useDeleteOptionalProfile() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => optionalProfilesService.delete(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: optionalProfilesKeys.all })
      void queryClient.invalidateQueries({ queryKey: optionalsKeys.all })
    },
  })
}
