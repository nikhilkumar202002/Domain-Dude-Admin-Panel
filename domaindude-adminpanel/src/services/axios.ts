import axios from 'axios';

// 1. Create the Axios instance with your common Base URL
const client = axios.create({
  baseURL: 'http://localhost:5000/api/', // Common link
  headers: {
    'Content-Type': 'application/json',
  },
});

// 2. (Optional) Interceptor to attach the token if a user is already logged in
client.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default client;