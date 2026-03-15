import { z } from "zod"

export const employeeSchema = z.object({
  email:     z.string().email("E-mail inválido"),
  password:  z.string().min(8, "Senha deve ter ao menos 8 caracteres"),
  is_staff:  z.enum(["true", "false"]),
  full_name: z.string().min(2, "Nome completo é obrigatório"),
  role:      z.string().optional(),
  phone:     z.string().optional(),
  is_active: z.enum(["true", "false"]),
})

export type EmployeeFormData = z.infer<typeof employeeSchema>

/* ── Options ─────────────────────────────────────────────────────────────── */

export const ACCESS_LEVEL_OPTIONS = [
  { label: "Funcionário",     value: "false" },
  { label: "Administrador",   value: "true" },
]

export const STATUS_OPTIONS = [
  { label: "Ativo",   value: "true" },
  { label: "Inativo", value: "false" },
]
