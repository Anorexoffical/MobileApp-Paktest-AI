const getApiBaseUrl = () => {
  const rawBaseUrl = (process.env.EXPO_PUBLIC_API_BASE_URL || 'http://localhost:5000/api').trim();
  const normalizedBaseUrl = rawBaseUrl.replace(/\/+$/, '');

  if (normalizedBaseUrl.endsWith('/api')) {
    return normalizedBaseUrl;
  }

  return `${normalizedBaseUrl}/api`;
};

const BASE_URL = getApiBaseUrl();

const request = async (method, path, body, token) => {
  const headers = { "Content-Type": "application/json" };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Request failed");
  }

  return data;
};

export const api = {
  post: (path, body, token) => request("POST", path, body, token),
  get: (path, token) => request("GET", path, null, token),
  put: (path, body, token) => request("PUT", path, body, token),
};