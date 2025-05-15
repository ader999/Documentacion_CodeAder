import axios from 'axios';

const API_URL = 'https://apicodeaderdocumentacion-production.up.railway.app';

// Helper para agregar el token de autenticación a las solicitudes
const getAuthHeader = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  if (user && user.accessToken) {
    return { Authorization: `Bearer ${user.accessToken}` };
  }
  return {};
};

// Documentaciones Web
export const getDocumentaciones = () => {
  return axios.get(`${API_URL}/api/documentaciones/`, {
    headers: getAuthHeader()
  });
};

export const getDocumentacion = (id) => {
  return axios.get(`${API_URL}/api/documentaciones/${id}/`, {
    headers: getAuthHeader()
  });
};

export const createDocumentacion = (data) => {
  return axios.post(`${API_URL}/api/documentaciones/crear/`, data, {
    headers: {
      ...getAuthHeader(),
      'Content-Type': 'multipart/form-data'
    }
  });
};

// Secciones de Documentación
export const getSeccionesByDocumentacion = (documentacionId) => {
  return axios.get(`${API_URL}/api/documentaciones/${documentacionId}/secciones/`, {
    headers: getAuthHeader()
  });
};

export const createSeccion = (data) => {
  return axios.post(`${API_URL}/api/secciones-documentacion/crear/`, data, {
    headers: {
      ...getAuthHeader(),
      'Content-Type': 'multipart/form-data'
    }
  });
};

export const getSeccion = (id) => {
  return axios.get(`${API_URL}/api/secciones-documentacion/${id}/`, {
    headers: getAuthHeader()
  });
};

// Manejo de errores global
export const handleApiError = (error, handleExpiredSession) => {
  console.error('API Error:', error);
  
  // Manejo específico de errores de autenticación
  if (error.response && error.response.status === 401) {
    if (handleExpiredSession) {
      handleExpiredSession();
    }
    return {
      type: 'auth',
      message: 'Tu sesión ha expirado. Por favor, inicia sesión nuevamente.'
    };
  }
  
  return {
    type: 'api',
    message: 'Error en la operación. Intenta nuevamente más tarde.'
  };
};
