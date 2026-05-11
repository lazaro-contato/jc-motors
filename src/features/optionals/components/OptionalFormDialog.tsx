import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import z from "zod"

import {
  useCreateOptional,
  useUpdateOptional,
} from "../hooks/useOptionalMutations"

import type { VehicleOptional } from "@/types/optionals"

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
  name: z.string().min(1, "Nome do opcional é obrigatório"),
})

type FormData = z.infer<typeof formSchema>

interface OptionalFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  optional?: VehicleOptional | null
}

export function OptionalFormDialog({
  open,
  onOpenChange,
  optional,
}: OptionalFormDialogProps) {
  const isEditing = Boolean(optional)
  const createMutation = useCreateOptional()
  const updateMutation = useUpdateOptional()

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
    if (open) reset({ name: optional?.name ?? "" })
  }, [open, optional, reset])

  const isSubmitting = createMutation.isPending || updateMutation.isPending

  function onSubmit(data: FormData) {
    if (isEditing && optional) {
      updateMutation.mutate(
        { id: optional.id, dto: { name: data.name } },
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
      { name: data.name },
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
            Defina o nome do opcional. Para agrupar em perfis, use a tela de
            perfis.
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
