import { useQuery } from "@tanstack/react-query"

import { financialKeys } from "./queries"
import { financialService } from "../services/financial.service"

export function useTransaction(id: string) {
  return useQuery({
    queryKey: financialKeys.detail(id),
    queryFn: () => financialService.getById(id),
    enabled: !!id,
  })
}
