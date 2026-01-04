import axios from 'axios';

// 1. Define the Server URL here (One place to change for deployment)
export const SERVER_URL = 'http://localhost:5000'; 

const client = axios.create({
  baseURL: `${SERVER_URL}/api`, // 2. Append '/api' for data requests
  headers: {
    'Content-Type': 'application/json',
  },
});

client.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default client;