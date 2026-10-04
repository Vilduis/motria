import * as React from "react"
import { Link, useLocation } from "react-router-dom"
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
  useSidebar,
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
  const { setOpenMobile } = useSidebar()
  const { pathname } = useLocation()

  // On phones the sidebar is a sheet: close it once a link has navigated.
  React.useEffect(() => {
    setOpenMobile(false)
  }, [pathname, setOpenMobile])

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
      <SidebarHeader className="border-b border-sidebar-border px-3 py-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="h-auto p-0! hover:bg-transparent!"
            >
              <Link to="/dashboard" className="flex items-center gap-3 py-0.5">
                <span className="flex size-9 shrink-0 -rotate-8 items-center justify-center rounded-full border-2 border-sidebar-primary text-sidebar-primary">
                  <LogoMark size={20} strokeWidth={2.7} />
                </span>
                <div className="flex min-w-0 flex-col gap-0.5">
                  <span className="truncate font-heading text-[19px] font-semibold leading-none tracking-[-0.01em] text-sidebar-accent-foreground">
                    {currentUser.workshopName || "Motria"}
                  </span>
                  <span className="truncate text-[11px] leading-tight text-sidebar-foreground">
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
