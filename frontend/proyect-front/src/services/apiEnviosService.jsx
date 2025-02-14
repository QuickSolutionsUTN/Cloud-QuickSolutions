import axios from "axios";

const envioApi = axios.create({
  baseURL: "http://localhost:3001", // URL de la API de envíos
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Habilita el envío de cookies en las solicitudes
});

// Función para obtener el token desde la cookie
const getTokenFromCookie = () => Cookies.get("logisticaToken");

// Interceptor para agregar el token a cada solicitud
envioApi.interceptors.request.use(
  (config) => {
    const token = getTokenFromCookie();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      console.warn("⚠ No hay token de logística en las cookies.");
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Servicio para manejar envíos
const envioService = {
  generarEnvio: async (solicitudId, direccion) => {
    try {
      const response = await envioApi.post("/envios", { solicitudId, direccion });
      return response.data;
    } catch (error) {
      console.error("❌ Error al generar el envío:", error);
      throw error;
    }
  },

  obtenerEnvio: async (envioId) => envioApi.get(`/envios/${envioId}`),

  cancelarEnvio: async (envioId) => envioApi.delete(`/envios/${envioId}`),
};

export default envioService;