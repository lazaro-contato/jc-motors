import { useEffect } from "react"
import { useNavigate, useParams } from "@tanstack/react-router"
import { zodResolver } from "@hookform/resolvers/zod"
import { FormProvider, useForm } from "react-hook-form"
import { Building2, MapPin, Phone } from "lucide-react"
import { toast } from "sonner"

import { AppButton } from "@/components/shared/AppButton"
import { AppPageHeader } from "@/components/shared/AppPageHeader"
import { AppUnsavedChangesDialog } from "@/components/shared/AppUnsavedChangesDialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useUnsavedChangesGuard } from "@/hooks/useUnsavedChangesGuard"

import { CompanyTab } from "../components/tabs/CompanyTab"
import { ContactTab } from "../components/tabs/ContactTab"
import { LocationTab } from "../components/tabs/LocationTab"
import { providerSchema, type ProviderFormData } from "../data/provider.schema"
import { PROVIDERS } from "../data/providers.mock"

export function ProviderEditPage() {
  const navigate = useNavigate()
  const { id } = useParams({ strict: false }) as { id: string }

  const provider = PROVIDERS.find((p) => p.id === Number(id))

  const form = useForm<ProviderFormData>({
    resolver: zodResolver(providerSchema),
  })

  useEffect(() => {
    if (!provider) return
    form.reset({
      name:    provider.name,
      cnpj:    provider.cnpj,
      contact: provider.contact,
      email:   provider.email,
      phone:   provider.phone,
      city:    provider.city,
      state:   provider.state,
      status:  provider.status,
    })
  }, [provider, form])

  const guard = useUnsavedChangesGuard(form.formState.isDirty)

  function handleSave(data: ProviderFormData) {
    // TODO: conectar ao serviço real
    console.warn("Atualizar fornecedor:", data)
    form.reset(data)
    toast.success("Alterações salvas")
  }

  function handleSaveAndExit() {
    form.handleSubmit((data) => {
      handleSave(data)
      navigate({ to: "/providers" })
    })()
  }

  function handleSaveAndContinue() {
    form.handleSubmit(handleSave)()
  }

  if (!provider) {
    return (
      <div className="space-y-6">
        <AppPageHeader
          title="Fornecedor não encontrado"
          subtitle="O fornecedor solicitado não existe ou foi removido."
          onBack={() => navigate({ to: "/providers" })}
        />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <AppPageHeader
        title={provider.name}
        subtitle={`CNPJ ${provider.cnpj} · edite os dados do fornecedor`}
        onBack={() => navigate({ to: "/providers" })}
      />

      <FormProvider {...form}>
        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3">
                <div className="flex size-9 items-center justify-center rounded-md bg-silver-100 dark:bg-silver-800">
                  <Building2 className="size-4 text-brand-600 dark:text-silver-300" />
                </div>
                <div>
                  <CardTitle className="text-base">Dados da Empresa</CardTitle>
                  <CardDescription>Informações jurídicas do fornecedor</CardDescription>
                </div>
              </div>
            </CardHeader>
            <Separator />
            <CardContent className="pt-5 md:pt-6">
              <CompanyTab />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3">
                <div className="flex size-9 items-center justify-center rounded-md bg-silver-100 dark:bg-silver-800">
                  <Phone className="size-4 text-brand-600 dark:text-silver-300" />
                </div>
                <div>
                  <CardTitle className="text-base">Contato</CardTitle>
                  <CardDescription>Responsável e informações de contato</CardDescription>
                </div>
              </div>
            </CardHeader>
            <Separator />
            <CardContent className="pt-5 md:pt-6">
              <ContactTab />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3">
                <div className="flex size-9 items-center justify-center rounded-md bg-silver-100 dark:bg-silver-800">
                  <MapPin className="size-4 text-brand-600 dark:text-silver-300" />
                </div>
                <div>
                  <CardTitle className="text-base">Localização</CardTitle>
                  <CardDescription>Cidade e estado de operação</CardDescription>
                </div>
              </div>
            </CardHeader>
            <Separator />
            <CardContent className="pt-5 md:pt-6">
              <LocationTab />
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate({ to: "/providers" })}
          >
            Cancelar
          </Button>
          <Button type="button" variant="outline" onClick={handleSaveAndExit}>
            Salvar e sair
          </Button>
          <AppButton type="button" onClick={handleSaveAndContinue}>
            Salvar e continuar
          </AppButton>
        </div>
      </FormProvider>

      <AppUnsavedChangesDialog
        open={guard.isBlocked}
        onOpenChange={(open) => !open && guard.cancel()}
        onConfirm={guard.confirm}
        onCancel={guard.cancel}
      />
    </div>
  )
}
