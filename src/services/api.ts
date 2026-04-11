import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

// Instancia base de Axios
const api = axios.create({
    baseURL: BASE_URL,
    headers: { 'Content-Type': 'application/json' },
});

// ─── Interceptor REQUEST ───────────────────────────────
// Agrega el token JWT automáticamente en cada petición
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('jwtToken');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// ─── Interceptor RESPONSE ─────────────────────────────
// Si el backend responde 401 (token inválido/expirado) → limpia sesión
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('jwtToken');
            localStorage.removeItem('userId');
            localStorage.removeItem('authorities');
            window.location.href = '/login'; // redirige al login
        }
        return Promise.reject(error);
    }
);

export default api;