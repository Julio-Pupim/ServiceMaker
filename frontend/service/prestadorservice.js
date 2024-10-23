import axios from 'axios';

const API_URL = 'http://localhost:8080/api/prestador';

const getAllPrestadores = () => {
  return axios.get(API_URL);
};

const getPrestadorById = (id) => {
  return axios.get(`${API_URL}/${id}`);
};

const createPrestador = (prestador) => {
  return axios.post(API_URL, prestador);
};

const updatePrestador = (id, prestador) => {
  return axios.put(`${API_URL}/${id}`, prestador);
};

const deletePrestador = (id) => {
  return axios.delete(`${API_URL}/${id}`);
};

export default {
  getAllPrestadores,
  getPrestadorById,
  createPrestador,
  updatePrestador,
  deletePrestador
};
