import { createContext, useContext, useReducer } from "react";
import { apiClient } from "../../../../config/apiClient";
import { storeData, readData, removeData } from "../../../../config/localStorage";
import axios, { isAxiosError } from "axios";

interface ContextDefinition {
  loading: boolean;
  user: any;
  message: string;
  login: (email: string, password: string) => void;
  logout: () => void;
  register: (name: string, email: string, password: string, confirmPassword: string) => void;
}

const SessionContext = createContext({} as ContextDefinition);

interface SessionState {
  loading: boolean;
  user: any;
  message: string;
}

type SessionActionType =
  | { type: "Set loading"; payload: boolean }
  | { type: "Set user"; payload: any }
  | { type: "Set message"; payload: string };

const initialState: SessionState = {
  loading: false,
  user: null,
  message: "",
};

// Reducer: manipular el estado y retornar un nuevo estado
function sessionReducer(
  state: SessionState,
  action: SessionActionType
) {
  switch (action.type) {
    case "Set loading":
      return {
        ...state,
        loading: action.payload,
      };
    case "Set user":
      return {
        ...state,
        user: action.payload,
        loading: false,
      };
    case "Set message":
      return {
        ...state,
        message: action.payload,
      };
    default:
      return state;
  }
}

const SessionProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(sessionReducer, initialState);

  const login = async (email: string, password: string) => {
    dispatch({ type: "Set loading", payload: true });

    try {
      // Llamada a la API para el inicio de sesión
      const response = await apiClient.post("/auth/login", { email, password });
      const { user, accessToken } = response.data;

      // Guardar el token y establecer el estado del usuario
      await storeData("accessToken", accessToken);

      dispatch({ type: "Set user", payload: user });
      dispatch({ type: "Set message", payload: "Usuario autenticado." });
    } catch (error: unknown) {
      console.error("Error al iniciar sesión:", error);

      // Verificación del tipo de error para asegurarnos de que sea un error de Axios
      if (axios.isAxiosError(error) && error.response) {
        // Extraer el mensaje del error de la API
        const errorMessage = error.response.data?.message || "Error al iniciar sesión.";
        dispatch({ type: "Set message", payload: errorMessage });
      } else {
        // Mensaje de error genérico para cualquier otro tipo de error
        dispatch({ type: "Set message", payload: "Error al iniciar sesión." });
      }
    } finally {
      dispatch({ type: "Set loading", payload: false });
    }
  };



  const logout = async () => {
    try {
      // Llamada a la API para cerrar sesión (opcional, si la API lo soporta)
      await apiClient.post("/logout");

      // Eliminar el token del almacenamiento y limpiar el estado del usuario
      await removeData("accessToken");

      dispatch({ type: "Set user", payload: null });
      dispatch({ type: "Set message", payload: "Sesión cerrada." });
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
      dispatch({
        type: "Set message",
        payload: "No se pudo cerrar sesión.",
      });
    }
  };

  // Función para registrar un nuevo usuario
  const register = async (name: string, email: string, password: string, confirmPassword: string) => {
    dispatch({ type: "Set loading", payload: true });

    // Verificar que las contraseñas coinciden
    if (password !== confirmPassword) {
      dispatch({ type: "Set message", payload: "Las contraseñas no coinciden." });
      dispatch({ type: "Set loading", payload: false });
      return;
    }

    try {
      // Llamar a la API para registrar al usuario
      const response = await apiClient.post('/users/register', {
        name,
        email,
        password,
      });

      console.log("Respuesta de la API:", response.data);

      const { data } = response;
      if (data && data.user) {
        console.log("Token recibido:", data.accessToken);

        dispatch({ type: "Set user", payload: data.user });
        dispatch({ type: "Set message", payload: "Usuario registrado con éxito." });
      }
    } catch (error: any) {
      console.error("Error al registrar usuario:", error);

      // Captura el mensaje de error específico del servidor si está disponible
      const errorMessage = error.response?.data?.message || "Error al registrar el usuario.";
      dispatch({ type: "Set message", payload: errorMessage });
    } finally {
      dispatch({ type: "Set loading", payload: false });
    }
  };


  return (
    <SessionContext.Provider
      value={{
        ...state,
        login,
        logout,
        register,
      }}
    >
      {children}
    </SessionContext.Provider>
  );
};

// Función hook para consumir el estado de la sesión
function useSessionState() {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error("useSessionState() no puede usarse fuera de SessionProvider");
  }

  return context;
}

export {
  SessionProvider,
  useSessionState,
};
// import { ReactNode } from "react";
// import login from "../../../../app/auth/login";
// import register from "../../../../app/auth/register";
