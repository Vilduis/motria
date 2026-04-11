import api from "./api"
import type { Customer, DTOCustomer } from "@/types"

const customerService = {
    getAllCustomers: async (): Promise<Customer[]> => {
        const response = await api.get<Customer[]>("/customers")
        return response.data
    },

    getCustomer: async (id: number): Promise<Customer> => {
        const response = await api.get<Customer>(`/customers/${id}`)
        return response.data
    },

    createCustomer: async (customer: DTOCustomer): Promise<Customer> => {
        const response = await api.post<Customer>("/customers", customer)
        return response.data
    },

    updateCustomer: async (id: number, customer: DTOCustomer): Promise<Customer> => {
        const response = await api.put<Customer>(`/customers/${id}`, customer)
        return response.data
    },

    deleteCustomer: async (id: number): Promise<void> => {
        await api.delete(`/customers/${id}`)
    }
}

export default customerService
