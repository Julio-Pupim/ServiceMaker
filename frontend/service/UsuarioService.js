import axios from 'axios';

const API_URL = 'http://localhost:8080/api/usuario';

const getAllUsuarios = () => {
  return axios.get(API_URL);
};

const getUsuarioById = (id) => {
  return axios.get(`${API_URL}/${id}`);
};

const createUsuario = (usuario) => {
  return axios.post(API_URL, usuario);
};

const updateUsuario = (id, usuario) => {
  return axios.put(`${API_URL}/${id}`, usuario);
};

const deleteUsuario = (id) => {
  return axios.delete(`${API_URL}/${id}`);
};

export default {
  getAllUsuarios,
  getUsuarioById,
  createUsuario,
  updateUsuario,
  deleteUsuario
};