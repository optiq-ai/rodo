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
  // Logowanie użytkownika
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

  // Rejestracja użytkownika
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
  },

  // Weryfikacja tokenu
  verifyToken: async (token) => {
    try {
      const response = await api.post('/verify-token', { token });
      return {
        success: true,
        user: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Błąd weryfikacji tokenu'
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

  // Pobieranie szczegółów oceny
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
      // Dodaj pole progress do danych oceny
      const dataToSend = {
        ...assessmentData,
        progress: calculateProgress(assessmentData)
      };
      
      const response = await api.post('/assessments', dataToSend);
      return response.data;
    } catch (error) {
      console.error('Błąd podczas tworzenia oceny:', error);
      throw error;
    }
  },

  // Aktualizacja oceny
  update: async (id, assessmentData) => {
    try {
      // Dodaj pole progress do danych oceny
      const dataToSend = {
        ...assessmentData,
        progress: calculateProgress(assessmentData)
      };
      
      const response = await api.put(`/assessments/${id}`, dataToSend);
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

// Funkcja pomocnicza do obliczania postępu oceny
function calculateProgress(assessment) {
  if (!assessment.chapters || assessment.chapters.length === 0) {
    return 0;
  }

  let totalRequirements = 0;
  let answeredRequirements = 0;

  assessment.chapters.forEach(chapter => {
    if (chapter.areas) {
      chapter.areas.forEach(area => {
        if (area.requirements) {
          area.requirements.forEach(req => {
            totalRequirements++;
            if (req.value && req.value !== '') {
              answeredRequirements++;
            }
          });
        }
      });
    }
  });

  return totalRequirements > 0 ? Math.round((answeredRequirements / totalRequirements) * 100) : 0;
}

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

  // Pobieranie szczegółów raportu
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

  // Pobieranie szczegółów firmy
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

  // Aktualizacja firmy
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

// Serwis API dla użytkowników
export const userAPI = {
  // Pobieranie wszystkich użytkowników
  getAll: async () => {
    try {
      const response = await api.get('/users');
      return response.data;
    } catch (error) {
      console.error('Błąd podczas pobierania użytkowników:', error);
      throw error;
    }
  },

  // Pobieranie szczegółów użytkownika
  getById: async (id) => {
    try {
      const response = await api.get(`/users/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Błąd podczas pobierania użytkownika o ID ${id}:`, error);
      throw error;
    }
  },

  // Aktualizacja użytkownika
  update: async (id, userData) => {
    try {
      const response = await api.put(`/users/${id}`, userData);
      return response.data;
    } catch (error) {
      console.error(`Błąd podczas aktualizacji użytkownika o ID ${id}:`, error);
      throw error;
    }
  },

  // Zmiana hasła użytkownika
  changePassword: async (id, passwordData) => {
    try {
      const response = await api.put(`/users/${id}/password`, passwordData);
      return response.data;
    } catch (error) {
      console.error(`Błąd podczas zmiany hasła użytkownika o ID ${id}:`, error);
      throw error;
    }
  }
};

// Serwis API dla subskrypcji
export const subscriptionAPI = {
  // Pobieranie szczegółów subskrypcji
  getCurrent: async () => {
    try {
      const response = await api.get('/subscriptions/current');
      return response.data;
    } catch (error) {
      console.error('Błąd podczas pobierania subskrypcji:', error);
      throw error;
    }
  },

  // Aktualizacja subskrypcji
  update: async (subscriptionData) => {
    try {
      const response = await api.put('/subscriptions/current', subscriptionData);
      return response.data;
    } catch (error) {
      console.error('Błąd podczas aktualizacji subskrypcji:', error);
      throw error;
    }
  }
};

export default api;
