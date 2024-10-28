//config apiClient
import axios from "axios";
import { readData, storeData } from "./localStorage"; // Asegúrate de que estas funciones existan y funcionen correctamente

export const apiClient = axios.create({
  baseURL: 'http://localhost:3000', // Asegúrate de que esta URL sea accesible desde tu aplicación
  headers: {
    'Content-Type': 'application/json',
  },
});

// Al recibir el token en la respuesta, guardarlo
apiClient.interceptors.response.use(
  async (response) => {
    console.log(response.data.access_token);
    
    // Si el token de autenticación está en la respuesta
    if (response.data && response.data.access_token) { // Cambié response.auth_token a response.data.auth_token
      await storeData("accessToken", response.data.access_token);
    }
    return response;
  },
  async (error) => {
    console.log(error);
    const originalRequest = error.config; // Guardar la configuración original de la solicitud

    // Si hay un mecanismo para refrescar el token
    if (error.response && error.response.status === 401) {
      // Aquí podrías agregar lógica para refrescar el token si es necesario
      console.log("Token expirado, implementar lógica de refresco aquí.");
      // Ejemplo: 
      // const newToken = await refreshAuthToken(); 
      // await storeData("accessToken", newToken);
      // originalRequest.headers.Authorization = Bearer ${newToken};
      // return apiClient(originalRequest);
    }
    
    return Promise.reject(error);
  }
);

// En cada petición, agregar el token si está guardado
apiClient.interceptors.request.use(
  async (config) => {
    // Leer el token del almacenamiento
    const accessToken = await readData("accessToken");
    console.log("Access token value: ", accessToken);
    
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);
