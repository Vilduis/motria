import api from "./api"
import type { Technical, DTOTechnical } from "@/types"

const technicalService = {
    getAllTechnicals: async (): Promise<Technical[]> => {
        const response = await api.get<Technical[]>("/technicals")
        return response.data
    },

    getTechnical: async (id: number): Promise<Technical> => {
        const response = await api.get<Technical>(`/technicals/${id}`)
        return response.data
    },

    createTechnical: async (technical: DTOTechnical): Promise<Technical> => {
        const response = await api.post<Technical>("/technicals", technical)
        return response.data
    },

    updateTechnical: async (id: number, technical: DTOTechnical): Promise<Technical> => {
        const response = await api.put<Technical>(`/technicals/${id}`, technical)
        return response.data
    },

    deleteTechnical: async (id: number): Promise<void> => {
        await api.delete(`/technicals/${id}`)
    }
}

export default technicalService
