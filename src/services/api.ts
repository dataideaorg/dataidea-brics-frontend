import axios from 'axios';

// Create an axios instance with default config
const api = axios.create({
  baseURL: process.env.NODE_ENV === 'production' 
    ? '/api' 
    : 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include the auth token in requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add a response interceptor to handle common errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401 Unauthorized errors (token expired, etc.)
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Authentication service
export const authService = {
  login: async (username: string, password: string) => {
    const response = await api.post('/auth/login/', { username, password });
    return response.data;
  },
  
  getCurrentUser: async () => {
    const response = await api.get('/auth/me/');
    return response.data;
  },
};

// Analytics service
export const analyticsService = {
  getDashboardStats: async () => {
    const response = await api.get('/analytics/dashboard/');
    return response.data;
  },
  
  getPromptsData: async (params: { page: number; page_size: number; search?: string }) => {
    const response = await api.get('/analytics/prompts/', { params });
    return response.data;
  },
  
  getPromptById: async (id: number) => {
    const response = await api.get(`/analytics/prompts/${id}/`);
    return response.data;
  },
  
  getModelStats: async () => {
    const response = await api.get('/analytics/models/');
    return response.data;
  },
  
  getUserStats: async () => {
    const response = await api.get('/analytics/users/');
    return response.data;
  },
};

// Projects services
export const projectsService = {
  getProjects: async () => {
    const response = await api.get('/projects/');
    return response.data;
  },
  
  getProjectById: async (id: number) => {
    const response = await api.get(`/projects/${id}/`);
    return response.data;
  },
  
  createProject: async (projectData: any) => {
    const response = await api.post('/projects/', projectData);
    return response.data;
  },
  
  updateProject: async (id: number, projectData: any) => {
    const response = await api.put(`/projects/${id}/`, projectData);
    return response.data;
  },
  
  deleteProject: async (id: number) => {
    const response = await api.delete(`/projects/${id}/`);
    return response.data;
  },
};

// User services
export const userService = {
  getUsers: async () => {
    const response = await api.get('/users/');
    return response.data;
  },
  
  getUserById: async (id: number) => {
    const response = await api.get(`/users/${id}/`);
    return response.data;
  },
  
  updateUser: async (id: number, userData: any) => {
    const response = await api.put(`/users/${id}/`, userData);
    return response.data;
  },
};

export default api; 