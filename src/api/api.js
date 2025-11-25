import axios from 'axios';

// ¡AQUÍ PEGA TU URL DE RAILWAY! (La misma que pusiste en el celular)
const API_URL = 'https://inventario-backend-production-92a2.up.railway.app/api'; 

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export default api;