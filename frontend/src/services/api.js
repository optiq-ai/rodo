import axios from 'axios';

// Base URL for API requests
const API_URL = 'http://localhost:8080';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to URL as a parameter for all requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      // Add token as URL parameter
      const separator = config.url.includes('?') ? '&' : '?';
      config.url = `${config.url}${separator}token=${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Authentication API
export const authAPI = {
  login: async (credentials) => {
    try {
      const response = await api.post('/login', credentials);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  register: async (userData) => {
    try {
      const response = await api.post('/register', userData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  verifyToken: async () => {
    try {
      const response = await api.get('/verify-token');
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

// User API
export const userAPI = {
  getProfile: async () => {
    try {
      const response = await api.get('/users/profile');
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  updateProfile: async (profileData) => {
    try {
      const response = await api.put('/users/profile', profileData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  changePassword: async (passwordData) => {
    try {
      const response = await api.put('/users/password', passwordData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  getCompany: async () => {
    try {
      const response = await api.get('/users/company');
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  updateCompany: async (companyData) => {
    try {
      const response = await api.put('/users/company', companyData);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

// Assessment API
export const assessmentAPI = {
  getAll: async (page = 1, size = 20) => {
    try {
      const response = await api.get(`/assessments?page=${page}&size=${size}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  getById: async (id) => {
    try {
      const response = await api.get(`/assessments/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  create: async (assessmentData) => {
    try {
      const response = await api.post('/assessments', assessmentData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  update: async (id, assessmentData) => {
    try {
      const response = await api.put(`/assessments/${id}`, assessmentData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  delete: async (id) => {
    try {
      const response = await api.delete(`/assessments/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  getChapters: async (id) => {
    try {
      const response = await api.get(`/assessments/${id}/chapters`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  addChapter: async (id, chapterData) => {
    try {
      const response = await api.post(`/assessments/${id}/chapters`, chapterData);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

// Report API
export const reportAPI = {
  getAll: async () => {
    try {
      const response = await api.get('/reports');
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  getAreaById: async (id) => {
    try {
      const response = await api.get(`/reports/areas/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  exportReport: async (format) => {
    try {
      const response = await api.get(`/reports/export?format=${format}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

// Subscription API
export const subscriptionAPI = {
  getSubscription: async () => {
    try {
      const response = await api.get('/subscriptions');
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  changePlan: async (planData) => {
    try {
      const response = await api.put('/subscriptions/plan', planData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  cancelSubscription: async () => {
    try {
      const response = await api.put('/subscriptions/cancel');
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  getPlans: async () => {
    try {
      const response = await api.get('/subscriptions/plans');
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export default api;
