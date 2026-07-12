import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

const getApiBaseUrl = () => {
  const rawBaseUrl = (process.env.EXPO_PUBLIC_API_BASE_URL || 'http://localhost:5000/api').trim();
  const normalizedBaseUrl = rawBaseUrl.replace(/\/+$/, '');

  if (normalizedBaseUrl.endsWith('/api')) {
    return normalizedBaseUrl;
  }

  return `${normalizedBaseUrl}/api`;
};

const api = axios.create({
  baseURL: getApiBaseUrl(),
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(async (config) => {
  try {
    const token = await SecureStore.getItemAsync('paktest-ai-session');

    if (token) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${token}`,
      };
    }
  } catch {
    // Ignore SecureStore access issues on unsupported runtimes.
  }

  return config;
}, (error) => Promise.reject(error));

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error?.response?.data?.message || error?.message || 'Request failed';
    return Promise.reject(new Error(message));
  },
);

export default api;
