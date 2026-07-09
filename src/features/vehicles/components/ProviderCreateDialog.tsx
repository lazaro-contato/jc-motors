import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

import { AppButton } from "@/components/shared/AppButton"
import { AppCNPJInput } from "@/components/shared/AppCNPJInput"
import { AppInput } from "@/components/shared/AppInput"
import { AppPhoneInput } from "@/components/shared/AppPhoneInput"
import { AppSelect } from "@/components/shared/AppSelect"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  providerSchema,
  STATE_OPTIONS,
  type ProviderFormData,
} from "@/features/providers/data/provider.schema"

interface ProviderCreateDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onCreate: (data: ProviderFormData) => void
}

export function ProviderCreateDialog({
  open,
  onOpenChange,
  onCreate,
}: ProviderCreateDialogProps) {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ProviderFormData>({
    resolver: zodResolver(providerSchema),
    defaultValues: { status: "active" },
  })

  function submit(data: ProviderFormData) {
    onCreate(data)
    reset({ status: "active" })
  }

  function handleOpenChange(next: boolean) {
    if (!next) reset({ status: "active" })
    onOpenChange(next)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Novo Fornecedor</DialogTitle>
          <DialogDescription>
            Cadastre o fornecedor e continue com o veículo.
          </DialogDescription>
        </DialogHeader>

        <form
          id="provider-create-form"
          onSubmit={handleSubmit(submit)}
          className="grid gap-4 md:grid-cols-2"
        >
          <div className="md:col-span-2">
            <AppInput
              label="Razão Social"
              placeholder="Ex.: Auto Peças São Paulo Ltda."
              error={errors.name?.message}
              {...register("name")}
            />
          </div>
          <AppCNPJInput error={errors.cnpj?.message} {...register("cnpj")} />
          <AppInput
            label="Nome do Responsável"
            placeholder="Ex.: João da Silva"
            error={errors.contact?.message}
            {...register("contact")}
          />
          <AppInput
            label="E-mail"
            type="email"
            placeholder="contato@empresa.com.br"
            error={errors.email?.message}
            {...register("email")}
          />
          <AppPhoneInput error={errors.phone?.message} {...register("phone")} />
          <AppInput
            label="Cidade"
            placeholder="Ex.: São Paulo"
            error={errors.city?.message}
            {...register("city")}
          />
          <AppSelect
            label="UF"
            options={STATE_OPTIONS}
            value={watch("state") ?? ""}
            onValueChange={(v) => setValue("state", v, { shouldValidate: true })}
            placeholder="Estado"
            error={errors.state?.message}
          />
        </form>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => handleOpenChange(false)}
          >
            Cancelar
          </Button>
          <AppButton type="submit" form="provider-create-form">
            Cadastrar Fornecedor
          </AppButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
