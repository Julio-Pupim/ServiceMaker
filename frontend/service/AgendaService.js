import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'http://localhost:8080/api/agenda';  // Ajuste a URL conforme necessário

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

const getAllAgendas = async () => {
  try {
    const response = await axiosInstance.get('/');
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar todas as agendas:', error);
    throw error;
  }
};

const getAgendaById = async (id) => {
  try {
    const response = await axiosInstance.get(`/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Erro ao buscar agenda com ID ${id}:`, error);
    throw error;
  }
};

const createAgenda = async (agenda) => {
  try {
    const response = await axiosInstance.post('/', agenda);
    return response.data;
  } catch (error) {
    console.error('Erro ao criar agenda:', error);
    throw error;
  }
};

const updateAgenda = async (id, agenda) => {
  try {
    const response = await axiosInstance.put(`/${id}`, agenda);
    return response.data;
  } catch (error) {
    console.error(`Erro ao atualizar agenda com ID ${id}:`, error);
    throw error;
  }
};

const deleteAgenda = async (id) => {
  try {
    await axiosInstance.delete(`/${id}`);
  } catch (error) {
    console.error(`Erro ao deletar agenda com ID ${id}:`, error);
    throw error;
  }
};

// Exportar todas as funções como um objeto
export default {
  getAllAgendas,
  getAgendaById,
  createAgenda,
  updateAgenda,
  deleteAgenda,
};
