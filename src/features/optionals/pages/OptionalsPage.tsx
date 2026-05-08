import { useState } from "react"
import { toast } from "sonner"

import { AppPageHeader } from "@/components/shared/AppPageHeader"

import type { VehicleOptional } from "@/core/models/vehicle-optional"
import type { VehicleOptionalProfile } from "@/core/models/vehicle-optional-profile"

import { ConfirmDeleteDialog } from "../components/ConfirmDeleteDialog"
import { OptionalFormDialog } from "../components/OptionalFormDialog"
import { OptionalsTable } from "../components/OptionalsTable"
import { ProfileFormDialog } from "../components/ProfileFormDialog"
import { ProfilesCard } from "../components/ProfilesCard"
import { useOptionals } from "../hooks/useOptionals"
import { useDeleteOptional } from "../hooks/useOptionalMutations"
import { useDeleteProfile } from "../hooks/useProfileMutations"
import { useProfiles } from "../hooks/useProfiles"

export function OptionalsPage() {
  const { data: optionals = [], isPending: optionalsLoading } = useOptionals()
  const { data: profiles = [], isPending: profilesLoading } = useProfiles()

  const deleteOptional = useDeleteOptional()
  const deleteProfile = useDeleteProfile()

  const [optionalDialogOpen, setOptionalDialogOpen] = useState(false)
  const [editingOptional, setEditingOptional] =
    useState<VehicleOptional | null>(null)

  const [profileDialogOpen, setProfileDialogOpen] = useState(false)
  const [editingProfile, setEditingProfile] =
    useState<VehicleOptionalProfile | null>(null)

  const [optionalToDelete, setOptionalToDelete] =
    useState<VehicleOptional | null>(null)
  const [profileToDelete, setProfileToDelete] =
    useState<VehicleOptionalProfile | null>(null)

  function openCreateOptional() {
    setEditingOptional(null)
    setOptionalDialogOpen(true)
  }

  function openEditOptional(optional: VehicleOptional) {
    setEditingOptional(optional)
    setOptionalDialogOpen(true)
  }

  function openCreateProfile() {
    setEditingProfile(null)
    setProfileDialogOpen(true)
  }

  function openEditProfile(profile: VehicleOptionalProfile) {
    setEditingProfile(profile)
    setProfileDialogOpen(true)
  }

  function confirmDeleteOptional() {
    if (!optionalToDelete) return
    deleteOptional.mutate(optionalToDelete.id, {
      onSuccess: () => {
        toast.success("Opcional excluído")
        setOptionalToDelete(null)
      },
      onError: () => toast.error("Erro ao excluir opcional"),
    })
  }

  function confirmDeleteProfile() {
    if (!profileToDelete) return
    deleteProfile.mutate(profileToDelete.id, {
      onSuccess: () => {
        toast.success("Perfil excluído")
        setProfileToDelete(null)
      },
      onError: () => toast.error("Erro ao excluir perfil"),
    })
  }

  return (
    <div className="space-y-6">
      <AppPageHeader
        title="Opcionais"
        subtitle="Cadastre os opcionais disponíveis e organize-os em perfis para facilitar a montagem dos veículos."
      />

      <ProfilesCard
        profiles={profiles}
        isLoading={profilesLoading}
        onCreate={openCreateProfile}
        onEdit={openEditProfile}
        onDelete={setProfileToDelete}
      />

      <OptionalsTable
        optionals={optionals}
        isLoading={optionalsLoading}
        onCreate={openCreateOptional}
        onEdit={openEditOptional}
        onDelete={setOptionalToDelete}
      />

      <OptionalFormDialog
        open={optionalDialogOpen}
        onOpenChange={setOptionalDialogOpen}
        optional={editingOptional}
        profiles={profiles}
      />

      <ProfileFormDialog
        open={profileDialogOpen}
        onOpenChange={setProfileDialogOpen}
        profile={editingProfile}
      />

      <ConfirmDeleteDialog
        open={Boolean(optionalToDelete)}
        onOpenChange={(open) => !open && setOptionalToDelete(null)}
        title="Excluir opcional"
        description={
          optionalToDelete
            ? `Tem certeza que deseja excluir "${optionalToDelete.name}"? Esta ação não pode ser desfeita.`
            : ""
        }
        isLoading={deleteOptional.isPending}
        onConfirm={confirmDeleteOptional}
      />

      <ConfirmDeleteDialog
        open={Boolean(profileToDelete)}
        onOpenChange={(open) => !open && setProfileToDelete(null)}
        title="Excluir perfil"
        description={
          profileToDelete
            ? `Tem certeza que deseja excluir o perfil "${profileToDelete.name}"? Os opcionais vinculados ficarão sem perfil.`
            : ""
        }
        isLoading={deleteProfile.isPending}
        onConfirm={confirmDeleteProfile}
      />
    </div>
  )
}
