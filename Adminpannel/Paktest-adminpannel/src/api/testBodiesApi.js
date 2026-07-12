import api from './axios.js';

export const getTestBodies = async () => {
  const { data } = await api.get('/test-bodies');
  return data.data;
};

export const getTestBody = async (id) => {
  const { data } = await api.get(`/test-bodies/${id}`);
  return data.data;
};

export const createTestBody = async (payload) => {
  const { data } = await api.post('/test-bodies', payload);
  return data.data;
};

export const updateTestBody = async (id, payload) => {
  const { data } = await api.put(`/test-bodies/${id}`, payload);
  return data.data;
};

export const deleteTestBody = async (id) => {
  const { data } = await api.delete(`/test-bodies/${id}`);
  return data.data;
};
