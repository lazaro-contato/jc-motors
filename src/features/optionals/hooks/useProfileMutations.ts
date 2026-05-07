import { useMutation, useQueryClient } from "@tanstack/react-query"

import type { CreateVehicleOptionalProfileDto } from "@/core/dto/create-vehicle-optional-profile.dto"
import type { UpdateVehicleOptionalProfileDto } from "@/core/dto/update-vehicle-optional-profile.dto"

import { optionalProfilesService } from "../services/optional-profiles.service"
import { optionalsKeys, optionalProfilesKeys } from "./queries"

export function useCreateProfile() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (dto: CreateVehicleOptionalProfileDto) =>
      optionalProfilesService.create(dto),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: optionalProfilesKeys.all })
    },
  })
}

export interface UpdateProfileVariables {
  id: number
  dto: UpdateVehicleOptionalProfileDto
}

export function useUpdateProfile() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, dto }: UpdateProfileVariables) =>
      optionalProfilesService.update(String(id), dto),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: optionalProfilesKeys.all })
      void queryClient.invalidateQueries({ queryKey: optionalsKeys.all })
    },
  })
}

export function useDeleteProfile() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => optionalProfilesService.delete(String(id)),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: optionalProfilesKeys.all })
      void queryClient.invalidateQueries({ queryKey: optionalsKeys.all })
    },
  })
}
