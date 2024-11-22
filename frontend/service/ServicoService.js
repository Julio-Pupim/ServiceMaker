import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'http://localhost:8080/api/servicos';


// Função para recuperar o token do AsyncStorage
const getAuthToken = async () => {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      // Ambiente navegador
      console.log('pegou token', window.localStorage.getItem('jwt_token'))
      return window.localStorage.getItem('jwt_token');
      
    } else {
      // Ambiente móvel
      console.log(AsyncStorage.getItem('jwt_token'));
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
      console.log('interceptor')
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

const createServico = async (servicos) => {
  try {
    const response = await axiosInstance.post('', servicos);
    console.log('criou serviço')
    return response.data;
  } catch (error) {
    console.error('Erro ao criar serviço:', error);
    throw error;
  }
};

const getServicosByPrestador = async (idPrestador) => {
  try {
    const response = await axiosInstance.get(`/prestador/${idPrestador}`);
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar serviços do prestador:', error);
    throw error;
  }
};


// Funções CRUD utilizando axiosInstance com o token já configurado
const getAllServicos = async () => {
  try {
    const response = await axiosInstance.get();
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar todos os serviços:', error);
    throw error;
  }
};

const getServicoById = async (id) => {
  try {
    const response = await axiosInstance.get(`/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Erro ao buscar serviço com ID ${id}:`, error);
    throw error;
  }
};


const updateServico = async (id, servico) => {
  try {
    const response = await axiosInstance.put(`/${id}`, servico);
    return response.data;
  } catch (error) {
    console.error(`Erro ao atualizar serviço com ID ${id}:`, error);
    throw error;
  }
};

const deleteServico = async (id) => {
  try {
    await axiosInstance.delete(`/${id}`);
  } catch (error) {
    console.error(`Erro ao deletar serviço com ID ${id}:`, error);
    throw error;
  }
};

// Exportar todas as funções como um objeto
export default {
  getAllServicos,
  getServicoById,
  createServico,
  updateServico,
  deleteServico,
  getServicosByPrestador,
};
