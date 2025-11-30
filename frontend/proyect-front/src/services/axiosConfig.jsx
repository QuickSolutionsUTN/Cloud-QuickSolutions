import axios from "axios";

const api = axios.create({
  baseURL: "http://127.0.0.1:8000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

const getUserToken = () => {
  try {
    // Buscar la clave de sesión de Supabase (ej. 'sb-abc-123-auth-token')
    const supabaseKey = Object.keys(localStorage).find(key => key.includes('sb-') && key.endsWith('-auth-token'));

    if (supabaseKey) {
      const sessionData = localStorage.getItem(supabaseKey);
      if (sessionData) {
        // Parsear y devolver el access_token del objeto de sesión
        const session = JSON.parse(sessionData);
        // Supabase guarda el token bajo el campo 'access_token' en el objeto JSON
        return session.access_token || null;
      }
    }
    // Si no encuentra la clave con el formato de Supabase, regresa a la clave simple (menos común)
    return localStorage.getItem("access_token") || null;

  } catch (e) {
    console.error("Error al obtener token de localStorage:", e);
    return null;
  }
};

// Interceptor para agregar el token en cada petición
api.interceptors.request.use(
  (config) => {
    const userToken = getUserToken();
    if (userToken) {
      config.headers.Authorization = `Bearer ${userToken}`;
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
  // Dashboard optimizado (1 sola llamada)
  getDashboardStats: () => api.get("/dashboard/stats/"),
  
  getRequestsAdmin: () => api.get("/solicitud/"),
  getRequestById: (id) => api.get(`/solicitud/${id}/`),
  
  // Perfiles
  getProfiles: () => api.get("/perfiles/"),
  getUserProfile: (userId) => api.get(`/perfiles/${userId}/`),
  updateUserProfile: (userId, data) => api.put(`/perfiles/${userId}/`, data),
  deleteUserProfile: (userId) => api.delete(`/perfiles/${userId}/`),
  //Domicilio
  updateDomicilio: (userId, data) => api.put(`/perfiles/${userId}/domicilio/`, data),
  deleteDomicilio: (userId) => api.delete(`/perfiles/${userId}/domicilio/`),

  // Mantenimientos
  getMaintenanceArray: () => api.get("/mantenimiento/"),
  createMaintenance: (data) => api.post("/mantenimiento/", data),
  updateMaintenance: (data) => api.put(`/mantenimiento/${data.id}/`, data),
  deleteMaintenance: (id) => api.delete(`/mantenimiento/${id}/`),
 
  //Categorias
  getCategories: () => api.get("/categorias/"),
  createCategory: (data) => api.post("/categorias/", data),
  updateCategory: (data) => api.put(`/categorias/${data.id}/`, data),
  deleteCategory: (id) => api.delete(`/categorias/${id}/`),

  //Productos
  getProducts: () => api.get("/productos/"),
  getProductByCatId: (id) => api.get(`/productos/categoria/${id}/`),
  createProduct: (data) => api.post("/productos/", data),
  updateProduct: (data) => api.put(`/productos/${data.id}/`, data),
  deleteProduct: (id) => api.delete(`/productos/${id}/`),

  // Solicitudes
  getRequestsAdmin: () => api.get("/solicitudes/"),
  createRequest: (data) => api.post("/solicitud/", data),
  getRequestByIdAdmin: (id) => api.get(`/solicitud/${id}/`),
  updateRequestStateAdmin: (data) => api.put(`/solicitud/estado-admin`, data),
  updateRequestReviewed: (id) => api.put(`/solicitud/${id}/iniciar`),
  updateRequestBudgetAdmin: (data) => api.put(`/solicitud/${data.id}/presupuestar`, data),
  updateRequestFinished: (data) => api.put(`/solicitud/${data.id}/finalizar`, data),
  updateRequestUser: (data) => api.put(`/solicitud/${data.id}/estado-usuario`, data),

  // Solicitudes del usuario
  getUserRequests: () => api.get("/solicitud/mis-solicitudes/"),
  cancelRequest: (id) => api.put(`/solicitud/${id}/cancelar/`),

  // Provincia
  getStates: () => api.get("/provincias/"),
  // Localidades
  getLocalityByStateId: (stateId) => api.get(`/localidades/`, { params: { provincia_id: stateId } }),
  // Estados de solicitud
  getDetailServiceState: (id) => api.get(`/solicitud-estado/${id}/`),
};

export default apiService;
