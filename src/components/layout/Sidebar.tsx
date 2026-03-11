import { Link } from '@tanstack/react-router'
import {
  Car,
  ChevronLeft,
  ClipboardList,
  LayoutDashboard,
  LayoutTemplate,
  ListChecks,
  LogOut,
  ShoppingCart,
  Users,
  UserSquare,
  Workflow,
} from 'lucide-react'
import { useState } from 'react'

import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useAuthStore } from '@/store/auth.store'

interface NavItem {
  label: string
  to: string
  icon: React.ReactNode
}

interface NavGroup {
  title?: string
  items: NavItem[]
}

const navGroups: NavGroup[] = [
  {
    items: [
      { label: 'Dashboard', to: '/', icon: <LayoutDashboard className="size-[18px]" /> },
    ],
  },
  {
    title: 'Cadastros',
    items: [
      { label: 'Veículos', to: '/cars', icon: <Car className="size-[18px]" /> },
      { label: 'Fornecedores', to: '/providers', icon: <ClipboardList className="size-[18px]" /> },
      { label: 'Clientes', to: '/customers', icon: <Users className="size-[18px]" /> },
      { label: 'Funcionários', to: '/employees', icon: <UserSquare className="size-[18px]" /> },
    ],
  },
  {
    title: 'Comercial',
    items: [
      { label: 'Vendas', to: '/sales', icon: <ShoppingCart className="size-[18px]" /> },
    ],
  },
  {
    title: 'Gestão',
    items: [
      { label: 'Times', to: '/teams', icon: <Users className="size-[18px]" /> },
      { label: 'Workflows', to: '/workflows', icon: <Workflow className="size-[18px]" /> },
      { label: 'Minhas Tarefas', to: '/my-tasks', icon: <ListChecks className="size-[18px]" /> },
    ],
  },
  {
    items: [
      { label: 'Design System', to: '/design-system', icon: <LayoutTemplate className="size-[18px]" /> },
    ],
  },
]

function NavLink({ item, collapsed }: { item: NavItem; collapsed: boolean }) {
  return (
    <Link
      to={item.to}
      className={cn(
        'group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-medium transition-all duration-150',
        'text-muted-foreground hover:bg-accent hover:text-foreground',
        collapsed && 'justify-center px-0',
      )}
      activeProps={{
        className: cn(
          '!bg-brand-500/10 !text-brand-600 dark:!text-brand-300',
          'before:absolute before:left-0 before:top-1/2 before:h-5 before:-translate-y-1/2 before:w-[3px] before:rounded-r-full before:bg-brand-500',
        ),
      }}
      activeOptions={{ exact: item.to === '/' }}
    >
      <span className="shrink-0">{item.icon}</span>
      {!collapsed && <span className="truncate">{item.label}</span>}
    </Link>
  )
}

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const user = useAuthStore((s) => s.user)
  const logout = useAuthStore((s) => s.logout)

  const name = user?.employee?.full_name ?? 'JG Motors'
  const role = user?.employee?.role ?? 'Administrador'
  const initials = name
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()

  return (
    <aside
      className={cn(
        'flex shrink-0 flex-col border-r border-sidebar-border bg-sidebar transition-[width] duration-200',
        collapsed ? 'w-[72px]' : 'w-64',
      )}
    >
      {/* ── Brand ── */}
      <div className={cn(
        'flex h-14 items-center gap-3 border-b border-sidebar-border px-4',
        collapsed && 'justify-center px-0',
      )}>
        <div className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 shadow-md shadow-brand-500/20">
          <Car className="size-4 text-white" />
        </div>
        {!collapsed && (
          <div className="flex flex-col">
            <span className="text-sm font-bold tracking-tight text-foreground">JG Motors</span>
            <span className="text-[10px] font-medium text-muted-foreground">Gestão Automotiva</span>
          </div>
        )}
      </div>

      {/* ── Navigation ── */}
      <nav className={cn(
        'flex-1 overflow-y-auto px-3 py-3',
        collapsed && 'px-2',
      )}>
        {navGroups.map((group, gi) => (
          <div key={gi} className={cn(gi > 0 && 'mt-4')}>
            {group.title && !collapsed && (
              <p className="mb-1.5 px-3 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60">
                {group.title}
              </p>
            )}
            {group.title && collapsed && gi > 0 && (
              <div className="mx-auto my-2 h-px w-6 bg-sidebar-border" />
            )}
            {!group.title && gi > 0 && (
              <div className={cn('my-2 h-px bg-sidebar-border', collapsed && 'mx-auto w-6')} />
            )}
            <div className="space-y-0.5">
              {group.items.map((item) => (
                <NavLink key={item.to} item={item} collapsed={collapsed} />
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* ── Footer: User + Collapse ── */}
      <div className="border-t border-sidebar-border p-3">
        {/* User card */}
        {!collapsed ? (
          <div className="mb-2 flex items-center gap-2.5 rounded-xl bg-accent/50 px-3 py-2.5">
            <Avatar className="size-8 shrink-0">
              <AvatarFallback className="bg-brand-100 text-brand-700 dark:bg-brand-800 dark:text-brand-200 text-[11px] font-bold">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-semibold text-foreground">{name}</p>
              <p className="truncate text-[10px] text-muted-foreground">{role}</p>
            </div>
          </div>
        ) : (
          <div className="mb-2 flex justify-center">
            <Avatar className="size-8">
              <AvatarFallback className="bg-brand-100 text-brand-700 dark:bg-brand-800 dark:text-brand-200 text-[11px] font-bold">
                {initials}
              </AvatarFallback>
            </Avatar>
          </div>
        )}

        {/* Actions */}
        <div className={cn('flex gap-1', collapsed ? 'flex-col items-center' : 'items-center')}>
          <button
            onClick={() => logout()}
            className={cn(
              'flex items-center gap-2.5 rounded-xl px-3 py-2 text-[13px] font-medium text-muted-foreground transition-colors hover:bg-danger/10 hover:text-danger',
              collapsed ? 'justify-center px-0 w-full' : 'flex-1',
            )}
          >
            <LogOut className="size-[18px] shrink-0" />
            {!collapsed && <span>Sair</span>}
          </button>
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              'size-8 shrink-0 text-muted-foreground',
              collapsed && 'w-full rounded-xl',
            )}
            onClick={() => setCollapsed(!collapsed)}
            aria-label={collapsed ? 'Expandir sidebar' : 'Recolher sidebar'}
          >
            <ChevronLeft className={cn('size-4 transition-transform', collapsed && 'rotate-180')} />
          </Button>
        </div>
      </div>
    </aside>
  )
}
