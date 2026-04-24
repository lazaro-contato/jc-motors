import { useMutation, useQueryClient } from "@tanstack/react-query"

import type { CreateVehicleOptionalDto } from "@/core/dto/create-vehicle-optional.dto"
import type { VehicleOptional } from "@/core/models/vehicle-optional"
import type { Pagination } from "@/core/models/pagination"
import { VehicleOptionalRepository } from "@/core/repositories/vehicle-optional-repository"
import { api } from "@/lib/api"

import { vehicleOptionalKeys } from "./queries"

const vehicleOptionalRepository = new VehicleOptionalRepository(api)

export function useCreateOptional() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (dto: CreateVehicleOptionalDto) => vehicleOptionalRepository.create(dto),
    onSuccess: (created) => {
      const key = vehicleOptionalKeys.list()
      const previous = queryClient.getQueryData<Pagination<VehicleOptional>>(key)
      if (previous) {
        queryClient.setQueryData<Pagination<VehicleOptional>>(key, {
          ...previous,
          count: previous.count + 1,
          results: [...previous.results, created],
        })
      } else {
        void queryClient.invalidateQueries({ queryKey: key })
      }
    },
  })
}
