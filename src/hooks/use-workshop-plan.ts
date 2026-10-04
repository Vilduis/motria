import { useEffect, useState } from "react"
import authService from "@/services/authService"
import workshopService from "@/services/workshopService"

export type PlanId = "FREE" | "PRO"

// One request per workshop for the whole session: the user menu, Mi cuenta
// and the plans page all read the plan from here.
const cache = new Map<number, Promise<PlanId>>()

function loadPlan(workshopId: number) {
  let request = cache.get(workshopId)
  if (!request) {
    request = workshopService
      .getById(workshopId)
      .then((w) => (w.plan?.toUpperCase() === "PRO" ? "PRO" : "FREE"))
    request.catch(() => cache.delete(workshopId))
    cache.set(workshopId, request)
  }
  return request
}

/**
 * The workshop's plan. Only admins see it (they are the ones who pay);
 * for anyone else `plan` stays null and nothing is requested.
 */
export function useWorkshopPlan() {
  const { roles, workshopId } = authService.getCurrentUser()
  const enabled = roles.includes("ADMIN") && !!workshopId
  const [plan, setPlan] = useState<PlanId | null>(null)
  const [loading, setLoading] = useState(enabled)

  useEffect(() => {
    if (!enabled || !workshopId) return
    let cancelled = false
    loadPlan(workshopId)
      .then((p) => !cancelled && setPlan(p))
      .catch(() => !cancelled && setPlan("FREE"))
      .finally(() => !cancelled && setLoading(false))
    return () => {
      cancelled = true
    }
  }, [enabled, workshopId])

  return { plan, loading, enabled }
}
