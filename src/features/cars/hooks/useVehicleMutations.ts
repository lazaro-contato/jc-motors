import { useMutation, useQueryClient } from "@tanstack/react-query"

import { vehiclesKeys } from "./queries"
import { vehiclesService } from "../services/vehicles.service"
import { brandsKeys } from "@/features/brands/hooks/queries"
import { categoriesKeys } from "@/features/categories/hooks/queries"

import type { CreateVehicleDTO, UpdateVehicleDTO } from "@/types/cars"

export function useCreateVehicle() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (dto: CreateVehicleDTO) => vehiclesService.create(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: vehiclesKeys.all })
    },
  })
}

export function useUpdateVehicle() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: UpdateVehicleDTO }) =>
      vehiclesService.update(id, dto),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: vehiclesKeys.all })
      queryClient.invalidateQueries({ queryKey: vehiclesKeys.detail(id) })
    },
  })
}

export function useDeleteVehicle() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => vehiclesService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: vehiclesKeys.all })
      queryClient.invalidateQueries({ queryKey: brandsKeys.all })
      queryClient.invalidateQueries({ queryKey: categoriesKeys.all })
    },
  })
}
