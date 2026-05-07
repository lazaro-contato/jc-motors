import { useQuery } from "@tanstack/react-query"

import type { PaginationParams } from "@/types/pagination"

import { optionalProfilesService } from "../services/optional-profiles.service"
import { optionalProfilesKeys } from "./queries"

export function useOptionalProfiles(params: PaginationParams = {}) {
  return useQuery({
    queryKey: optionalProfilesKeys.list(params),
    queryFn: () => optionalProfilesService.list(params),
  })
}
