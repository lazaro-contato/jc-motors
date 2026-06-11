import { useQuery } from "@tanstack/react-query"

import { vehiclesKeys } from "./queries"
import { vehiclesService } from "../services/vehicles.service"

export function useVehicle(id: string) {
  return useQuery({
    queryKey: vehiclesKeys.detail(id),
    queryFn: () => vehiclesService.getById(id),
    enabled: !!id,
  })
}
