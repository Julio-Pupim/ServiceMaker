import axios from 'axios';

const API_URL = 'http://localhost:8080/api/contato';

const getAllContatos = () => {
  return axios.get(API_URL);
};

const getContatoById = (id) => {
  return axios.get(`${API_URL}/${id}`);
};

const createContato = (contato) => {
  return axios.post(API_URL, contato);
};

const updateContato = (id, contato) => {
  return axios.put(`${API_URL}/${id}`, contato);
};

const deleteContato = (id) => {
  return axios.delete(`${API_URL}/${id}`);
};

export default {
  getAllContatos,
  getContatoById,
  createContato,
  updateContato,
  deleteContato
};
