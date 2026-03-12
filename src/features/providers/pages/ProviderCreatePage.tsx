import { useNavigate } from "@tanstack/react-router"
import { ArrowLeft } from "lucide-react"

import { Button } from "@/components/ui/button"
import { ProviderForm, type ProviderFormData } from "../components/ProviderForm"

export default function ProviderCreatePage() {
  const navigate = useNavigate()

  function handleSubmit(data: ProviderFormData) {
    // TODO: conectar ao serviço real
    console.warn("Criar fornecedor:", data)
    navigate({ to: "/providers" })
  }

  function handleCancel() {
    navigate({ to: "/providers" })
  }

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          className="size-9 rounded-xl text-muted-foreground"
          onClick={handleCancel}
        >
          <ArrowLeft className="size-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Novo Fornecedor
          </h1>
          <p className="mt-0.5 text-sm text-muted-foreground">
            Preencha os dados para cadastrar um novo fornecedor.
          </p>
        </div>
      </div>

      <ProviderForm
        onSubmit={handleSubmit}
        onCancel={handleCancel}
      />
    </div>
  )
}
