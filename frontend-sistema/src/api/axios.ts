import axios from 'axios';

// Cliente para AUTH (Puerto 3001)
export const authApi = axios.create({
  baseURL: 'http://localhost:3001',
});

// Cliente para CORE/Inventario/Ventas (Puerto 3002)
export const coreApi = axios.create({
    baseURL: 'http://localhost:3002',
});

// Interceptor: Antes de cada petición al CORE, inyectar el Token si existe
coreApi.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});