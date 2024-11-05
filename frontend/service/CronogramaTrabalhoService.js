import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'http://localhost:8080/api/cronograma-trabalho';

// Função para recuperar o token do AsyncStorage
const getAuthToken = async () => {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      // Ambiente navegador
      return window.localStorage.getItem('jwt_token');
    } else {
      // Ambiente móvel
      return await AsyncStorage.getItem('jwt_token');
    }
  } catch (error) {
    console.error('Erro ao recuperar token:', error);
    return null;
  }
};

// Configurar o Axios para adicionar o token no cabeçalho Authorization de cada requisição
const axiosInstance = axios.create({
  baseURL: API_URL,
});

// Interceptador para adicionar o token a cada requisição
axiosInstance.interceptors.request.use(
  async (config) => {
    const token = await getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Funções CRUD utilizando axiosInstance com o token já configurado

const getAllCronogramas = async () => {
  try {
    const response = await axiosInstance.get('/');
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar todos os cronogramas:', error);
    throw error;
  }
};

const getCronogramaById = async (id) => {
  try {
    const response = await axiosInstance.get(`/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Erro ao buscar cronograma com ID ${id}:`, error);
    throw error;
  }
};

const createCronograma = async (cronograma) => {
  try {
    const response = await axiosInstance.post('/', cronograma);
    return response.data;
  } catch (error) {
    console.error('Erro ao criar cronograma:', error);
    throw error;
  }
};

const updateCronograma = async (id, cronograma) => {
  try {
    const response = await axiosInstance.put(`/${id}`, cronograma);
    return response.data;
  } catch (error) {
    console.error(`Erro ao atualizar cronograma com ID ${id}:`, error);
    throw error;
  }
};

const deleteCronograma = async (id) => {
  try {
    await axiosInstance.delete(`/${id}`);
  } catch (error) {
    console.error(`Erro ao deletar cronograma com ID ${id}:`, error);
    throw error;
  }
};

// Exportar todas as funções como um objeto
export default {
  getAllCronogramas,
  getCronogramaById,
  createCronograma,
  updateCronograma,
  deleteCronograma,
};
