import type { User, UserRole } from "@/types"


export function mapUserRoles(user: User | null | undefined): UserRole[] {
  if (!user || !user.authorities) return []


  if (typeof user.authorities === "string") {
    return user.authorities
      .split(";")
      .map((r) => r.trim() as UserRole)
      .filter((r) => r === "ADMIN" || r === "TECNICO")
  }

  return []
}


export function hasRole(user: User | null | undefined, role: UserRole): boolean {
  const roles = mapUserRoles(user)
  return roles.includes(role)
}


export function getPrimaryRole(user: User | null | undefined): string {
  const roles = mapUserRoles(user)
  if (roles.includes("ADMIN")) return "Administrador"
  if (roles.includes("TECNICO")) return "Técnico"
  return "Sin Rol"
}

export function rolesToString(roles: UserRole[]): string {
  return roles.join(";")
}
