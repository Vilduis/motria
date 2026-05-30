import { useLocation, Link } from "react-router-dom"
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { cn } from "@/lib/utils"

export interface NavItem {
  title: string
  url: string
  icon?: React.ReactNode
}

export interface NavSection {
  label?: string
  items: NavItem[]
}

export function NavMain({ sections }: { sections: NavSection[] }) {
  const { pathname } = useLocation()

  const isActive = (url: string) =>
    url === "/dashboard" ? pathname === url : pathname.startsWith(url)

  return (
    <>
      {sections.map((section, idx) => (
        <SidebarGroup
          key={section.label ?? `section-${idx}`}
          className={cn(idx === 0 ? "pt-1" : "pt-3", "pb-1")}
        >
          {section.label && (
            <SidebarGroupLabel className="text-eyebrow mb-1 px-2.5 text-sidebar-foreground/45">
              {section.label}
            </SidebarGroupLabel>
          )}
          <SidebarGroupContent className="flex flex-col gap-px">
            <SidebarMenu>
              {section.items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    tooltip={item.title}
                    asChild
                    isActive={isActive(item.url)}
                    className={cn(
                      "h-8 gap-2.5 px-2.5 text-[13.5px] font-medium text-sidebar-foreground/75",
                      "transition-colors duration-150 ease-(--ease-out-quart)",
                      "hover:bg-sidebar-accent/70 hover:text-sidebar-accent-foreground",
                      "data-active:bg-sidebar-accent data-active:text-sidebar-accent-foreground data-active:font-semibold",
                      "[&>svg]:size-4 [&>svg]:text-sidebar-foreground/55",
                      "hover:[&>svg]:text-sidebar-foreground/85",
                      "data-active:[&>svg]:text-brand",
                    )}
                  >
                    <Link to={item.url}>
                      {item.icon}
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      ))}
    </>
  )
}
