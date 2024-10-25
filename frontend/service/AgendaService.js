import axios from 'axios';

const API_URL = 'http://localhost:8080/api/agenda';  // Ajuste a URL conforme necessário

const getAllAgendas = () => {
  return axios.get(API_URL);
};

const getAgendaById = (id) => {
  return axios.get(`${API_URL}/${id}`);
};

const createAgenda = (agenda) => {
  return axios.post(API_URL, agenda);
};

const updateAgenda = (id, agenda) => {
  return axios.put(`${API_URL}/${id}`, agenda);
};

const deleteAgenda = (id) => {
  return axios.delete(`${API_URL}/${id}`);
};

export default {
  getAllAgendas,
  getAgendaById,
  createAgenda,
  updateAgenda,
  deleteAgenda
};