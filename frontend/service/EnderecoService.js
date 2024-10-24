import axios from 'axios';

const API_URL = 'http://localhost:8080/api/endereco';

const getAllEnderecos = () => {
  return axios.get(API_URL);
};

const getEnderecoById = (id) => {
  return axios.get(`${API_URL}/${id}`);
};

const createEndereco = (endereco) => {
  return axios.post(API_URL, endereco);
};

const updateEndereco = (id, endereco) => {
  return axios.put(`${API_URL}/${id}`, endereco);
};

const deleteEndereco = (id) => {
  return axios.delete(`${API_URL}/${id}`);
};

export default {
  getAllEnderecos,
  getEnderecoById,
  createEndereco,
  updateEndereco,
  deleteEndereco
};
