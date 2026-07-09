import { useNavigate, useParams } from "@tanstack/react-router"
import { toast } from "sonner"

import { AppPageHeader } from "@/components/shared/AppPageHeader"
import { CustomerForm, type CustomerFormData } from "../components/CustomerForm"
import { useCustomer } from "../hooks/useCustomer"
import { useUpdateCustomer } from "../hooks/useCustomerMutations"

export function CustomerEditPage() {
  const navigate = useNavigate()
  const { id } = useParams({ strict: false }) as { id: string }

  const { data: customer, isPending: isLoading } = useCustomer(id)
  const updateCustomer = useUpdateCustomer()

  async function handleSubmit(data: CustomerFormData) {
    try {
      await updateCustomer.mutateAsync({
        id,
        dto: {
          fullName:   data.full_name,
          personType: data.person_type,
          document:   data.document,
          email:      data.email,
          phone:      data.phone || undefined,
          isActive:   data.is_active === "true",
        },
      })
      toast.success("Cliente atualizado com sucesso")
      navigate({ to: "/customers" })
    } catch {
      toast.error("Erro ao atualizar cliente")
    }
  }

  function handleCancel() {
    navigate({ to: "/customers" })
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <AppPageHeader
          title="Editar Cliente"
          subtitle="Carregando..."
          onBack={handleCancel}
        />
      </div>
    )
  }

  if (!customer) {
    return (
      <div className="space-y-6">
        <AppPageHeader
          title="Cliente não encontrado"
          subtitle="O cliente solicitado não existe ou foi removido."
          onBack={handleCancel}
        />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <AppPageHeader
        title={customer.fullName}
        subtitle="Edite os dados do cliente."
        onBack={handleCancel}
      />

      <CustomerForm
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        isSubmitting={updateCustomer.isPending}
        submitLabel="Salvar Alterações"
        defaultValues={{
          full_name:   customer.fullName,
          person_type: customer.personType,
          document:    customer.document,
          email:       customer.email,
          phone:       customer.phone ?? "",
          is_active:   customer.isActive ? "true" : "false",
        }}
      />
    </div>
  )
}
