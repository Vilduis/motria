import api from "./api"
import type { User, DTOUser } from "@/types"

/**
 * El backend solo expone GET / PUT / DELETE para /users.
 * Los usuarios se crean a través de /auth/register-workshop (admin) y POST /technicals.
 * El PUT ignora `authorities` (el rol no se cambia desde aquí).
 */
const userService = {
    getAllUsers: async (): Promise<User[]> => {
        const response = await api.get<User[]>("/users")
        return response.data
    },

    getUser: async (id: number): Promise<User> => {
        const response = await api.get<User>(`/users/${id}`)
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
