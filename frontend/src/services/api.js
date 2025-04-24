import axios from 'axios';

// Tworzenie instancji axios z bazowym URL
const api = axios.create({
  baseURL: 'http://localhost:8080'
});

// Dodawanie tokenu do URL jako parametr dla wszystkich żądań
api.interceptors.request.use(
  (config) => {
    console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url}`);
    
    const token = localStorage.getItem('token');
    if (token) {
      // Dodawanie tokenu jako parametr URL
      const separator = config.url?.includes('?') ? '&' : '?';
      config.url = `${config.url}${separator}token=${token}`;
      console.log(`[API Request] Dodano token do URL: ${config.url}`);
    } else {
      console.log('[API Request] Brak tokenu w localStorage');
    }
    
    if (config.data) {
      console.log('[API Request] Dane wysyłane:', JSON.stringify(config.data, null, 2));
    }
    
    return config;
  },
  (error) => {
    console.error('[API Request Error]', error);
    return Promise.reject(error);
  }
);

// Interceptor dla odpowiedzi
api.interceptors.response.use(
  (response) => {
    console.log(`[API Response] ${response.status} ${response.statusText} od ${response.config.url}`);
    console.log('[API Response] Otrzymane dane:', JSON.stringify(response.data, null, 2));
    return response;
  },
  (error) => {
    console.error(`[API Error] ${error.response?.status || 'Unknown'} od ${error.config?.url}`);
    if (error.response?.data) {
      console.error('[API Error] Szczegóły:', JSON.stringify(error.response.data, null, 2));
    }
    return Promise.reject(error);
  }
);

// Serwis API dla uwierzytelniania
export const authAPI = {
  login: async (credentials) => {
    console.log('[authAPI.login] Próba logowania:', credentials.userName);
    try {
      const response = await api.post('/login', credentials);
      console.log('[authAPI.login] Sukces, token otrzymany');
      return {
        success: true,
        token: response.data.token,
        username: response.data.username,
        email: response.data.email,
        role: response.data.role
      };
    } catch (error) {
      console.error('[authAPI.login] Błąd logowania:', error.message);
      return {
        success: false,
        error: error.response?.data?.message || 'Błąd logowania'
      };
    }
  },
  
  register: async (userData) => {
    console.log('[authAPI.register] Próba rejestracji:', userData.userName);
    try {
      const response = await api.post('/register', userData);
      console.log('[authAPI.register] Sukces, token otrzymany');
      return {
        success: true,
        token: response.data.token,
        username: response.data.username,
        email: response.data.email,
        role: response.data.role
      };
    } catch (error) {
      console.error('[authAPI.register] Błąd rejestracji:', error.message);
      return {
        success: false,
        error: error.response?.data?.error || 'Błąd rejestracji'
      };
    }
  },
  
  verifyToken: async (token) => {
    console.log('[authAPI.verifyToken] Weryfikacja tokenu');
    try {
      const response = await api.post('/verify-token', { token });
      console.log('[authAPI.verifyToken] Token zweryfikowany pomyślnie');
      return {
        success: true,
        valid: response.data.valid,
        username: response.data.username,
        email: response.data.email,
        role: response.data.role
      };
    } catch (error) {
      console.error('[authAPI.verifyToken] Błąd weryfikacji tokenu:', error.message);
      return {
        success: false,
        valid: false,
        error: error.response?.data?.message || 'Błąd weryfikacji tokenu'
      };
    }
  }
};

// Funkcje mapowania wartości między UI i API
export const valueMapper = {
  // Mapowanie wartości z UI na API
  mapUIValueToAPIValue: (uiValue) => {
    switch(uiValue) {
      case 'TAK': return 'yes';
      case 'NIE': return 'no';
      case 'W REALIZACJI': return 'partial';
      case 'ND': return 'na';
      default: return '';
    }
  },
  
  // Mapowanie wartości z API na UI
  mapAPIValueToUIValue: (apiValue) => {
    switch(apiValue) {
      case 'yes': return 'TAK';
      case 'no': return 'NIE';
      case 'partial': return 'W REALIZACJI';
      case 'na': return 'ND';
      case 'ZGODNY': return 'TAK';
      case 'NIEZGODNY': return 'NIE';
      case 'CZĘŚCIOWO ZGODNY': return 'W REALIZACJI';
      default: return '';
    }
  },
  
  // Mapowanie statusu na wartość API
  mapStatusToAPIValue: (status) => {
    switch(status) {
      case 'COMPLETED': return 'yes';
      case 'NOT_APPLICABLE': return 'no';
      case 'IN_PROGRESS': return 'partial';
      case 'NOT_STARTED': return '';
      default: return '';
    }
  },
  
  // Mapowanie wartości API na status
  mapAPIValueToStatus: (apiValue) => {
    switch(apiValue) {
      case 'yes': return 'COMPLETED';
      case 'no': return 'NOT_APPLICABLE';
      case 'partial': return 'IN_PROGRESS';
      case 'ZGODNY': return 'COMPLETED';
      case 'NIEZGODNY': return 'NOT_APPLICABLE';
      case 'CZĘŚCIOWO ZGODNY': return 'IN_PROGRESS';
      case '': return 'NOT_STARTED';
      default: return 'NOT_STARTED';
    }
  }
};

// Funkcja do obliczania postępu oceny
const calculateProgress = (assessment) => {
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
            if ((req.value && req.value !== '') || 
                (req.status && req.status !== 'NOT_STARTED')) {
              answeredRequirements++;
            }
          });
        }
      });
    }
  });
  
  return totalRequirements > 0 ? Math.round((answeredRequirements / totalRequirements) * 100) : 0;
};

// Funkcja do formatowania danych oceny przed wysłaniem do API
export const formatAssessmentData = (assessment) => {
  console.log('[formatAssessmentData] Formatowanie danych oceny przed wysłaniem');
  
  if (!assessment.chapters) {
    console.log('[formatAssessmentData] Brak rozdziałów, zwracam dane bez zmian');
    return assessment;
  }
  
  const formattedAssessment = { ...assessment };
  
  formattedAssessment.chapters.forEach(chapter => {
    if (chapter.areas) {
      chapter.areas.forEach(area => {
        if (area.requirements) {
          area.requirements.forEach(req => {
            // Upewnij się, że status i value są spójne
            if (req.value && !req.status) {
              req.status = valueMapper.mapAPIValueToStatus(req.value);
            } else if (req.status && !req.value) {
              req.value = valueMapper.mapStatusToAPIValue(req.status);
            }
            
            // Upewnij się, że komentarz nie jest null/undefined
            if (req.comment === null || req.comment === undefined) {
              req.comment = '';
            }
          });
        }
        
        // Upewnij się, że komentarz obszaru nie jest null/undefined
        if (area.comment === null || area.comment === undefined) {
          area.comment = '';
        }
      });
    }
  });
  
  console.log('[formatAssessmentData] Formatowanie zakończone');
  return formattedAssessment;
};

// Funkcja do przetwarzania danych oceny po otrzymaniu z API
export const processAssessmentData = (assessment) => {
  console.log('[processAssessmentData] Przetwarzanie danych oceny po otrzymaniu z API');
  
  if (!assessment.chapters || assessment.chapters.length === 0) {
    console.log('[processAssessmentData] Brak rozdziałów, zwracam dane bez zmian');
    return assessment;
  }
  
  const processedAssessment = { ...assessment };
  
  processedAssessment.chapters.forEach(chapter => {
    if (chapter.areas) {
      chapter.areas.forEach(area => {
        if (area.requirements) {
          area.requirements.forEach(req => {
            // Upewnij się, że status i value są spójne
            if (req.value && !req.status) {
              req.status = valueMapper.mapAPIValueToStatus(req.value);
            } else if (req.status && !req.value) {
              req.value = valueMapper.mapStatusToAPIValue(req.status);
            }
            
            // Upewnij się, że komentarz nie jest null/undefined
            if (req.comment === null || req.comment === undefined) {
              req.comment = '';
            }
          });
        }
        
        // Upewnij się, że komentarz obszaru nie jest null/undefined
        if (area.comment === null || area.comment === undefined) {
          area.comment = '';
        }
      });
    }
  });
  
  console.log('[processAssessmentData] Przetwarzanie zakończone');
  return processedAssessment;
};

// Serwis API dla ocen
export const assessmentAPI = {
  getAll: async () => {
    console.log('[assessmentAPI.getAll] Pobieranie wszystkich ocen');
    try {
      const response = await api.get('/assessments');
      console.log(`[assessmentAPI.getAll] Pobrano ${response.data.length} ocen`);
      return response.data;
    } catch (error) {
      console.error('[assessmentAPI.getAll] Błąd pobierania ocen:', error.message);
      throw error;
    }
  },
  
  getSummary: async () => {
    console.log('[assessmentAPI.getSummary] Pobieranie podsumowania ocen');
    try {
      const response = await api.get('/assessments/summary');
      console.log('[assessmentAPI.getSummary] Pobrano podsumowanie ocen');
      return response.data;
    } catch (error) {
      console.error('[assessmentAPI.getSummary] Błąd pobierania podsumowania:', error.message);
      throw error;
    }
  },
  
  getById: async (id) => {
    console.log(`[assessmentAPI.getById] Pobieranie oceny o ID: ${id}`);
    try {
      const response = await api.get(`/assessments/${id}`);
      console.log(`[assessmentAPI.getById] Pobrano ocenę o ID: ${id}`);
      console.log(`[assessmentAPI.getById] Liczba rozdziałów: ${response.data.chapters?.length || 0}`);
      
      // Przetwarzanie danych oceny po otrzymaniu z API
      const processedData = processAssessmentData(response.data);
      return processedData;
    } catch (error) {
      console.error(`[assessmentAPI.getById] Błąd pobierania oceny ${id}:`, error.message);
      throw error;
    }
  },
  
  getTemplate: async () => {
    console.log('[assessmentAPI.getTemplate] Pobieranie szablonu oceny');
    try {
      const response = await api.get('/assessments/template');
      console.log('[assessmentAPI.getTemplate] Pobrano szablon oceny');
      console.log(`[assessmentAPI.getTemplate] Liczba rozdziałów w szablonie: ${response.data.chapters?.length || 0}`);
      
      // Przetwarzanie danych szablonu po otrzymaniu z API
      const processedData = processAssessmentData(response.data);
      return processedData;
    } catch (error) {
      console.error('[assessmentAPI.getTemplate] Błąd pobierania szablonu:', error.message);
      throw error;
    }
  },
  
  create: async (assessmentData) => {
    console.log('[assessmentAPI.create] Tworzenie nowej oceny:', assessmentData.name);
    
    // Formatowanie danych przed wysłaniem
    const formattedData = formatAssessmentData(assessmentData);
    
    // Obliczanie postępu przed wysłaniem
    const progress = calculateProgress(formattedData);
    console.log(`[assessmentAPI.create] Obliczony postęp: ${progress}%`);
    
    // Aktualizacja statusu na podstawie postępu
    if (progress === 100) {
      formattedData.status = 'ZAKOŃCZONA';
    } else if (progress > 0) {
      formattedData.status = 'W TRAKCIE';
    } else {
      formattedData.status = 'DRAFT';
    }
    
    // Dodanie postępu do danych
    formattedData.progress = progress;
    
    try {
      const response = await api.post('/assessments', formattedData);
      console.log(`[assessmentAPI.create] Utworzono ocenę o ID: ${response.data.id}`);
      return response.data;
    } catch (error) {
      console.error('[assessmentAPI.create] Błąd tworzenia oceny:', error.message);
      throw error;
    }
  },
  
  update: async (id, assessmentData) => {
    console.log(`[assessmentAPI.update] Aktualizacja oceny o ID: ${id}`);
    
    // Formatowanie danych przed wysłaniem
    const formattedData = formatAssessmentData(assessmentData);
    
    // Obliczanie postępu przed wysłaniem
    const progress = calculateProgress(formattedData);
    console.log(`[assessmentAPI.update] Obliczony postęp: ${progress}%`);
    
    // Aktualizacja statusu na podstawie postępu
    if (progress === 100) {
      formattedData.status = 'ZAKOŃCZONA';
    } else if (progress > 0) {
      formattedData.status = 'W TRAKCIE';
    } else {
      formattedData.status = 'DRAFT';
    }
    
    // Dodanie postępu do danych
    formattedData.progress = progress;
    
    try {
      const response = await api.put(`/assessments/${id}`, formattedData);
      console.log(`[assessmentAPI.update] Zaktualizowano ocenę o ID: ${id}`);
      
      // Zwróć zaktualizowane dane zamiast pobierać je ponownie
      return {
        success: true,
        ...formattedData
      };
    } catch (error) {
      console.error(`[assessmentAPI.update] Błąd aktualizacji oceny ${id}:`, error.message);
      throw error;
    }
  },
  
  delete: async (id) => {
    console.log(`[assessmentAPI.delete] Usuwanie oceny o ID: ${id}`);
    try {
      const response = await api.delete(`/assessments/${id}`);
      console.log(`[assessmentAPI.delete] Usunięto ocenę o ID: ${id}`);
      return response.data;
    } catch (error) {
      console.error(`[assessmentAPI.delete] Błąd usuwania oceny ${id}:`, error.message);
      throw error;
    }
  },
  
  exportAssessment: async (id) => {
    console.log(`[assessmentAPI.exportAssessment] Eksport oceny o ID: ${id}`);
    try {
      const response = await api.get(`/assessments/${id}/export`);
      console.log(`[assessmentAPI.exportAssessment] Wyeksportowano ocenę o ID: ${id}`);
      return response.data;
    } catch (error) {
      console.error(`[assessmentAPI.exportAssessment] Błąd eksportu oceny ${id}:`, error.message);
      throw error;
    }
  }
};

// Serwis API dla raportów
export const reportAPI = {
  getAll: async (filters = {}) => {
    console.log('[reportAPI.getAll] Pobieranie raportów z filtrami:', filters);
    try {
      const response = await api.get('/reports', { params: filters });
      console.log(`[reportAPI.getAll] Pobrano ${response.data.length} raportów`);
      return response.data;
    } catch (error) {
      console.error('[reportAPI.getAll] Błąd pobierania raportów:', error.message);
      throw error;
    }
  },
  
  getById: async (id) => {
    console.log(`[reportAPI.getById] Pobieranie raportu o ID: ${id}`);
    try {
      const response = await api.get(`/reports/${id}`);
      console.log(`[reportAPI.getById] Pobrano raport o ID: ${id}`);
      return response.data;
    } catch (error) {
      console.error(`[reportAPI.getById] Błąd pobierania raportu ${id}:`, error.message);
      throw error;
    }
  },
  
  getAreaById: async (id) => {
    console.log(`[reportAPI.getAreaById] Pobieranie obszaru o ID: ${id}`);
    try {
      const response = await api.get(`/reports/areas/${id}`);
      console.log(`[reportAPI.getAreaById] Pobrano obszar o ID: ${id}`);
      return response.data;
    } catch (error) {
      console.error(`[reportAPI.getAreaById] Błąd pobierania obszaru ${id}:`, error.message);
      throw error;
    }
  },
  
  exportReport: async (id, format = 'pdf') => {
    console.log(`[reportAPI.exportReport] Eksport raportu o ID: ${id} w formacie: ${format}`);
    try {
      const response = await api.get(`/reports/${id}/export?format=${format}`);
      console.log(`[reportAPI.exportReport] Wyeksportowano raport o ID: ${id}`);
      return response.data;
    } catch (error) {
      console.error(`[reportAPI.exportReport] Błąd eksportu raportu ${id}:`, error.message);
      throw error;
    }
  }
};

// Serwis API dla firm
export const companyAPI = {
  getAll: async () => {
    console.log('[companyAPI.getAll] Pobieranie wszystkich firm');
    try {
      const response = await api.get('/companies');
      console.log(`[companyAPI.getAll] Pobrano ${response.data.length} firm`);
      return response.data;
    } catch (error) {
      console.error('[companyAPI.getAll] Błąd pobierania firm:', error.message);
      throw error;
    }
  },
  
  getById: async (id) => {
    console.log(`[companyAPI.getById] Pobieranie firmy o ID: ${id}`);
    try {
      const response = await api.get(`/companies/${id}`);
      console.log(`[companyAPI.getById] Pobrano firmę o ID: ${id}`);
      return response.data;
    } catch (error) {
      console.error(`[companyAPI.getById] Błąd pobierania firmy ${id}:`, error.message);
      throw error;
    }
  }
};

// Serwis API dla subskrypcji
export const subscriptionAPI = {
  getAll: async () => {
    console.log('[subscriptionAPI.getAll] Pobieranie wszystkich subskrypcji');
    try {
      const response = await api.get('/subscriptions');
      console.log(`[subscriptionAPI.getAll] Pobrano ${response.data.length} subskrypcji`);
      return response.data;
    } catch (error) {
      console.error('[subscriptionAPI.getAll] Błąd pobierania subskrypcji:', error.message);
      throw error;
    }
  },
  
  getById: async (id) => {
    console.log(`[subscriptionAPI.getById] Pobieranie subskrypcji o ID: ${id}`);
    try {
      const response = await api.get(`/subscriptions/${id}`);
      console.log(`[subscriptionAPI.getById] Pobrano subskrypcję o ID: ${id}`);
      return response.data;
    } catch (error) {
      console.error(`[subscriptionAPI.getById] Błąd pobierania subskrypcji ${id}:`, error.message);
      throw error;
    }
  }
};

export default api;
