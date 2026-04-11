import api from "./api"
import type { Vehicle, DTOVehicle } from "@/types"

const vehicleService = {
    getAllVehicles: async (): Promise<Vehicle[]> => {
        const response = await api.get<Vehicle[]>("/vehicles")
        return response.data
    },

    getVehicle: async (id: number): Promise<Vehicle> => {
        const response = await api.get<Vehicle>(`/vehicles/${id}`)
        return response.data
    },

    getVehiclesByCustomer: async (customerId: number): Promise<Vehicle[]> => {
        const response = await api.get<Vehicle[]>(`/vehicles/customer/${customerId}`)
        return response.data
    },

    createVehicle: async (vehicle: DTOVehicle): Promise<Vehicle> => {
        const response = await api.post<Vehicle>("/vehicles", vehicle)
        return response.data
    },

    updateVehicle: async (id: number, vehicle: DTOVehicle): Promise<Vehicle> => {
        const response = await api.put<Vehicle>(`/vehicles/${id}`, vehicle)
        return response.data
    },

    deleteVehicle: async (id: number): Promise<void> => {
        await api.delete(`/vehicles/${id}`)
    }
}

export default vehicleService
