import client from './axios';

export interface Staff {
  id?: number; // Optional for creation
  user_id?: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  department: string;
  position: string;
  salary: string | number;
  joining_date: string;
  profile_image?: string | File;
  created_at?: string;
  username?: string; 
  role_name?: string;
}

export interface Role {
  id: number;
  name: string;
}

export interface ProjectCategory {
  id: number;
  name: string;
}

export interface Project {
  id?: number;
  title: string;
  start_date: string;
  end_date: string;
  website_link: string;
  description: string;
  technology: string;
  images?: ProjectImage[]; // Array of images returned from GET
}

// Add this new object alongside your existing 'staff' object
export const roles = {
  getAll: async () => {
    const response = await client.get<Role[]>('/roles');
    return response.data;
  }
};

export const staff = {
  // Get all staff
  getAll: async () => {
    const response = await client.get<Staff[]>('/staff');
    return response.data;
  },

  // Get single staff by ID
  getById: async (id: string | number) => {
    const response = await client.get<Staff>(`/staff/${id}`);
    return response.data;
  },

  // Create new staff (Supports FormData for images)
create: async (data: FormData | Staff) => {
    const config = data instanceof FormData 
      ? { headers: { 'Content-Type': 'multipart/form-data' } } 
      : {};

    const response = await client.post('/staff', data, config);
    return response.data;
  },

  // Update staff
  update: async (id: string | number, data: FormData | Partial<Staff>) => {
    const config = data instanceof FormData ? { headers: { 'Content-Type': 'multipart/form-data' } } : {};
    const response = await client.put(`/staff/${id}`, data, config);
    return response.data;
  },

  // Delete staff
  delete: async (id: string | number) => {
    const response = await client.delete<{ message: string }>(`/staff/${id}`);
    return response.data;
  }
};

// project categories
export const projectCategories = {
  getAll: async () => {
    const response = await client.get<ProjectCategory[]>('/project-categories');
    return response.data;
  },
  
  create: async (name: string) => {
    const response = await client.post('/project-categories', { name });
    return response.data;
  }
};

// Projects Service ---
export const projects = {
  // Get all projects
  getAll: async () => {
    const response = await client.get<Project[]>('/projects');
    return response.data;
  },

  // Create new project (Must use FormData because of multiple file uploads)
  create: async (data: FormData) => {
    const config = { headers: { 'Content-Type': 'multipart/form-data' } };
    const response = await client.post('/projects', data, config);
    return response.data;
  }
};