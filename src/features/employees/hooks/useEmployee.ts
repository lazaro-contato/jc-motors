import { useQuery } from "@tanstack/react-query"

import { employeesKeys } from "./queries"
import { employeesService } from "../services/employees.service"

export function useEmployee(id: string) {
  return useQuery({
    queryKey: employeesKeys.detail(id),
    queryFn: () => employeesService.getById(id),
    enabled: !!id,
  })
}
