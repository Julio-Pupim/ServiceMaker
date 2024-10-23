import axios from 'axios';

const API_URL = 'http://localhost:8080/api/certificado';

const getAllCertificados = () => {
  return axios.get(API_URL);
};

const getCertificadoById = (id) => {
  return axios.get(`${API_URL}/${id}`);
};

const createCertificado = (certificado) => {
  return axios.post(API_URL, certificado);
};

const updateCertificado = (id, certificado) => {
  return axios.put(`${API_URL}/${id}`, certificado);
};

const deleteCertificado = (id) => {
  return axios.delete(`${API_URL}/${id}`);
};

export default {
  getAllCertificados,
  getCertificadoById,
  createCertificado,
  updateCertificado,
  deleteCertificado
};