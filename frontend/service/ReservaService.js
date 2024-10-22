import axios from 'axios';

const API_URL = 'http://localhost:8080/api/reserva';

const getAllReservas = () => {
  return axios.get(API_URL);
};

const getReservaById = (id) => {
  return axios.get(`${API_URL}/${id}`);
};

const createReserva = (reserva) => {
  return axios.post(API_URL, reserva);
};

const updateReserva = (id, reserva) => {
  return axios.put(`${API_URL}/${id}`, reserva);
};

const deleteReserva = (id) => {
  return axios.delete(`${API_URL}/${id}`);
};

export default {
  getAllReservas,
  getReservaById,
  createReserva,
  updateReserva,
  deleteReserva
};
