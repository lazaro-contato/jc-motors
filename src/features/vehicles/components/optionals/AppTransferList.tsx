import { useMemo, useState } from "react"
import { ArrowRight, Search, Trash2, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { AppSelect, type SelectOption } from "@/components/shared/AppSelect"
import { cn } from "@/lib/utils"

/* ── Types ───────────────────────────────────────────────────────────────── */

export interface TransferListItem {
  id: string
  label: string
}

export interface TransferListProfile {
  id: string
  label: string
  itemIds: string[]
}

interface AppTransferListProps {
  availableItems: TransferListItem[]
  assignedIds: string[]
  onAssignedChange: (ids: string[]) => void
  profiles?: TransferListProfile[]
  availableTitle?: string
  assignedTitle?: string
  searchPlaceholder?: string
  emptyAvailableText?: string
  emptyAssignedText?: string
  className?: string
}

/* ── Component ───────────────────────────────────────────────────────────── */

export function AppTransferList({
  availableItems,
  assignedIds,
  onAssignedChange,
  profiles = [],
  availableTitle = "Disponíveis",
  assignedTitle = "Selecionados",
  searchPlaceholder = "Buscar...",
  emptyAvailableText = "Nenhum item disponível.",
  emptyAssignedText = "Nenhum item adicionado.",
  className,
}: AppTransferListProps) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(
    () => new Set(assignedIds),
  )
  const [searchQuery, setSearchQuery] = useState("")

  const assignedSet = useMemo(() => new Set(assignedIds), [assignedIds])

  const filteredItems = useMemo(() => {
    if (!searchQuery.trim()) return availableItems
    const q = searchQuery.toLowerCase()
    return availableItems.filter((item) => item.label.toLowerCase().includes(q))
  }, [availableItems, searchQuery])

  const assignedItems = useMemo(
    () => availableItems.filter((item) => assignedSet.has(item.id)),
    [availableItems, assignedSet],
  )

  const hasNewSelections = useMemo(
    () => [...selectedIds].some((id) => !assignedSet.has(id)),
    [selectedIds, assignedSet],
  )

  const profileOptions: SelectOption[] = useMemo(
    () => profiles.map((p) => ({ label: p.label, value: p.id })),
    [profiles],
  )

  /* ── Handlers ────────────────────────────────────────────────────────── */

  function toggleItem(id: string) {
    if (assignedSet.has(id)) return
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  function handleProfileChange(profileId: string) {
    const profile = profiles.find((p) => p.id === profileId)
    if (!profile) return
    setSelectedIds((prev) => {
      const next = new Set(prev)
      for (const id of profile.itemIds) {
        next.add(id)
      }
      return next
    })
  }

  function handleTransfer() {
    const newIds = [...selectedIds].filter((id) => !assignedSet.has(id))
    if (newIds.length === 0) return
    onAssignedChange([...assignedIds, ...newIds])
  }

  function handleRemove(id: string) {
    onAssignedChange(assignedIds.filter((aid) => aid !== id))
    setSelectedIds((prev) => {
      const next = new Set(prev)
      next.delete(id)
      return next
    })
  }

  function handleRemoveAll() {
    if (assignedIds.length === 0) return
    onAssignedChange([])
    setSelectedIds((prev) => {
      const next = new Set(prev)
      for (const id of assignedIds) {
        next.delete(id)
      }
      return next
    })
  }

  /* ── Render ──────────────────────────────────────────────────────────── */

  return (
    <div
      className={cn(
        "grid grid-cols-1 gap-3 md:grid-cols-[1fr_auto_1fr]",
        className,
      )}
    >
      {/* Left panel — available items */}
      <Card className="flex flex-col overflow-hidden">
        <CardHeader className="space-y-3 pb-3">
          <CardTitle className="text-sm font-semibold text-foreground">
            {availableTitle}
          </CardTitle>

          {profiles.length > 0 && (
            <AppSelect
              options={profileOptions}
              placeholder="Selecione uma configuração"
              onValueChange={handleProfileChange}
              size="sm"
            />
          )}

          <div className="relative">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={searchPlaceholder}
              className="h-8 pl-8 text-sm"
            />
          </div>
        </CardHeader>

        <CardContent className="flex-1 overflow-y-auto px-3 pb-3 pt-0">
          {filteredItems.length === 0 ? (
            <p className="py-8 text-center text-xs text-muted-foreground">
              {emptyAvailableText}
            </p>
          ) : (
            <ul className="space-y-1">
              {filteredItems.map((item) => {
                const isAssigned = assignedSet.has(item.id)
                const isChecked = selectedIds.has(item.id)

                return (
                  <li key={item.id}>
                    <label
                      className={cn(
                        "flex cursor-pointer items-center gap-2.5 rounded-md border px-3 py-2 text-sm transition",
                        isAssigned
                          ? "border-brand-200 bg-brand-50/50 dark:border-brand-800 dark:bg-brand-900/20"
                          : "border-transparent hover:bg-muted/60",
                        isAssigned && "pointer-events-none opacity-60",
                      )}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        disabled={isAssigned}
                        onChange={() => toggleItem(item.id)}
                        className="size-4 rounded border-border accent-brand-500"
                      />
                      <span
                        className={cn(
                          "text-foreground",
                          isAssigned && "text-muted-foreground",
                        )}
                      >
                        {item.label}
                      </span>
                      {isAssigned && (
                        <span className="ml-auto text-[10px] font-medium text-brand-600 dark:text-brand-400">
                          Adicionado
                        </span>
                      )}
                    </label>
                  </li>
                )
              })}
            </ul>
          )}
        </CardContent>
      </Card>

      {/* Center — transfer button */}
      <div className="flex items-center justify-center md:flex-col">
        <Button
          type="button"
          variant="outline"
          size="icon"
          disabled={!hasNewSelections}
          onClick={handleTransfer}
          className={cn(
            "size-10 rounded-full border-border transition",
            hasNewSelections &&
              "border-brand-300 bg-brand-50 text-brand-600 hover:bg-brand-100 dark:border-brand-700 dark:bg-brand-900/30 dark:text-brand-400 dark:hover:bg-brand-900/50",
          )}
        >
          <ArrowRight className="size-4" />
        </Button>
      </div>

      {/* Right panel — assigned items */}
      <Card className="flex flex-col overflow-hidden">
        <CardHeader className="pb-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <CardTitle className="text-sm font-semibold text-foreground">
              {assignedTitle}
            </CardTitle>
            {assignedItems.length > 0 && (
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-7 gap-1 px-2 text-xs text-muted-foreground hover:text-danger"
                  onClick={handleRemoveAll}
                >
                  <Trash2 className="size-3.5 shrink-0" />
                  Remover todos
                </Button>
                <span className="rounded-full bg-brand-50 px-2 py-0.5 text-xs font-semibold text-brand-700 dark:bg-brand-900/30 dark:text-brand-400">
                  {assignedItems.length}
                </span>
              </div>
            )}
          </div>
        </CardHeader>

        <CardContent className="flex-1 overflow-y-auto px-3 pb-3 pt-0">
          {assignedItems.length === 0 ? (
            <p className="py-8 text-center text-xs text-muted-foreground">
              {emptyAssignedText}
            </p>
          ) : (
            <ul className="divide-y divide-border">
              {assignedItems.map((item) => (
                <li
                  key={item.id}
                  className="group flex items-center justify-between px-3 py-2.5 transition hover:bg-muted/60"
                >
                  <span className="text-sm text-foreground">{item.label}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemove(item.id)}
                    className="size-6 shrink-0 rounded-md text-muted-foreground opacity-0 transition group-hover:opacity-100 hover:text-danger"
                  >
                    <X className="size-3.5" />
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
