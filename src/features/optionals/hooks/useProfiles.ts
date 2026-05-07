import { useQuery } from "@tanstack/react-query"

import { optionalProfilesService } from "../services/optional-profiles.service"
import { optionalProfilesKeys } from "./queries"

export function useProfiles() {
  return useQuery({
    queryKey: optionalProfilesKeys.list(),
    queryFn: () => optionalProfilesService.list(),
  })
}
