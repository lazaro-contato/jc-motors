import { useMutation, useQueryClient } from "@tanstack/react-query"

import { brandsKeys } from "./queries"
import { brandsService } from "../services/brands.service"
import { vehiclesKeys } from "@/features/cars/hooks/queries"

import type { CreateBrandDTO, UpdateBrandDTO } from "@/types/brand"

export function useCreateBrand() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (dto: CreateBrandDTO) => brandsService.create(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: brandsKeys.all })
    },
  })
}

export function useUpdateBrand() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: UpdateBrandDTO }) =>
      brandsService.update(id, dto),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: brandsKeys.all })
      queryClient.invalidateQueries({ queryKey: brandsKeys.detail(id) })
      queryClient.invalidateQueries({ queryKey: vehiclesKeys.all })
    },
  })
}

export function useDeleteBrand() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => brandsService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: brandsKeys.all })
      queryClient.invalidateQueries({ queryKey: vehiclesKeys.all })
    },
  })
}
