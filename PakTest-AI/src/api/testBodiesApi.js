import api from './axios.js';

export const getTestBodies = async () => {
  const { data } = await api.get('/test-bodies');
  return data.data;
};
