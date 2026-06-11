import { useNavigate } from "@tanstack/react-router"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { z } from "zod"

import { AppButton } from "@/components/shared/AppButton"
import { AppInput } from "@/components/shared/AppInput"
import { AppPageHeader } from "@/components/shared/AppPageHeader"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

import { useCreateProfile } from "../hooks/useProfileMutations"

const schema = z.object({
  name: z.string().min(1, "Nome do perfil é obrigatório"),
})

type FormData = z.infer<typeof schema>

export function ProfileCreatePage() {
  const navigate = useNavigate()
  const createProfile = useCreateProfile()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { name: "" },
  })

  function handleCancel() {
    navigate({ to: "/optionals" })
  }

  function onSubmit(data: FormData) {
    createProfile.mutate(
      { name: data.name },
      {
        onSuccess: () => {
          toast.success("Perfil criado")
          navigate({ to: "/optionals" })
        },
        onError: () => toast.error("Erro ao criar perfil"),
      },
    )
  }

  return (
    <div className="space-y-6">
      <AppPageHeader
        title="Novo Perfil de Opcionais"
        subtitle="Perfis agrupam opcionais comumente vendidos juntos."
        onBack={handleCancel}
      />

      <Card>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <AppInput
              label="Nome do Perfil"
              placeholder="Ex.: Conforto, Esportivo, Completo..."
              error={errors.name?.message}
              {...register("name")}
            />

            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <Button type="button" variant="outline" onClick={handleCancel} className="w-full sm:w-auto">
                Cancelar
              </Button>
              <AppButton type="submit" isLoading={createProfile.isPending} className="w-full sm:w-auto">
                Criar Perfil
              </AppButton>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
