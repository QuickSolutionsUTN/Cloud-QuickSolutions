import axios from "axios";

const api = axios.create({
  baseURL: "https://localhost:7216/api",
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

  // Mantenimientos
  getMaintenanceRequests: () => api.get("/mantenimiento"),
  createMaintenanceRequest: (data) => api.post("/mantenimiento", data),
  deleteMaintenanceRequest: (id) => api.delete(`/mantenimiento/${id}`),

  getProducts: () => api.get("/tipoProducto"),

  createMaintenanceRequest: (data) => api.post("/mantenimiento", data),
};

export default apiService;
