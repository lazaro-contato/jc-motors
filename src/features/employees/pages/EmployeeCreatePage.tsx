import { useNavigate } from "@tanstack/react-router"
import { toast } from "sonner"

import { AppPageHeader } from "@/components/shared/AppPageHeader"
import { authService } from "@/features/auth/services/auth.service"
import { EmployeeForm, type EmployeeFormData } from "../components/EmployeeForm"
import { useCreateEmployee } from "../hooks/useEmployeeMutations"

export function EmployeeCreatePage() {
  const navigate = useNavigate()
  const createEmployee = useCreateEmployee()

  async function handleSubmit(data: EmployeeFormData) {
    try {
      const authResponse = await authService.signUp({ email: data.email, password: data.password })
      await createEmployee.mutateAsync({
        userId:   authResponse.user.id,
        fullName: data.full_name,
        phone:    data.phone || undefined,
        role:     data.role || undefined,
        isActive: data.is_active === "true",
      })
      toast.success("Funcionário cadastrado com sucesso")
      navigate({ to: "/employees" })
    } catch {
      toast.error("Erro ao cadastrar funcionário")
    }
  }

  function handleCancel() {
    navigate({ to: "/employees" })
  }

  return (
    <div className="space-y-6">
      <AppPageHeader
        title="Novo Funcionário"
        subtitle="Preencha os dados para cadastrar um novo funcionário."
        onBack={handleCancel}
      />

      <EmployeeForm
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        isSubmitting={createEmployee.isPending}
      />
    </div>
  )
}
