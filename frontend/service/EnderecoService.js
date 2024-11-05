import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'http://localhost:8080/api/endereco';

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

const getAllEnderecos = async () => {
  try {
    const response = await axiosInstance.get('/');
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar todos os endereços:', error);
    throw error;
  }
};

const getEnderecoById = async (id) => {
  try {
    const response = await axiosInstance.get(`/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Erro ao buscar endereço com ID ${id}:`, error);
    throw error;
  }
};

const createEndereco = async (endereco) => {
  try {
    const response = await axiosInstance.post('/', endereco);
    return response.data;
  } catch (error) {
    console.error('Erro ao criar endereço:', error);
    throw error;
  }
};

const updateEndereco = async (id, endereco) => {
  try {
    const response = await axiosInstance.put(`/${id}`, endereco);
    return response.data;
  } catch (error) {
    console.error(`Erro ao atualizar endereço com ID ${id}:`, error);
    throw error;
  }
};

const deleteEndereco = async (id) => {
  try {
    await axiosInstance.delete(`/${id}`);
  } catch (error) {
    console.error(`Erro ao deletar endereço com ID ${id}:`, error);
    throw error;
  }
};

// Exportar todas as funções como um objeto
export default {
  getAllEnderecos,
  getEnderecoById,
  createEndereco,
  updateEndereco,
  deleteEndereco,
};
