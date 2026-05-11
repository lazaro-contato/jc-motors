import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import z from "zod"

import {
  useCreateProfile,
  useUpdateProfile,
} from "../hooks/useProfileMutations"

import type { VehicleOptionalProfile } from "@/types/optionals"

import { AppButton } from "@/components/shared/AppButton"
import { AppInput } from "@/components/shared/AppInput"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"



const formSchema = z.object({
  name: z.string().min(1, "Nome do perfil é obrigatório"),
})

type FormData = z.infer<typeof formSchema>

interface ProfileFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  profile?: VehicleOptionalProfile | null
}

export function ProfileFormDialog({
  open,
  onOpenChange,
  profile,
}: ProfileFormDialogProps) {
  const isEditing = Boolean(profile)
  const createMutation = useCreateProfile()
  const updateMutation = useUpdateProfile()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: "" },
  })

  useEffect(() => {
    if (open) reset({ name: profile?.name ?? "" })
  }, [open, profile, reset])

  const isSubmitting = createMutation.isPending || updateMutation.isPending

  function onSubmit(data: FormData) {
    if (isEditing && profile) {
      updateMutation.mutate(
        { id: profile.id, dto: { name: data.name } },
        {
          onSuccess: () => {
            toast.success("Perfil atualizado")
            onOpenChange(false)
          },
          onError: () => toast.error("Erro ao atualizar perfil"),
        },
      )
      return
    }

    createMutation.mutate(
      { name: data.name },
      {
        onSuccess: () => {
          toast.success("Perfil criado")
          onOpenChange(false)
        },
        onError: () => toast.error("Erro ao criar perfil"),
      },
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Editar perfil" : "Novo perfil"}
          </DialogTitle>
          <DialogDescription>
            Perfis agrupam opcionais comumente vendidos juntos.
          </DialogDescription>
        </DialogHeader>

        <form
          id="profile-form"
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-4"
        >
          <AppInput
            label="Nome"
            placeholder="Ex.: Conforto"
            error={errors.name?.message}
            {...register("name")}
          />
        </form>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
          >
            Cancelar
          </Button>
          <AppButton
            type="submit"
            form="profile-form"
            isLoading={isSubmitting}
          >
            {isEditing ? "Salvar" : "Criar"}
          </AppButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
