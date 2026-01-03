import client from './axios';

export interface Staff {
  id: number;
  user_id: number;
  first_name: string;
  last_name: string;
  phone: string;
  department: string;
  position: string;
  salary: string | number;
  joining_date: string;
  profile_image: string;
  created_at?: string;
}

export const staffAPI = {
  // 1. GET /staff - Get all staff list
  getAll: async () => {
    const response = await client.get<Staff[]>('/staff');
    return response.data;
  },

  // 2. POST /staff - Create a new staff member
  create: async (data: Staff) => {
    const response = await client.post<Staff>('/staff', data);
    return response.data;
  },

  // 3. PUT /staff/:id - Edit a single staff member
  update: async (id: string | number, data: Partial<Staff>) => {
    const response = await client.put<Staff>(`/staff/${id}`, data);
    return response.data;
  },

  // 4. DELETE /staff/:id - Delete a single staff member
  delete: async (id: string | number) => {
    const response = await client.delete<{ message: string }>(`/staff/${id}`);
    return response.data;
  }
};