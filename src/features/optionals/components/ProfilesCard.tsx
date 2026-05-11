import { Pencil, Plus, Tag, Trash2 } from "lucide-react"

import type { VehicleOptionalProfile } from "@/types/optionals"

import { AppButton } from "@/components/shared/AppButton"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"


interface ProfilesCardProps {
  profiles: VehicleOptionalProfile[]
  isLoading: boolean
  onCreate: () => void
  onEdit: (profile: VehicleOptionalProfile) => void
  onDelete: (profile: VehicleOptionalProfile) => void
}

export function ProfilesCard({
  profiles,
  isLoading,
  onCreate,
  onEdit,
  onDelete,
}: ProfilesCardProps) {
  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between border-b border-border py-3">
        <div className="flex items-center gap-2">
          <Tag className="size-4 text-brand-600 dark:text-silver-300" />
          <CardTitle className="text-base font-semibold">Perfis</CardTitle>
        </div>
        <AppButton size="sm" className="gap-2" onClick={onCreate}>
          <Plus className="size-4" />
          Novo perfil
        </AppButton>
      </CardHeader>

      <CardContent className="p-4">
        {isLoading ? (
          <div className="flex flex-wrap gap-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="h-8 w-24 animate-pulse rounded-full bg-muted"
              />
            ))}
          </div>
        ) : profiles.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Nenhum perfil criado. Use perfis para agrupar opcionais comumente
            vendidos juntos.
          </p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {profiles.map((profile) => (
              <div
                key={profile.id}
                className="group flex items-center gap-1 rounded-full border border-border bg-muted/40 py-1 pr-1 pl-3 text-sm"
              >
                <span className="font-medium text-foreground">
                  {profile.name}
                </span>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="size-6 rounded-full text-muted-foreground hover:text-foreground"
                  onClick={() => onEdit(profile)}
                  aria-label={`Editar perfil ${profile.name}`}
                >
                  <Pencil className="size-3" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="size-6 rounded-full text-muted-foreground hover:text-danger"
                  onClick={() => onDelete(profile)}
                  aria-label={`Excluir perfil ${profile.name}`}
                >
                  <Trash2 className="size-3" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
