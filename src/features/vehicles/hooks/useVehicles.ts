import { useQuery } from "@tanstack/react-query"

import { vehiclesKeys } from "./queries"
import { vehiclesService } from "../services/vehicles.service"

import type { PaginationParams } from "@/types/pagination"

export function useVehicles(params: PaginationParams = {}) {
  return useQuery({
    queryKey: vehiclesKeys.list(params),
    queryFn: () => vehiclesService.list(params),
  })
}
