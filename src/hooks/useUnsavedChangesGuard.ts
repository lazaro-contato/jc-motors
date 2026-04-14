import { useEffect } from "react"
import { useBlocker } from "@tanstack/react-router"

/**
 * useUnsavedChangesGuard — bloqueia navegação (router) e reload (browser)
 * enquanto houver alterações não salvas.
 *
 * Uso:
 *   const guard = useUnsavedChangesGuard(isDirty)
 *   <AppUnsavedChangesDialog
 *     open={guard.isBlocked}
 *     onOpenChange={(o) => !o && guard.cancel()}
 *     onConfirm={guard.confirm}
 *     onCancel={guard.cancel}
 *   />
 */
export function useUnsavedChangesGuard(when: boolean) {
  const blocker = useBlocker({
    shouldBlockFn: () => when,
    enableBeforeUnload: when,
    withResolver: true,
  })

  useEffect(() => {
    if (!when) return
    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault()
      e.returnValue = ""
    }
    window.addEventListener("beforeunload", handler)
    return () => window.removeEventListener("beforeunload", handler)
  }, [when])

  return {
    isBlocked: blocker.status === "blocked",
    confirm: () => blocker.proceed?.(),
    cancel: () => blocker.reset?.(),
  }
}
