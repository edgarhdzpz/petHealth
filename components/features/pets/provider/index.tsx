import { createContext, useContext, useReducer, ReactNode } from "react";
import { getPetDetailsAPI, updatePetAPI, deletePetAPI } from "../../../../config/apiClient";

// Definir la interfaz para los datos de la mascota
interface PetData {
  id: string;
  name: string;
  species: string;
  breed: string;
  color: string;
  birthDate: string;
}

interface PetProfileState {
  pet: PetData | null;
  loading: boolean;
  error: string;
  message: string;
  isEditModalOpen: boolean;
}

interface PetProfileContextDefinition extends PetProfileState {
  fetchPetDetails: (id: string) => Promise<void>;
  updatePet: (id: string, petData: Partial<PetData>) => Promise<void>;
  deletePet: (id: string) => Promise<void>;
  setEditModalOpen: (isOpen: boolean) => void;
  setDeleteModalOpen: (isOpen: boolean) => void;
  clearMessage: () => void;
  clearError: () => void;
}

type PetProfileActionType =
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_PET"; payload: PetData | null }
  | { type: "SET_ERROR"; payload: string }
  | { type: "SET_MESSAGE"; payload: string }
  | { type: "SET_EDIT_MODAL_OPEN"; payload: boolean }
  | { type: "CLEAR_MESSAGE" }
  | { type: "CLEAR_ERROR" };

const initialState: PetProfileState = {
  pet: null,
  loading: false,
  error: "",
  message: "",
  isEditModalOpen: false,
};

function petProfileReducer(state: PetProfileState, action: PetProfileActionType): PetProfileState {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, loading: action.payload };
    case "SET_PET":
      return { ...state, pet: action.payload, loading: false };
    case "SET_ERROR":
      return { ...state, error: action.payload, loading: false };
    case "SET_MESSAGE":
      return { ...state, message: action.payload };
    case "SET_EDIT_MODAL_OPEN":
      return { ...state, isEditModalOpen: action.payload };
    case "CLEAR_MESSAGE":
      return { ...state, message: "" };
    case "CLEAR_ERROR":
      return { ...state, error: "" };
    default:
      return state;
  }
}

const PetProfileContext = createContext<PetProfileContextDefinition | undefined>(undefined);

export const PetProfileProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(petProfileReducer, initialState);

  const setLoading = (isLoading: boolean) => 
    dispatch({ type: "SET_LOADING", payload: isLoading });
  
  const setError = (errorMsg: string) => 
    dispatch({ type: "SET_ERROR", payload: errorMsg });
  
  const setMessage = (msg: string) => 
    dispatch({ type: "SET_MESSAGE", payload: msg });
  
  const setEditModalOpen = (isOpen: boolean) => 
    dispatch({ type: "SET_EDIT_MODAL_OPEN", payload: isOpen });
  
  const clearMessage = () => 
    dispatch({ type: "CLEAR_MESSAGE" });
  
  const clearError = () => 
    dispatch({ type: "CLEAR_ERROR" });

  const handleAPIError = (error: any, defaultMessage: string) => {
    const errorMessage = error.response?.data?.message || defaultMessage;
    setError(errorMessage);
    console.error('API Error:', errorMessage, error);
  };

  const fetchPetDetails = async (id: string) => {
    setLoading(true);
    try {
      const response = await getPetDetailsAPI(id);
      console.log('Vaccinations fetched:', response.data);
      dispatch({ type: "SET_PET", payload: response.data.pet });
      clearError();
    } catch (error) {
      handleAPIError(error, "Error al cargar los detalles de la mascota.");
    }
  };

  const updatePet = async (id: string, petData: Partial<PetData>) => {
    setLoading(true);
    try {
      await updatePetAPI(id, petData);
      setMessage("Mascota actualizada exitosamente.");
      await fetchPetDetails(id);
      setEditModalOpen(false);
    } catch (error) {
      handleAPIError(error, "Error al actualizar la mascota.");
    } finally {
      setLoading(false);
    }
  };

  const deletePet = async (id: string) => {
    setLoading(true);
    try {
      await deletePetAPI(id);
      setMessage("Mascota eliminada exitosamente.");
      
      dispatch({ type: "SET_PET", payload: null });
      // Opcional: podrías navegar de vuelta a la pantalla de inicio si se eliminó con éxito
      //router.push("/home"); // Si el router está disponible aquí
      
    } catch (error) {
      handleAPIError(error, "Error al eliminar la mascota.");
    } finally {
      setLoading(false);
     }
  };

  return (
    <PetProfileContext.Provider
      value={{
        ...state,
        fetchPetDetails,
        updatePet,
        deletePet,
        setEditModalOpen,
        clearMessage,
        clearError,
      }}
    >
      {children}
    </PetProfileContext.Provider>
  );
};

export const usePetProfile = () => {
  const context = useContext(PetProfileContext);
  if (!context) {
    throw new Error("usePetProfile debe usarse dentro de un PetProfileProvider");
  }
  return context;
};