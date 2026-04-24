import { useQuery } from "@tanstack/react-query"

// import { VehicleOptionalRepository } from "@/core/repositories/vehicle-optional-repository"
// import { api } from "@/lib/api"
import { getMockVehicleOptionalsPagination } from "@/features/cars/components/optionals/optionals-data"

import { vehicleOptionalKeys } from "./queries"

// const vehicleOptionalRepository = new VehicleOptionalRepository(api)

export function useGetOptionals() {
  return useQuery({
    queryKey: vehicleOptionalKeys.list(),
    queryFn: async () => {
      // return vehicleOptionalRepository.list()
      return getMockVehicleOptionalsPagination()
    },
  })
}
