import api from "./api"
import type { DashboardAdmin, DashboardTecnico } from "@/types"

const dashboardService = {
  /** Fetches global statistics for Admin role */
  getAdminDashboard: async (): Promise<DashboardAdmin> => {
    const response = await api.get<DashboardAdmin>("/dashboard/admin")
    return response.data
  },

  /** Fetches personalized statistics for a specific technician */
  getTecnicoDashboard: async (technicalId: number): Promise<DashboardTecnico> => {
    const response = await api.get<DashboardTecnico>(`/dashboard/tecnico/${technicalId}`)
    return response.data
  }
}

export default dashboardService
