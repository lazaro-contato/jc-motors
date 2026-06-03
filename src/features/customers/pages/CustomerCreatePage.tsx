import { useNavigate } from "@tanstack/react-router"
import { toast } from "sonner"

import { AppPageHeader } from "@/components/shared/AppPageHeader"
import { CustomerForm, type CustomerFormData } from "../components/CustomerForm"
import { useCreateCustomer } from "../hooks/useCustomerMutations"

export function CustomerCreatePage() {
  const navigate = useNavigate()
  const createCustomer = useCreateCustomer()

  async function handleSubmit(data: CustomerFormData) {
    try {
      await createCustomer.mutateAsync({
        fullName:   data.full_name,
        personType: data.person_type,
        document:   data.document,
        email:      data.email,
        phone:      data.phone || undefined,
        isActive:   data.is_active === "true",
      })
      toast.success("Cliente cadastrado com sucesso")
      navigate({ to: "/customers" })
    } catch {
      toast.error("Erro ao cadastrar cliente")
    }
  }

  function handleCancel() {
    navigate({ to: "/customers" })
  }

  return (
    <div className="space-y-6">
      <AppPageHeader
        title="Novo Cliente"
        subtitle="Preencha os dados para cadastrar um novo cliente."
        onBack={handleCancel}
      />

      <CustomerForm
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        isSubmitting={createCustomer.isPending}
      />
    </div>
  )
}
