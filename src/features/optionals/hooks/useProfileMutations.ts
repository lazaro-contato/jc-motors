import { useMutation, useQueryClient } from "@tanstack/react-query"

import { optionalProfilesKeys, optionalsKeys } from "./queries"
import { optionalProfilesService } from "../services/optional-profiles.service"

import type {
  CreateOptionalProfileDTO,
  UpdateOptionalProfileDTO,
} from "@/types/optionals"


export function useCreateProfile() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (dto: CreateOptionalProfileDTO) =>
      optionalProfilesService.create(dto),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: optionalProfilesKeys.all })
    },
  })
}

export interface UpdateProfileVariables {
  id: string
  dto: UpdateOptionalProfileDTO
}

export function useUpdateProfile() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, dto }: UpdateProfileVariables) =>
      optionalProfilesService.update(id, dto),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: optionalProfilesKeys.all })
      void queryClient.invalidateQueries({ queryKey: optionalsKeys.all })
    },
  })
}

export function useDeleteProfile() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => optionalProfilesService.delete(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: optionalProfilesKeys.all })
      void queryClient.invalidateQueries({ queryKey: optionalsKeys.all })
    },
  })
}
