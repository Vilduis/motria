import { Link } from "react-router-dom"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { ChevronsUpDown, CircleUserRound, LogOut } from "lucide-react"

const ROLE_LABEL: Record<string, string> = {
  ADMIN: "Administrador",
  TECHNICAL: "Técnico",
}

export function NavUser({
  user,
  onLogout,
}: {
  user: {
    name: string
    email: string
    avatar: string
    roles?: string[]
  }
  onLogout?: () => void
}) {
  const { isMobile } = useSidebar()
  const initials = user.name.substring(0, 2).toUpperCase()
  const roleLabel = ROLE_LABEL[user.roles?.[0] || ""] || "Usuario"

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="h-12 gap-2.5 rounded-lg px-2 transition-colors duration-150 hover:bg-sidebar-accent/70 data-[state=open]:bg-sidebar-accent"
            >
              <Avatar className="size-7 rounded-md">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className="rounded-md bg-brand-subtle text-[10.5px] font-semibold text-brand">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="grid min-w-0 flex-1 text-left leading-tight">
                <span className="truncate text-[13px] font-semibold text-foreground">
                  {roleLabel}
                </span>
                <span className="truncate text-[11px] text-sidebar-foreground/60">
                  {user.email}
                </span>
              </div>
              <ChevronsUpDown className="ml-auto size-3.5 shrink-0 text-sidebar-foreground/40" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg border-border/80 shadow-elevated"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={6}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2.5 px-2 py-2 text-left">
                <Avatar className="size-9 rounded-md">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className="rounded-md bg-brand-subtle text-xs font-semibold text-brand">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <div className="grid min-w-0 flex-1 leading-tight">
                  <span className="truncate text-[13px] font-semibold text-foreground">
                    {roleLabel}
                  </span>
                  <span className="truncate text-[11.5px] text-muted-foreground">
                    {user.email}
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem asChild>
                <Link
                  to="/dashboard/account"
                  className="flex w-full items-center gap-2 text-[13px]"
                >
                  <CircleUserRound className="size-4 text-muted-foreground" />
                  Mi cuenta
                </Link>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={onLogout}
              className="gap-2 text-[13px] text-destructive focus:bg-destructive/10 focus:text-destructive"
            >
              <LogOut className="size-4" />
              Cerrar sesión
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
