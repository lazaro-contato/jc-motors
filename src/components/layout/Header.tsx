import { Bell, Moon, Search, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  return (
    <Button
      variant="ghost"
      size="icon"
      className="size-9 rounded-xl text-muted-foreground hover:text-foreground"
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      aria-label="Alternar tema"
    >
      <Sun className="size-[18px] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute size-[18px] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
    </Button>
  )
}

export default function Header() {
  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b border-border bg-card px-6">
      {/* Search */}
      <div className="relative w-72">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          className="h-9 rounded-xl border-transparent bg-accent/60 pl-9 text-sm placeholder:text-muted-foreground/60 focus-visible:border-border focus-visible:bg-background"
          placeholder="Buscar veículo, cliente..."
        />
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1">
        <ThemeToggle />
        <Button
          variant="ghost"
          size="icon"
          className="relative size-9 rounded-xl text-muted-foreground hover:text-foreground"
        >
          <Bell className="size-[18px]" />
          <span className="absolute right-1.5 top-1.5 flex size-2">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-brand-400 opacity-75" />
            <span className="relative inline-flex size-2 rounded-full bg-brand-500" />
          </span>
        </Button>
      </div>
    </header>
  )
}
