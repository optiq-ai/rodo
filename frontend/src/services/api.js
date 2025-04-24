import axios from 'axios';

// Tworzenie instancji axios z bazowym URL
const api = axios.create({
  baseURL: 'http://localhost:8080'
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

// Serwis API dla uwierzytelniania
export const authAPI = {
  login: async (credentials) => {
    try {
      const response = await api.post('/login', credentials);
      return {
        success: true,
        token: response.data.token,
        username: credentials.userName
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Błąd logowania'
      };
    }
  },
  
  register: async (userData) => {
    try {
      const response = await api.post('/register', userData);
      return {
        success: true,
        token: response.data.token,
        username: userData.userName
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Błąd rejestracji'
      };
    }
  }
};

// Serwis API dla ocen
export const assessmentAPI = {
  // Pobieranie wszystkich ocen użytkownika
  getAll: async () => {
    try {
      const response = await api.get('/assessments');
      return response.data;
    } catch (error) {
      console.error('Błąd podczas pobierania ocen:', error);
      throw error;
    }
  },
  
  // Pobieranie podsumowania ocen
  getSummary: async () => {
    try {
      const response = await api.get('/assessments/summary');
      return response.data;
    } catch (error) {
      console.error('Błąd podczas pobierania podsumowania ocen:', error);
      throw error;
    }
  },
  
  // Pobieranie oceny po ID
  getById: async (id) => {
    try {
      const response = await api.get(`/assessments/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Błąd podczas pobierania oceny o ID ${id}:`, error);
      throw error;
    }
  },
  
  // Pobieranie szablonu oceny
  getTemplate: async () => {
    try {
      const response = await api.get('/assessments/template');
      return response.data;
    } catch (error) {
      console.error('Błąd podczas pobierania szablonu oceny:', error);
      throw error;
    }
  },
  
  // Tworzenie nowej oceny
  create: async (assessmentData) => {
    try {
      const response = await api.post('/assessments', assessmentData);
      return response.data;
    } catch (error) {
      console.error('Błąd podczas tworzenia oceny:', error);
      throw error;
    }
  },
  
  // Aktualizacja istniejącej oceny
  update: async (id, assessmentData) => {
    try {
      const response = await api.put(`/assessments/${id}`, assessmentData);
      return response.data;
    } catch (error) {
      console.error(`Błąd podczas aktualizacji oceny o ID ${id}:`, error);
      throw error;
    }
  },
  
  // Usuwanie oceny
  delete: async (id) => {
    try {
      const response = await api.delete(`/assessments/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Błąd podczas usuwania oceny o ID ${id}:`, error);
      throw error;
    }
  },
  
  // Eksport oceny do PDF
  exportAssessment: async (id) => {
    try {
      const response = await api.get(`/assessments/${id}/export`, {
        responseType: 'blob'
      });
      return response.data;
    } catch (error) {
      console.error(`Błąd podczas eksportu oceny o ID ${id}:`, error);
      throw error;
    }
  }
};

// Serwis API dla raportów
export const reportAPI = {
  // Pobieranie wszystkich raportów
  getAll: async (filters = {}) => {
    try {
      const response = await api.get('/reports', { params: filters });
      return response.data;
    } catch (error) {
      console.error('Błąd podczas pobierania raportów:', error);
      throw error;
    }
  },
  
  // Pobieranie raportu po ID
  getById: async (id) => {
    try {
      const response = await api.get(`/reports/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Błąd podczas pobierania raportu o ID ${id}:`, error);
      throw error;
    }
  },
  
  // Pobieranie szczegółów obszaru
  getAreaById: async (id) => {
    try {
      const response = await api.get(`/reports/areas/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Błąd podczas pobierania obszaru o ID ${id}:`, error);
      throw error;
    }
  },
  
  // Generowanie raportu z oceny
  generateFromAssessment: async (assessmentId, reportData) => {
    try {
      const response = await api.post(`/reports/generate/${assessmentId}`, reportData);
      return response.data;
    } catch (error) {
      console.error(`Błąd podczas generowania raportu z oceny o ID ${assessmentId}:`, error);
      throw error;
    }
  },
  
  // Eksport raportu do PDF
  exportReport: async (id) => {
    try {
      const response = await api.get(`/reports/${id}/export`, {
        responseType: 'blob'
      });
      return response.data;
    } catch (error) {
      console.error(`Błąd podczas eksportu raportu o ID ${id}:`, error);
      throw error;
    }
  }
};

// Serwis API dla firm
export const companyAPI = {
  // Pobieranie wszystkich firm
  getAll: async () => {
    try {
      const response = await api.get('/companies');
      return response.data;
    } catch (error) {
      console.error('Błąd podczas pobierania firm:', error);
      throw error;
    }
  },
  
  // Pobieranie firmy po ID
  getById: async (id) => {
    try {
      const response = await api.get(`/companies/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Błąd podczas pobierania firmy o ID ${id}:`, error);
      throw error;
    }
  },
  
  // Tworzenie nowej firmy
  create: async (companyData) => {
    try {
      const response = await api.post('/companies', companyData);
      return response.data;
    } catch (error) {
      console.error('Błąd podczas tworzenia firmy:', error);
      throw error;
    }
  },
  
  // Aktualizacja istniejącej firmy
  update: async (id, companyData) => {
    try {
      const response = await api.put(`/companies/${id}`, companyData);
      return response.data;
    } catch (error) {
      console.error(`Błąd podczas aktualizacji firmy o ID ${id}:`, error);
      throw error;
    }
  },
  
  // Usuwanie firmy
  delete: async (id) => {
    try {
      const response = await api.delete(`/companies/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Błąd podczas usuwania firmy o ID ${id}:`, error);
      throw error;
    }
  }
};

export default api;
