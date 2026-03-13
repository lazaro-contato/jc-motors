import { z } from "zod"

export const customerSchema = z.object({
  full_name:   z.string().min(2, "Nome completo é obrigatório"),
  person_type: z.enum(["PF", "PJ"]),
  document:    z.string().min(11, "Documento inválido"),
  email:       z.string().email("E-mail inválido"),
  phone:       z.string().optional(),
  address:     z.string().optional(),
  is_active:   z.enum(["true", "false"]),
})

export type CustomerFormData = z.infer<typeof customerSchema>

/* ── Options ─────────────────────────────────────────────────────────────── */

export const PERSON_TYPE_OPTIONS = [
  { label: "Pessoa Física (CPF)", value: "PF" },
  { label: "Pessoa Jurídica (CNPJ)", value: "PJ" },
]

export const STATUS_OPTIONS = [
  { label: "Ativo", value: "true" },
  { label: "Inativo", value: "false" },
]
