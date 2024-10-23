import axios from 'axios';

const API_URL = 'http://localhost:8080/api/setor';

const getAllSetores = () => {
  return axios.get(API_URL);
};

const getSetorById = (id) => {
  return axios.get(`${API_URL}/${id}`);
};

const createSetor = (setor) => {
  return axios.post(API_URL, setor);
};

const updateSetor = (id, setor) => {
  return axios.put(`${API_URL}/${id}`, setor);
};

const deleteSetor = (id) => {
  return axios.delete(`${API_URL}/${id}`);
};

export default {
  getAllSetores,
  getSetorById,
  createSetor,
  updateSetor,
  deleteSetor
};
