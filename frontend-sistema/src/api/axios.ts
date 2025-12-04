import axios from 'axios';

// Cliente para AUTH (Usa la URL de tu primer servicio de Render)
export const authApi = axios.create({
  baseURL: 'https://sistema-auth.onrender.com', 
});

// Cliente para CORE (Usa la URL de tu segundo servicio de Render)
export const coreApi = axios.create({
    baseURL: 'https://sistema-core-5diz.onrender.com',
});

// Interceptor: Antes de cada petición al CORE, inyectar el Token si existe
coreApi.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});