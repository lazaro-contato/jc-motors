import { useMutation, useQueryClient } from "@tanstack/react-query"

import type { UpdateVehicleOptionalDto } from "@/core/dto/update-vehicle-optional-dto"
import type { VehicleOptional } from "@/core/models/vehicle-optional"
import type { Pagination } from "@/core/models/pagination"
import { VehicleOptionalRepository } from "@/core/repositories/vehicle-optional-repository"
import { api } from "@/lib/api"

import { vehicleOptionalKeys } from "./queries"

const vehicleOptionalRepository = new VehicleOptionalRepository(api)

export interface UpdateOptionalVariables {
  id: number
  dto: UpdateVehicleOptionalDto
}

export function useUpdateOptional() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, dto }: UpdateOptionalVariables) =>
      vehicleOptionalRepository.update(id, dto),
    onSuccess: (updated) => {
      const key = vehicleOptionalKeys.list()
      const previous = queryClient.getQueryData<Pagination<VehicleOptional>>(key)
      if (previous) {
        queryClient.setQueryData<Pagination<VehicleOptional>>(key, {
          ...previous,
          results: previous.results.map((item) =>
            item.id === updated.id ? updated : item,
          ),
        })
      } else {
        void queryClient.invalidateQueries({ queryKey: key })
      }
    },
  })
}
