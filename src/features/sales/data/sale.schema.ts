import { z } from "zod"

export const saleSchema = z.object({
  car_id:      z.string().min(1, "Selecione um veículo"),
  customer_id: z.string().min(1, "Selecione um cliente"),
  employee_id: z.string().min(1, "Selecione um vendedor"),
  sale_price:  z.coerce.number({ invalid_type_error: "Informe o valor da venda" }).positive("Valor deve ser positivo"),
  notes:       z.string().optional(),
})

export type SaleFormData = z.infer<typeof saleSchema>
