import { useQuery } from "@tanstack/react-query"

import { customersKeys } from "./queries"
import { customersService } from "../services/customers.service"

export function useCustomer(id: string) {
  return useQuery({
    queryKey: customersKeys.detail(id),
    queryFn: () => customersService.getById(id),
    enabled: !!id,
  })
}
