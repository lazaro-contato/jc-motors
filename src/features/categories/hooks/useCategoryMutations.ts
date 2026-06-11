import { useMutation, useQueryClient } from "@tanstack/react-query"

import { categoriesKeys } from "./queries"
import { categoriesService } from "../services/categories.service"
import { vehiclesKeys } from "@/features/vehicles/hooks/queries"

import type { CreateCategoryDTO, UpdateCategoryDTO } from "@/types/category"

export function useCreateCategory() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (dto: CreateCategoryDTO) => categoriesService.create(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: categoriesKeys.all })
    },
  })
}

export function useUpdateCategory() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: UpdateCategoryDTO }) =>
      categoriesService.update(id, dto),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: categoriesKeys.all })
      queryClient.invalidateQueries({ queryKey: categoriesKeys.detail(id) })
      queryClient.invalidateQueries({ queryKey: vehiclesKeys.all })
    },
  })
}

export function useDeleteCategory() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => categoriesService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: categoriesKeys.all })
      queryClient.invalidateQueries({ queryKey: vehiclesKeys.all })
    },
  })
}
