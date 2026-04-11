import api from "./api"
import type { User, DTOUser } from "@/types"

const userService = {
    getAllUsers: async (): Promise<User[]> => {
        const response = await api.get<User[]>("/users")
        return response.data
    },

    getUser: async (id: number): Promise<User> => {
        const response = await api.get<User>(`/users/${id}`)
        return response.data
    },

    createUser: async (user: DTOUser): Promise<User> => {
        const response = await api.post<User>("/users/register", user)
        return response.data
    },

    updateUser: async (id: number, user: DTOUser): Promise<User> => {
        const response = await api.put<User>(`/users/${id}`, user)
        return response.data
    },

    deleteUser: async (id: number): Promise<void> => {
        await api.delete(`/users/${id}`)
    }
}

export default userService
