import { useQuery } from "@tanstack/react-query"

import { optionalProfilesKeys } from "./queries"
import { optionalProfilesService } from "../services/optional-profiles.service"

import type { PaginationParams } from "@/types/pagination"


export function useProfiles(params: PaginationParams = {}) {
  return useQuery({
    queryKey: optionalProfilesKeys.list(params),
    queryFn: () => optionalProfilesService.list(params),
  })
}
