import api from "./api"
import type { ServiceOrder, DTOServiceOrder, OrderStatus } from "@/types"

const orderService = {
    getAllOrders: async (): Promise<ServiceOrder[]> => {
        const response = await api.get<ServiceOrder[]>("/service-orders")
        return response.data
    },

    getOrder: async (id: number): Promise<ServiceOrder> => {
        const response = await api.get<ServiceOrder>(`/service-orders/${id}`)
        return response.data
    },

    getOrdersByTechnical: async (technicalId: number): Promise<ServiceOrder[]> => {
        const response = await api.get<ServiceOrder[]>(`/service-orders/technical/${technicalId}`)
        return response.data
    },

    getOrdersByStatus: async (status: OrderStatus): Promise<ServiceOrder[]> => {
        const response = await api.get<ServiceOrder[]>(`/service-orders/status/${status}`)
        return response.data
    },

    createOrder: async (order: DTOServiceOrder): Promise<ServiceOrder> => {
        const response = await api.post<ServiceOrder>("/service-orders", order)
        return response.data
    },

    updateOrder: async (id: number, order: DTOServiceOrder): Promise<ServiceOrder> => {
        const response = await api.put<ServiceOrder>(`/service-orders/${id}`, order)
        return response.data
    },

    // TÉCNICO: actualizar únicamente el estado de su orden (usando PATCH y Query Param)
    updateOrderStatus: async (id: number, status: OrderStatus): Promise<ServiceOrder> => {
        const response = await api.patch<ServiceOrder>(`/service-orders/${id}/status`, null, {
            params: { status }
        })
        return response.data
    },

    deleteOrder: async (id: number): Promise<void> => {
        await api.delete(`/service-orders/${id}`)
    }
}

export default orderService
