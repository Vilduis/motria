import api from './api';
import type { Workshop, UpdateWorkshopRequest } from '../types';

const workshopService = {
    async getById(id: number): Promise<Workshop> {
        const response = await api.get<Workshop>(`/workshops/${id}`);
        return response.data;
    },

    async update(id: number, payload: UpdateWorkshopRequest): Promise<Workshop> {
        const response = await api.put<Workshop>(`/workshops/${id}`, payload);
        return response.data;
    },
};

export default workshopService;
