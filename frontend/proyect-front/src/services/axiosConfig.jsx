import axios from "axios";
import { get } from "react-hook-form";

const api = axios.create({
  baseURL: "http://127.0.0.1:8000/api",
  headers: {
    "Content-Type": "application/json",
  },
});


// Interceptor para agregar el token en cada petición
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor para manejar respuestas con error
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.error("No autorizado, redirigir a login");
      // Aquí puedes manejar el logout o redirección al login
    }
    return Promise.reject(error);
  }
);

// Funciones centralizadas para manejar peticiones

const apiService = {
  // Auth
  /*login: (credentials) => api.post("/auth/login", credentials),
  register: (data) => api.post("/auth/register", data),

  // Usuarios
  getUsers: () => api.get("/users"),
  getUserById: (id) => api.get(`/users/${id}`),
  updateUser: (id, data) => api.put(`/users/${id}`, data),
  deleteUser: (id) => api.delete(`/users/${id}`),*/

  getRequestsAdmin: () => api.get("/solicitud"),
  // Mantenimientos
  getMaintenanceArray: () => api.get("/mantenimiento"),
  createMaintenance: (data) => api.post("/mantenimiento", data),
  updateMaintenance: (data) => api.put(`/mantenimiento/${data.id}`, data),
  deleteMaintenance: (id) => api.delete(`/mantenimiento/${id}`),

  getCategories: () => api.get("/categorias"),

  getProducts: () => api.get("/tipoProducto"),
  getProductByCatId: (id) => api.get(`/tipoProducto/${id}`),

  createRequest: (data) => api.post("/solicitud/", data),

  updateRequestStateAdmin: (data) => api.put(`/solicitud/estado-admin`, data),
  updateRequestReviewed: (id) => api.put(`/solicitud/${id}/iniciar`),
  updateRequestBudgetAdmin: (data) => api.put(`/solicitud/${data.id}/presupuestar`, data),
  updateRequestFinished: (data) => api.put(`/solicitud/${data.id}/finalizar`, data),
  updateRequestUser: (data) => api.put(`/solicitud/${data.id}/estado-usuario`, data),
  updateRequestSubcontractAdmin: (data) => api.put(`/solicitud/${data.id}/subcontratar`, data),

  updateRequestDeliverAdmin: (id, data) => api.put(`/solicitud/${id}/envio`, data),
};

export default apiService;
