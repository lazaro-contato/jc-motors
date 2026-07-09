import { Link } from "@tanstack/react-router";
import {
  Car,
  ChevronLeft,
  ClipboardList,
  LayoutDashboard,
  LayoutTemplate,
  ListChecks,
  LogOut,
  ShoppingCart,
  Tag,
  Users,
  UserSquare,
  Workflow,
} from "lucide-react";
import { useState } from "react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/auth.store";
import { useSidebarStore } from "@/store/sidebar.store";

interface NavItem {
  label: string;
  to: string;
  icon: React.ReactNode;
}

interface NavGroup {
  title?: string;
  items: NavItem[];
}

const navGroups: NavGroup[] = [
  {
    items: [
      {
        label: "Dashboard",
        to: "/",
        icon: <LayoutDashboard className="size-[18px]" />,
      },
    ],
  },
  {
    title: "Cadastros",
    items: [
      { label: "Veículos", to: "/vehicles", icon: <Car className="size-[18px]" /> },
      {
        label: "Opcionais",
        to: "/optionals",
        icon: <Tag className="size-[18px]" />,
      },
      {
        label: "Fornecedores",
        to: "/providers",
        icon: <ClipboardList className="size-[18px]" />,
      },
      {
        label: "Clientes",
        to: "/customers",
        icon: <Users className="size-[18px]" />,
      },
      {
        label: "Funcionários",
        to: "/employees",
        icon: <UserSquare className="size-[18px]" />,
      },
    ],
  },
  {
    title: "Comercial",
    items: [
      {
        label: "Vendas",
        to: "/sales",
        icon: <ShoppingCart className="size-[18px]" />,
      },
    ],
  },
  {
    title: "Gestão",
    items: [
      // { label: 'Times', to: '/teams', icon: <Users className="size-[18px]" /> },
      // { label: 'Workflows', to: '/workflows', icon: <Workflow className="size-[18px]" /> },
      {
        label: "Minhas Tarefas",
        to: "/my-tasks",
        icon: <ListChecks className="size-[18px]" />,
      },
    ],
  },
  {
    items: [
      {
        label: "Design System",
        to: "/design-system",
        icon: <LayoutTemplate className="size-[18px]" />,
      },
    ],
  },
];

function NavLink({
  item,
  collapsed,
  onNavigate,
}: {
  item: NavItem;
  collapsed: boolean;
  onNavigate?: () => void;
}) {
  return (
    <Link
      to={item.to}
      className={cn(
        "group relative flex items-center gap-3 rounded-md px-3 py-2.5 text-[13px] font-medium transition-all duration-150",
        "text-sidebar-foreground/60 hover:bg-sidebar-accent hover:text-sidebar-foreground",
        collapsed && "justify-center px-0",
      )}
      activeProps={{
        className: cn(
          "!bg-white/10 !text-white",
          "before:absolute before:left-0 before:top-1/2 before:h-5 before:-translate-y-1/2 before:w-[3px] before:rounded-r-full before:bg-white",
        ),
      }}
      activeOptions={{ exact: item.to === "/" }}
      onClick={onNavigate}
    >
      <span className="shrink-0">{item.icon}</span>
      {!collapsed && <span className="truncate">{item.label}</span>}
    </Link>
  );
}

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const { isOpen, close } = useSidebarStore();

  const name = user?.employee?.full_name ?? "JC Motors";
  const role = user?.employee?.role ?? "Administrador";
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <>
      {/* ── Backdrop (mobile only) ── */}
      <div
        className={cn(
          "fixed inset-0 z-40 bg-black/50 transition-opacity duration-200 lg:hidden",
          isOpen ? "opacity-100" : "pointer-events-none opacity-0",
        )}
        onClick={close}
      />

      {/* ── Sidebar ── */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-50 h-screen flex shrink-0 flex-col border-r border-sidebar-border bg-sidebar transition-transform duration-200",
          // Mobile: drawer — sempre expandido
          isOpen ? "translate-x-0" : "-translate-x-full",
          "w-64",
          // Desktop: fixo, com collapse
          "lg:relative lg:z-auto lg:translate-x-0 lg:transition-[width]",
          collapsed ? "lg:w-[72px]" : "lg:w-64",
        )}
      >
        {/* ── Brand ── */}
        <div
          className={cn(
            "flex h-14 items-center gap-3 border-b border-sidebar-border px-4",
            collapsed && "lg:justify-center lg:px-0",
          )}
        >
          <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-white/10 shadow-md">
            <Car className="size-4 text-white" />
          </div>
          <div className={cn("flex flex-col", collapsed && "lg:hidden")}>
            <span className="text-sm font-bold tracking-tight text-sidebar-foreground">
              JC Motors
            </span>
            <span className="text-[10px] font-medium text-sidebar-foreground/50">
              Gestão Automotiva
            </span>
          </div>
        </div>

        {/* ── Navigation ── */}
        <nav
          className={cn(
            "flex-1 overflow-y-auto px-3 py-3",
            collapsed && "lg:px-2",
          )}
        >
          {navGroups.map((group, gi) => (
            <div key={gi} className={cn(gi > 0 && "mt-4")}>
              {group.title && (
                <p
                  className={cn(
                    "mb-1.5 px-3 text-[10px] font-semibold uppercase tracking-widest text-sidebar-foreground/30",
                    collapsed && "lg:hidden",
                  )}
                >
                  {group.title}
                </p>
              )}
              {group.title && collapsed && gi > 0 && (
                <div className="mx-auto my-2 hidden h-px w-6 bg-sidebar-border lg:block" />
              )}
              {!group.title && gi > 0 && (
                <div
                  className={cn(
                    "my-2 h-px bg-sidebar-border",
                    collapsed && "lg:mx-auto lg:w-6",
                  )}
                />
              )}
              <div className="space-y-0.5">
                {group.items.map((item) => (
                  <NavLink
                    key={item.to}
                    item={item}
                    collapsed={collapsed}
                    onNavigate={close}
                  />
                ))}
              </div>
            </div>
          ))}
        </nav>

        {/* ── Footer: User + Collapse ── */}
        <div className="border-t border-sidebar-border p-3">
          {/* User card */}
          <div
            className={cn(
              collapsed ? "mb-2 hidden justify-center lg:flex" : "mb-2",
            )}
          >
            {!collapsed ? (
              <div className="flex items-center gap-2.5 rounded-md bg-sidebar-accent px-3 py-2.5">
                <Avatar className="size-8 shrink-0">
                  <AvatarFallback className="bg-white/15 text-sidebar-foreground text-[11px] font-bold">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-semibold text-sidebar-foreground">
                    {name}
                  </p>
                  <p className="truncate text-[10px] text-sidebar-foreground/50">
                    {role}
                  </p>
                </div>
              </div>
            ) : (
              <Avatar className="size-8">
                <AvatarFallback className="bg-white/15 text-sidebar-foreground text-[11px] font-bold">
                  {initials}
                </AvatarFallback>
              </Avatar>
            )}
          </div>

          {/* Actions */}
          <div
            className={cn(
              "flex gap-1",
              collapsed ? "lg:flex-col lg:items-center" : "items-center",
            )}
          >
            <button
              onClick={() => logout()}
              className={cn(
                "flex items-center gap-2.5 rounded-md px-3 py-2 text-[13px] font-medium text-sidebar-foreground/50 transition-colors hover:bg-danger/10 hover:text-danger",
                collapsed ? "lg:justify-center lg:px-0 lg:w-full" : "flex-1",
              )}
            >
              <LogOut className="size-[18px] shrink-0" />
              <span className={cn(collapsed && "lg:hidden")}>Sair</span>
            </button>
            {/* Collapse toggle — desktop only */}
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "hidden size-8 shrink-0 text-sidebar-foreground/50 hover:text-sidebar-foreground hover:bg-sidebar-accent lg:inline-flex",
                collapsed && "w-full rounded-md",
              )}
              onClick={() => setCollapsed(!collapsed)}
              aria-label={collapsed ? "Expandir sidebar" : "Recolher sidebar"}
            >
              <ChevronLeft
                className={cn(
                  "size-4 transition-transform",
                  collapsed && "rotate-180",
                )}
              />
            </Button>
          </div>
        </div>
      </aside>
    </>
  );
}
