import type { User, UserRole } from "@/types"

function mapUserRoles(user: User | null | undefined): UserRole[] {
  if (!user || !user.authorities) return []

  if (typeof user.authorities === "string") {
    return user.authorities
      .split(";")
      .map((r) => r.trim() as UserRole)
      .filter((r) => r === "ADMIN" || r === "TECHNICAL")
  }

  return []
}

export function hasRole(
  user: User | null | undefined,
  role: UserRole
): boolean {
  const roles = mapUserRoles(user)
  return roles.includes(role)
}

export function getPrimaryRole(user: User | null | undefined): string {
  const roles = mapUserRoles(user)
  if (roles.includes("ADMIN")) return "Administrador"
  if (roles.includes("TECHNICAL")) return "Técnico"
  return "Sin Rol"
}
