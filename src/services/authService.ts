import api from './api';
import type {
    LoginRequest,
    LoginResponse,
    RegisterWorkshopRequest,
    ChangePasswordRequest,
    ForgotPasswordRequest,
    ResetPasswordRequest,
    MeResponse,
} from '../types';

const STORAGE_KEYS = {
    token: 'jwtToken',
    userId: 'userId',
    email: 'userEmail',
    displayName: 'displayName',
    authorities: 'authorities',
    workshopId: 'workshopId',
    workshopName: 'workshopName',
    mustChangePassword: 'mustChangePassword',
} as const;

function persistSession(data: LoginResponse, email: string) {
    localStorage.setItem(STORAGE_KEYS.token, data.jwtToken);
    localStorage.setItem(STORAGE_KEYS.userId, data.userId.toString());
    localStorage.setItem(STORAGE_KEYS.email, email);
    localStorage.setItem(STORAGE_KEYS.authorities, data.authorities ?? '');
    localStorage.setItem(STORAGE_KEYS.workshopId, data.workshopId?.toString() ?? '');
    localStorage.setItem(STORAGE_KEYS.workshopName, data.workshopName ?? '');
    localStorage.setItem(
        STORAGE_KEYS.mustChangePassword,
        data.mustChangePassword ? 'true' : 'false'
    );
}

const authService = {
    async login(credentials: LoginRequest): Promise<LoginResponse> {
        const response = await api.post<LoginResponse>('/auth/login', credentials);
        const data = response.data;
        if (data.jwtToken) {
            persistSession(data, credentials.email);
        }
        return data;
    },

    /**
     * Registra un nuevo taller (alta de admin) en POST /api/auth/register-workshop.
     * El backend responde con DTOToken, así que dejamos al usuario logueado.
     */
    async registerWorkshop(payload: RegisterWorkshopRequest): Promise<LoginResponse> {
        const response = await api.post<LoginResponse>('/auth/register-workshop', payload);
        const data = response.data;
        if (data.jwtToken) {
            persistSession(data, payload.email);
        }
        return data;
    },

    /**
     * Cambia la contraseña del usuario autenticado (POST /api/auth/change-password).
     * Tras un cambio exitoso, baja el flag mustChangePassword.
     */
    async changePassword(payload: ChangePasswordRequest): Promise<void> {
        await api.post('/auth/change-password', payload);
        localStorage.setItem(STORAGE_KEYS.mustChangePassword, 'false');
    },

    /**
     * Solicita un enlace de recuperación (POST /api/auth/forgot-password).
     * El backend siempre responde 204 (anti-enumeración).
     */
    async forgotPassword(payload: ForgotPasswordRequest): Promise<void> {
        await api.post('/auth/forgot-password', payload);
    },

    async resetPassword(payload: ResetPasswordRequest): Promise<void> {
        await api.post('/auth/reset-password', payload);
    },

    /**
     * Verifica la sesión actual contra el backend (GET /api/auth/me).
     * Sincroniza authorities, mustChangePassword y workshopName en localStorage.
     */
    async me(): Promise<MeResponse> {
        const response = await api.get<MeResponse>('/auth/me');
        const data = response.data;
        localStorage.setItem(STORAGE_KEYS.authorities, data.authorities ?? '');
        localStorage.setItem(STORAGE_KEYS.workshopName, data.workshopName ?? '');
        localStorage.setItem(STORAGE_KEYS.displayName, data.displayName ?? '');
        localStorage.setItem(
            STORAGE_KEYS.mustChangePassword,
            data.mustChangePassword ? 'true' : 'false'
        );
        return data;
    },

    logout(): void {
        Object.values(STORAGE_KEYS).forEach((key) => localStorage.removeItem(key));
        sessionStorage.removeItem('sessionVerified');
    },

    isAuthenticated(): boolean {
        return !!localStorage.getItem(STORAGE_KEYS.token);
    },

    mustChangePassword(): boolean {
        return localStorage.getItem(STORAGE_KEYS.mustChangePassword) === 'true';
    },

    getAuthorities(): string[] {
        let auths = localStorage.getItem(STORAGE_KEYS.authorities);
        if (!auths) return [];
        auths = auths.replace(/[[\]]/g, '');
        const roles = auths.split(/[;,]/).map((r) => r.trim()).filter((r) => r !== '');
        return [...new Set(roles)];
    },

    getCurrentUser() {
        const workshopId = localStorage.getItem(STORAGE_KEYS.workshopId);
        const email = localStorage.getItem(STORAGE_KEYS.email) || 'usuario@taller.com';
        const cachedDisplay = localStorage.getItem(STORAGE_KEYS.displayName) || '';
        // Fallback: prefijo del email mientras /auth/me aún no responde.
        const displayName = cachedDisplay || email.split('@')[0] || email;
        return {
            id: localStorage.getItem(STORAGE_KEYS.userId),
            email,
            displayName,
            roles: this.getAuthorities(),
            workshopId: workshopId ? Number(workshopId) : null,
            workshopName: localStorage.getItem(STORAGE_KEYS.workshopName) || '',
        };
    },
};

export default authService;
