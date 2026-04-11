import * as React from "react"
import { Link } from "react-router-dom"
import { LayoutDashboard, List, ChartBar, User, Users, Command, Car } from "lucide-react"
import authService from "@/services/authService"

import { NavMain } from "@/components/nav-main"
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

export function AppSidebar({ onLogout, ...props }: AppSidebarProps) {
  const currentUser = authService.getCurrentUser();
  
  const userData = {
    name: currentUser.email.split('@')[0],
    email: currentUser.email,
    avatar: "/avatars/avatar.jpg",
    roles: currentUser.roles
  };

  const navMain = [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: <LayoutDashboard />,
      roles: ["ADMIN", "TECNICO"]
    },
    {
      title: "Usuarios",
      url: "/dashboard/users",
      icon: <User />,
      roles: ["ADMIN"]
    },
    {
      title: "Técnicos",
      url: "/dashboard/technicians",
      icon: <ChartBar />,
      roles: ["ADMIN"]
    },
    {
      title: "Clientes",
      url: "/dashboard/customers",
      icon: <Users />,
      roles: ["ADMIN"]
    },
    {
      title: "Vehículos",
      url: "/dashboard/vehicles",
      icon: <Car />,
      roles: ["ADMIN"]
    },
    {
      title: "Ordenes de Servicio",
      url: "/dashboard/orders",
      icon: <List />,
      roles: ["ADMIN", "TECNICO"]
    },
  ];

  const filteredNavMain = navMain.filter(item => 
    item.roles.some(role => currentUser.roles.includes(role))
  );

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:p-1.5!"
            >
              <Link to="/dashboard">
                <Command className="size-5!" />
                <span className="text-base font-semibold">Workshop App</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={filteredNavMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={userData} onLogout={onLogout} />
      </SidebarFooter>
    </Sidebar>
  )
}
