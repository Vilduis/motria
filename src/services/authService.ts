import api from './api';
import type { LoginRequest, LoginResponse, DTOUser, User } from '../types';

const authService = {
    /**
     * Inicia sesión en el sistema.
     * Guarda el token y datos básicos en localStorage.
     */
    async login(credentials: LoginRequest): Promise<LoginResponse> {
        const response = await api.post<LoginResponse>('/users/login', credentials);
        const data = response.data;

        if (data.jwtToken) {
            localStorage.setItem('jwtToken', data.jwtToken);
            localStorage.setItem('userId', data.userId.toString());
            localStorage.setItem('userEmail', credentials.email);
            localStorage.setItem('authorities', data.authorities);
        }

        return data;
    },

    /**
     * Registra un nuevo usuario.
     */
    async register(userData: DTOUser): Promise<User> {
        const response = await api.post<User>('/users/register', userData);
        return response.data;
    },

    /**
     * Limpia la sesión del usuario.
     */
    logout(): void {
        localStorage.removeItem('jwtToken');
        localStorage.removeItem('userId');
        localStorage.removeItem('userEmail');
        localStorage.removeItem('authorities');
    },

    /**
     * Verifica si hay una sesión activa.
     */
    isAuthenticated(): boolean {
        return !!localStorage.getItem('jwtToken');
    },

    /**
     * Obtiene el rol/permisos del usuario.
     */
    getAuthorities(): string[] {
        let auths = localStorage.getItem('authorities');
        if (!auths) return [];
        
        // Limpiar corchetes si vienen del backend (formato [ROLE_ADMIN, ...])
        auths = auths.replace(/[\[\]]/g, '');
        
        // Dividir por punto y coma o coma, limpiar espacios y filtrar vacíos
        const roles = auths.split(/[;,]/).map(r => r.trim()).filter(r => r !== "");
        
        // Retornar valores únicos (Set)
        return [...new Set(roles)];
    },

    /**
     * Obtiene la información básica del usuario actual.
     */
    getCurrentUser() {
        return {
            id: localStorage.getItem('userId'),
            email: localStorage.getItem('userEmail') || 'usuario@taller.com',
            roles: this.getAuthorities()
        };
    }
};

export default authService;
