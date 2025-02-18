import axios from "axios";

const apiKey= "$2b$10$mipurcIo2A1T2Wyg.yt4oOufazXKOWMCZg8SqtmofhHOLhXZXolKu";

const envioApi = axios.create({
  baseURL: "/api", // URL de la API de envíos
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${apiKey}`,
  },
  withCredentials: true, // Habilita el envío de cookies en las solicitudes
});

// Interceptor para agregar el token a cada solicitud

envioApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      obtenerToken();
    }
    return Promise.reject(error);
  }
);

const obtenerToken = async () => {
  try {
    const response = await axios.post(
      "/api/auth/login",
      {
        email: "admin@quicksolutions.com",
        password: "admin123"
      },
      { withCredentials: true }
    );
    console.log("✅ Token de logística obtenido");
  } catch (error) {
    console.error("❌ Error al obtener el token:", error);
    throw error;
  }
};

// Servicio para manejar envíos
const envioService = {
  getLocalidades: async () => {
    const response = await axios.get("/api/localidades", {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  },

  postEnvio: async (envioData) => {
    const response = await envioApi.post("/envios/create", envioData, { withCredentials: true });
    return response.data;
  },

  getEnvio: async (id) => {
    const response = await envioApi.get(`/envios/nro-seguimiento/${id}`, { withCredentials: true });
    return response.data;
  },

  getUuidAdmin: async () => {const response = await envioApi.post("/envios/create", envioData, { withCredentials: true });
  return response.data;},

  //obtenerEnvio: async (envioId) => envioApi.get(`/envios/${envioId}`),

  //cancelarEnvio: async (envioId) => envioApi.delete(`/envios/${envioId}`),
};

export default envioService;