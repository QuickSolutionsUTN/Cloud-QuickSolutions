import axios from "axios";

const apiKey= "mi_api_key";

const bolsaTrabajoApi = axios.create({
  baseURL: "http://127.0.0.1:8000/app", // URL de la API de
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Habilita el envío de cookies en las solicitudes
});




// Interceptor para agregar el token a cada solicitud

/*envioApi.interceptors.response.use(
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
};*/

const apiReparacionExterna = {
  getTrabajadores: async () => {
    const response = await bolsaTrabajoApi.get("/interaccion");
    return response.data;
  },

  /*
  postEnvio: async (envioData) => {
    const response = await envioApi.post("/envios/create", envioData, { withCredentials: true });
    return response.data;
  },

  getEnvio: async (id) => {
    const response = await envioApi.get(`/envios/nro-seguimiento/${id}`, { withCredentials: true });
    return response.data;
  },

  getUuidAdmin: async () => {const response = await envioApi.post("/envios/create", envioData, { withCredentials: true });
  return response.data;},*/

};

export default apiReparacionExterna;