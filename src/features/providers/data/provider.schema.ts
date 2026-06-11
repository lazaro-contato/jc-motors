import { z } from "zod"

export const providerSchema = z.object({
  name:    z.string().min(2, "Razão Social é obrigatória"),
  cnpj:    z.string().min(18, "CNPJ inválido"),
  contact: z.string().min(2, "Nome do responsável é obrigatório"),
  email:   z.string().email("E-mail inválido"),
  phone:   z.string().min(10, "Telefone inválido"),
  city:    z.string().min(2, "Cidade é obrigatória"),
  state:   z.string().length(2, "UF inválida"),
  status:  z.enum(["active", "inactive"]),
})

export type ProviderFormData = z.infer<typeof providerSchema>

/* ── Steps ───────────────────────────────────────────────────────────────── */

export type ProviderStep = "company" | "contact" | "location"

export const PROVIDER_STEPS: { id: ProviderStep; label: string }[] = [
  { id: "company",  label: "Empresa" },
  { id: "contact",  label: "Contato" },
  { id: "location", label: "Localização" },
]

/* ── Select options ──────────────────────────────────────────────────────── */

export const STATUS_OPTIONS = [
  { label: "Ativo",   value: "active" },
  { label: "Inativo", value: "inactive" },
]

export const STATE_OPTIONS = [
  "AC","AL","AM","AP","BA","CE","DF","ES","GO","MA",
  "MG","MS","MT","PA","PB","PE","PI","PR","RJ","RN",
  "RO","RR","RS","SC","SE","SP","TO",
].map((uf) => ({ label: uf, value: uf }))
