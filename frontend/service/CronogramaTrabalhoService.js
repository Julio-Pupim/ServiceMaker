import axios from 'axios';

const API_URL = 'http://localhost:8080/api/cronograma-trabalho';

const getAllCronogramas = () => {
  return axios.get(API_URL);
};

const getCronogramaById = (id) => {
  return axios.get(`${API_URL}/${id}`);
};

const createCronograma = (cronograma) => {
  return axios.post(API_URL, cronograma);
};

const updateCronograma = (id, cronograma) => {
  return axios.put(`${API_URL}/${id}`, cronograma);
};

const deleteCronograma = (id) => {
  return axios.delete(`${API_URL}/${id}`);
};

export default {
  getAllCronogramas,
  getCronogramaById,
  createCronograma,
  updateCronograma,
  deleteCronograma
};
