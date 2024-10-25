import axios from 'axios';

const API_URL = 'http://localhost:8080/api/servico';

const getAllServicos = () => {
  return axios.get(API_URL);
};

const getServicoById = (id) => {
  return axios.get(`${API_URL}/${id}`);
};

const createServico = (servico) => {
  return axios.post(API_URL, servico);
};

const updateServico = (id, servico) => {
  return axios.put(`${API_URL}/${id}`, servico);
};

const deleteServico = (id) => {
  return axios.delete(`${API_URL}/${id}`);
};

export default {
  getAllServicos,
  getServicoById,
  createServico,
  updateServico,
  deleteServico
};
