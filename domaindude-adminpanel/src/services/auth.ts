import client from './axios'; // Import the configured axios instance

// Define the shape of the Login Data (validation types)
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    email: string;
    role: string;
  };
}

// The API Call
export const authAPI = {
  login: async (credentials: LoginCredentials) => {
    // This calls: POST http://localhost:5000/api/auth/login
    const response = await client.post<AuthResponse>('/auth/login', credentials);
    return response.data;
  },

  logout: async () => {
    const response = await client.post('/auth/logout');
    return response.data;
  }
  
};