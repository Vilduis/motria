import * as React from "react"
import { Link } from "react-router-dom"
import {
  LayoutDashboard,
  List,
  User,
  Users,
  Car,
  Wrench,
} from "lucide-react"
import authService from "@/services/authService"
import { LogoMark } from "@/components/brand/logo"

import { NavMain, type NavSection } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  onLogout?: () => void
}

type RoleAwareItem = {
  title: string
  url: string
  icon: React.ReactNode
  roles: Array<"ADMIN" | "TECHNICAL">
}

export function AppSidebar({ onLogout, ...props }: AppSidebarProps) {
  const currentUser = authService.getCurrentUser()

  const userData = {
    name: currentUser.displayName,
    email: currentUser.email,
    avatar: "/avatars/avatar.jpg",
    roles: currentUser.roles,
  }

  const filterByRole = (items: RoleAwareItem[]) =>
    items.filter((item) =>
      item.roles.some((role) => currentUser.roles.includes(role))
    )

  const generalItems = filterByRole([
    {
      title: "Inicio",
      url: "/dashboard",
      icon: <LayoutDashboard className="size-4" />,
      roles: ["ADMIN", "TECHNICAL"],
    },
  ])

  const operationItems = filterByRole([
    {
      title: "Clientes",
      url: "/dashboard/customers",
      icon: <Users className="size-4" />,
      roles: ["ADMIN", "TECHNICAL"],
    },
    {
      title: "Vehículos",
      url: "/dashboard/vehicles",
      icon: <Car className="size-4" />,
      roles: ["ADMIN", "TECHNICAL"],
    },
    {
      title: "Órdenes de Servicio",
      url: "/dashboard/orders",
      icon: <List className="size-4" />,
      roles: ["ADMIN", "TECHNICAL"],
    },
  ])

  const managementItems = filterByRole([
    {
      title: "Técnicos",
      url: "/dashboard/technicians",
      icon: <Wrench className="size-4" />,
      roles: ["ADMIN"],
    },
    {
      title: "Usuarios",
      url: "/dashboard/users",
      icon: <User className="size-4" />,
      roles: ["ADMIN"],
    },
  ])

  const sections: NavSection[] = []
  if (generalItems.length) sections.push({ items: generalItems })
  if (operationItems.length)
    sections.push({ label: "Operación", items: operationItems })
  if (managementItems.length)
    sections.push({ label: "Administración", items: managementItems })

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader className="border-b border-sidebar-border px-3 py-3">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="h-auto p-0! hover:bg-transparent!"
            >
              <Link to="/dashboard" className="flex items-center gap-2.5 py-0.5">
                <LogoMark size={20} className="text-brand" strokeWidth={2.25} />
                <div className="flex flex-col min-w-0">
                  <span className="truncate font-heading text-[15px] font-semibold leading-tight tracking-[-0.01em] text-foreground">
                    {currentUser.workshopName || "Workshop"}
                  </span>
                  <span className="truncate text-[10px] leading-tight text-sidebar-foreground/55">
                    {currentUser.roles.includes("ADMIN")
                      ? "Administrador"
                      : "Técnico"}
                  </span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent className="gap-0 py-2">
        <NavMain sections={sections} />
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border">
        <NavUser user={userData} onLogout={onLogout} />
      </SidebarFooter>
    </Sidebar>
  )
}
