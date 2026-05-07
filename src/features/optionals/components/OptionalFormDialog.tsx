import { useEffect } from "react"
import { Controller, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import z from "zod"

import { AppButton } from "@/components/shared/AppButton"
import { AppInput } from "@/components/shared/AppInput"
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

import type { VehicleOptional } from "@/core/models/vehicle-optional"
import type { VehicleOptionalProfile } from "@/core/models/vehicle-optional-profile"

import {
  useCreateOptional,
  useUpdateOptional,
} from "../hooks/useOptionalMutations"

const NO_PROFILE_VALUE = "__none__"

const formSchema = z.object({
  name: z.string().min(1, "Nome do opcional é obrigatório"),
  profile_id: z.string().optional(),
})

type FormData = z.infer<typeof formSchema>

interface OptionalFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  optional?: VehicleOptional | null
  profiles: VehicleOptionalProfile[]
}

export function OptionalFormDialog({
  open,
  onOpenChange,
  optional,
  profiles,
}: OptionalFormDialogProps) {
  const isEditing = Boolean(optional)
  const createMutation = useCreateOptional()
  const updateMutation = useUpdateOptional()

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: "", profile_id: NO_PROFILE_VALUE },
  })

  useEffect(() => {
    if (open) {
      reset({
        name: optional?.name ?? "",
        profile_id: optional?.profile?.id
          ? String(optional.profile.id)
          : NO_PROFILE_VALUE,
      })
    }
  }, [open, optional, reset])

  const profileOptions = [
    { label: "Sem perfil", value: NO_PROFILE_VALUE },
    ...profiles.map((p) => ({ label: p.name, value: String(p.id) })),
  ]

  const isSubmitting = createMutation.isPending || updateMutation.isPending

  function onSubmit(data: FormData) {
    const profileId =
      data.profile_id && data.profile_id !== NO_PROFILE_VALUE
        ? Number(data.profile_id)
        : null

    if (isEditing && optional) {
      updateMutation.mutate(
        { id: optional.id, dto: { name: data.name, profile_id: profileId } },
        {
          onSuccess: () => {
            toast.success("Opcional atualizado")
            onOpenChange(false)
          },
          onError: () => toast.error("Erro ao atualizar opcional"),
        },
      )
      return
    }

    createMutation.mutate(
      { name: data.name, profile_id: profileId },
      {
        onSuccess: () => {
          toast.success("Opcional criado")
          onOpenChange(false)
        },
        onError: () => toast.error("Erro ao criar opcional"),
      },
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Editar opcional" : "Novo opcional"}
          </DialogTitle>
          <DialogDescription>
            Defina o nome do opcional e, se desejar, vincule a um perfil.
          </DialogDescription>
        </DialogHeader>

        <form
          id="optional-form"
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-4"
        >
          <AppInput
            label="Nome"
            placeholder="Ex.: Ar Condicionado"
            error={errors.name?.message}
            {...register("name")}
          />

          <Controller
            name="profile_id"
            control={control}
            render={({ field }) => (
              <AppSelect
                label="Perfil (opcional)"
                placeholder="Selecione um perfil"
                options={profileOptions}
                value={field.value}
                onValueChange={field.onChange}
              />
            )}
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
            form="optional-form"
            isLoading={isSubmitting}
          >
            {isEditing ? "Salvar" : "Criar"}
          </AppButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
