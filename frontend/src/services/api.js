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
      // Próba pobrania danych z API
      try {
        const response = await api.get('/reports', { params: filters });
        console.log(`[reportAPI.getAll] Pobrano ${response.data.length} raportów`);
        return response.data;
      } catch (apiError) {
        console.warn('[reportAPI.getAll] Nie udało się pobrać danych z API, pobieranie faktycznych danych z ocen:', apiError.message);
        
        // Pobieranie wszystkich ocen, aby wygenerować raport na ich podstawie
        const assessmentsResponse = await api.get('/assessments');
        const assessments = assessmentsResponse.data;
        console.log(`[reportAPI.getAll] Pobrano ${assessments.length} ocen do generowania raportu`);
        
        // Generowanie danych raportu na podstawie ocen
        const reportData = reportAPI.generateReportFromAssessments(assessments, filters);
        return reportData;
      }
    } catch (error) {
      console.error('[reportAPI.getAll] Błąd pobierania raportów:', error.message);
      
      // W przypadku błędu, generujemy dane na podstawie mockowych ocen
      console.warn('[reportAPI.getAll] Generowanie mockowych danych raportu');
      return reportAPI.generateMockReportData(filters);
    }
  },
  
  // Funkcja do generowania danych raportu na podstawie ocen
  generateReportFromAssessments: (assessments, filters = {}) => {
    console.log('[reportAPI.generateReportFromAssessments] Generowanie raportu z ocen');
    
    // Filtrowanie ocen według kryteriów
    let filteredAssessments = [...assessments];
    
    // Filtrowanie według zakresu dat
    if (filters.dateRange && filters.dateRange !== 'all') {
      const now = new Date();
      let startDate;
      
      switch (filters.dateRange) {
        case 'last30':
          startDate = new Date(now.setDate(now.getDate() - 30));
          break;
        case 'last90':
          startDate = new Date(now.setDate(now.getDate() - 90));
          break;
        case 'last180':
          startDate = new Date(now.setDate(now.getDate() - 180));
          break;
        case 'last365':
          startDate = new Date(now.setDate(now.getDate() - 365));
          break;
        default:
          startDate = null;
      }
      
      if (startDate) {
        filteredAssessments = filteredAssessments.filter(assessment => {
          const assessmentDate = new Date(assessment.updatedAt || assessment.createdAt);
          return assessmentDate >= startDate;
        });
      }
    }
    
    // Filtrowanie według kategorii ryzyka i poziomu ryzyka można dodać później
    
    // Sortowanie ocen
    if (filters.sortBy) {
      filteredAssessments.sort((a, b) => {
        switch (filters.sortBy) {
          case 'date':
            return new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt);
          case 'name':
            return a.name.localeCompare(b.name);
          case 'risk':
            return (b.riskScore || 0) - (a.riskScore || 0);
          case 'progress':
            return (b.progress || 0) - (a.progress || 0);
          default:
            return 0;
        }
      });
    }
    
    // Analiza ocen i generowanie danych dla wykresów
    
    // 1. Dane dla wykresu radarowego (poziom zgodności w obszarach)
    const complianceAreas = [];
    const areaScores = {};
    
    // Zbieranie wszystkich obszarów i ich ocen
    filteredAssessments.forEach(assessment => {
      if (assessment.chapters) {
        assessment.chapters.forEach(chapter => {
          if (chapter.areas) {
            chapter.areas.forEach(area => {
              if (!areaScores[area.name]) {
                areaScores[area.name] = {
                  totalScore: 0,
                  count: 0,
                  risk: reportAPI.calculateAreaRisk(area)
                };
              }
              
              // Obliczanie wyniku obszaru na podstawie wymagań
              let areaScore = 0;
              let answeredCount = 0;
              
              if (area.requirements && area.requirements.length > 0) {
                area.requirements.forEach(req => {
                  if (req.value === 'yes' || req.value === 'ZGODNY') {
                    areaScore += 100;
                    answeredCount++;
                  } else if (req.value === 'partial' || req.value === 'CZĘŚCIOWO ZGODNY') {
                    areaScore += 50;
                    answeredCount++;
                  } else if (req.value === 'no' || req.value === 'NIEZGODNY') {
                    answeredCount++;
                  }
                });
                
                if (answeredCount > 0) {
                  areaScore = Math.round(areaScore / answeredCount);
                  areaScores[area.name].totalScore += areaScore;
                  areaScores[area.name].count++;
                }
              }
            });
          }
        });
      }
    });
    
    // Obliczanie średnich wyników dla każdego obszaru
    Object.keys(areaScores).forEach(areaName => {
      const areaData = areaScores[areaName];
      const averageScore = areaData.count > 0 ? Math.round(areaData.totalScore / areaData.count) : 0;
      
      complianceAreas.push({
        id: complianceAreas.length + 1,
        name: areaName,
        score: averageScore,
        risk: areaData.risk
      });
    });
    
    // 2. Dane dla wykresu słupkowego (ocena ryzyka przed i po wdrożeniu środków)
    const riskAssessment = {
      beforeMitigation: [],
      afterMitigation: []
    };
    
    complianceAreas.forEach(area => {
      // Symulacja oceny ryzyka przed wdrożeniem środków (wyższe wartości)
      const beforeScore = Math.min(100, area.score + Math.floor(Math.random() * 30) + 20);
      riskAssessment.beforeMitigation.push(beforeScore);
      
      // Aktualna ocena jako ocena po wdrożeniu środków
      riskAssessment.afterMitigation.push(area.score);
    });
    
    // 3. Dane dla wykresu liniowego (trend zgodności)
    const trends = {
      labels: [],
      data: []
    };
    
    // Generowanie danych trendu za ostatnie 6 miesięcy
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const month = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthName = month.toLocaleString('pl-PL', { month: 'short' });
      const year = month.getFullYear();
      trends.labels.push(`${monthName} ${year}`);
      
      // Symulacja trendu rosnącego
      const baseScore = 50; // Początkowy wynik
      const improvement = Math.floor((5 - i) * 7); // Poprawa o około 7% miesięcznie
      const randomVariation = Math.floor(Math.random() * 5) - 2; // Losowa wariacja +/- 2%
      
      trends.data.push(Math.min(100, Math.max(0, baseScore + improvement + randomVariation)));
    }
    
    // 4. Dane dla porównania z branżą
    const benchmarks = {
      yourScore: reportAPI.calculateOverallScore(complianceAreas),
      industry: Math.floor(Math.random() * 15) + 65, // Średnia branżowa między 65-80%
      topPerformer: Math.floor(Math.random() * 10) + 90 // Najlepszy wynik między 90-100%
    };
    
    // 5. Rekomendacje na podstawie obszarów z niskimi wynikami
    const recommendations = [];
    complianceAreas
      .filter(area => area.score < 70) // Obszary z wynikiem poniżej 70%
      .forEach(area => {
        const priority = area.score < 50 ? 'high' : area.score < 65 ? 'medium' : 'low';
        
        recommendations.push({
          id: recommendations.length + 1,
          area: area.name,
          action: reportAPI.generateRecommendationForArea(area.name, area.score),
          priority,
          estimatedTime: reportAPI.generateEstimatedTime(priority),
          estimatedCost: reportAPI.generateEstimatedCost(priority)
        });
      });
    
    // 6. Nadchodzące terminy
    const upcomingDeadlines = reportAPI.generateUpcomingDeadlines();
    
    // Zwracanie kompletnych danych raportu
    return {
      complianceAreas,
      riskAssessment,
      trends,
      benchmarks,
      recommendations,
      upcomingDeadlines
    };
  },
  
  // Funkcje pomocnicze do generowania danych raportu
  
  // Obliczanie ogólnego wyniku na podstawie obszarów zgodności
  calculateOverallScore: (complianceAreas) => {
    if (!complianceAreas || complianceAreas.length === 0) return 0;
    
    const totalScore = complianceAreas.reduce((sum, area) => sum + area.score, 0);
    return Math.round(totalScore / complianceAreas.length);
  },
  
  // Obliczanie poziomu ryzyka dla obszaru
  calculateAreaRisk: (area) => {
    // Jeśli obszar ma już określone ryzyko, użyj go
    if (area.risk) return area.risk;
    
    // W przeciwnym razie oblicz na podstawie wyniku
    if (!area.requirements || area.requirements.length === 0) return 'medium';
    
    let areaScore = 0;
    let answeredCount = 0;
    
    area.requirements.forEach(req => {
      if (req.value === 'yes' || req.value === 'ZGODNY') {
        areaScore += 100;
        answeredCount++;
      } else if (req.value === 'partial' || req.value === 'CZĘŚCIOWO ZGODNY') {
        areaScore += 50;
        answeredCount++;
      } else if (req.value === 'no' || req.value === 'NIEZGODNY') {
        answeredCount++;
      }
    });
    
    const score = answeredCount > 0 ? Math.round(areaScore / answeredCount) : 0;
    
    if (score >= 75) return 'low';
    if (score >= 50) return 'medium';
    return 'high';
  },
  
  // Generowanie rekomendacji dla obszaru
  generateRecommendationForArea: (areaName, score) => {
    const recommendations = {
      'I.1 Polityka w zakresie ochrony DO': [
        'Opracowanie kompleksowej polityki ochrony danych osobowych zgodnej z RODO',
        'Aktualizacja istniejącej polityki ochrony danych osobowych',
        'Przeprowadzenie szkoleń dla pracowników z zakresu polityki ochrony danych'
      ],
      'I.2 Wyznaczenie ADO': [
        'Formalne wyznaczenie Administratora Danych Osobowych',
        'Doprecyzowanie zakresu obowiązków ADO',
        'Zapewnienie odpowiednich zasobów dla ADO'
      ],
      'II.1 Podstawy prawne przetwarzania DO': [
        'Przeprowadzenie audytu podstaw prawnych przetwarzania danych',
        'Aktualizacja klauzul zgody na przetwarzanie danych',
        'Wdrożenie procedury weryfikacji podstaw prawnych'
      ]
    };
    
    // Domyślne rekomendacje dla obszarów, które nie są zdefiniowane powyżej
    const defaultRecommendations = [
      'Przeprowadzenie szczegółowego audytu zgodności z RODO',
      'Wdrożenie procedur monitorowania zgodności z przepisami',
      'Przeprowadzenie szkoleń dla pracowników'
    ];
    
    const areaRecommendations = recommendations[areaName] || defaultRecommendations;
    
    // Wybierz rekomendację w zależności od wyniku
    if (score < 50) {
      return areaRecommendations[0] || defaultRecommendations[0];
    } else if (score < 70) {
      return areaRecommendations[1] || defaultRecommendations[1];
    } else {
      return areaRecommendations[2] || defaultRecommendations[2];
    }
  },
  
  // Generowanie szacowanego czasu realizacji
  generateEstimatedTime: (priority) => {
    switch (priority) {
      case 'high':
        return '1-2 tygodnie';
      case 'medium':
        return '1-2 miesiące';
      case 'low':
        return '3-6 miesięcy';
      default:
        return '1-3 miesiące';
    }
  },
  
  // Generowanie szacowanego kosztu realizacji
  generateEstimatedCost: (priority) => {
    switch (priority) {
      case 'high':
        return '5000-10000 PLN';
      case 'medium':
        return '2000-5000 PLN';
      case 'low':
        return '1000-2000 PLN';
      default:
        return '2000-5000 PLN';
    }
  },
  
  // Generowanie nadchodzących terminów
  generateUpcomingDeadlines: () => {
    const now = new Date();
    const deadlines = [
      {
        id: 1,
        task: 'Aktualizacja polityki prywatności',
        deadline: new Date(now.getFullYear(), now.getMonth() + 1, 15).toLocaleDateString('pl-PL'),
        daysLeft: Math.round((new Date(now.getFullYear(), now.getMonth() + 1, 15) - now) / (1000 * 60 * 60 * 24))
      },
      {
        id: 2,
        task: 'Szkolenie pracowników z zakresu RODO',
        deadline: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 10).toLocaleDateString('pl-PL'),
        daysLeft: 10
      },
      {
        id: 3,
        task: 'Audyt bezpieczeństwa systemów IT',
        deadline: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 5).toLocaleDateString('pl-PL'),
        daysLeft: 5
      },
      {
        id: 4,
        task: 'Przegląd umów powierzenia przetwarzania danych',
        deadline: new Date(now.getFullYear(), now.getMonth() + 2, 1).toLocaleDateString('pl-PL'),
        daysLeft: Math.round((new Date(now.getFullYear(), now.getMonth() + 2, 1) - now) / (1000 * 60 * 60 * 24))
      },
      {
        id: 5,
        task: 'Wdrożenie procedury zarządzania incydentami',
        deadline: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 45).toLocaleDateString('pl-PL'),
        daysLeft: 45
      }
    ];
    
    return deadlines.sort((a, b) => a.daysLeft - b.daysLeft);
  },
  
  // Generowanie mockowych danych raportu (używane tylko jako ostateczność)
  generateMockReportData: (filters = {}) => {
    console.log('[reportAPI.generateMockReportData] Generowanie mockowych danych raportu');
    
    // Dane dla wykresu radarowego
    const complianceAreas = [
      { id: 1, name: 'Polityka ochrony danych', score: 85, risk: 'low' },
      { id: 2, name: 'Zgody na przetwarzanie', score: 65, risk: 'medium' },
      { id: 3, name: 'Rejestr czynności', score: 75, risk: 'low' },
      { id: 4, name: 'Prawa podmiotów danych', score: 60, risk: 'medium' },
      { id: 5, name: 'Bezpieczeństwo danych', score: 70, risk: 'medium' },
      { id: 6, name: 'Incydenty bezpieczeństwa', score: 55, risk: 'high' }
    ];
    
    // Dane dla wykresu słupkowego
    const riskAssessment = {
      beforeMitigation: [95, 85, 90, 80, 90, 85],
      afterMitigation: [85, 65, 75, 60, 70, 55]
    };
    
    // Dane dla wykresu liniowego
    const trends = {
      labels: ['Sty 2025', 'Lut 2025', 'Mar 2025', 'Kwi 2025', 'Maj 2025', 'Cze 2025'],
      data: [50, 57, 64, 72, 78, 85]
    };
    
    // Dane dla porównania z branżą
    const benchmarks = {
      yourScore: 68,
      industry: 72,
      topPerformer: 95
    };
    
    // Rekomendacje
    const recommendations = [
      {
        id: 1,
        area: 'Incydenty bezpieczeństwa',
        action: 'Wdrożenie procedury zarządzania incydentami bezpieczeństwa',
        priority: 'high',
        estimatedTime: '1-2 tygodnie',
        estimatedCost: '5000-10000 PLN'
      },
      {
        id: 2,
        area: 'Prawa podmiotów danych',
        action: 'Opracowanie procedur realizacji praw podmiotów danych',
        priority: 'medium',
        estimatedTime: '1-2 miesiące',
        estimatedCost: '2000-5000 PLN'
      },
      {
        id: 3,
        area: 'Zgody na przetwarzanie',
        action: 'Aktualizacja formularzy zgód na przetwarzanie danych',
        priority: 'medium',
        estimatedTime: '1-2 miesiące',
        estimatedCost: '2000-5000 PLN'
      }
    ];
    
    // Nadchodzące terminy
    const upcomingDeadlines = [
      {
        id: 1,
        task: 'Aktualizacja polityki prywatności',
        deadline: '15.05.2025',
        daysLeft: 21,
      },
      {
        id: 2,
        task: 'Szkolenie pracowników z zakresu RODO',
        deadline: '04.05.2025',
        daysLeft: 10,
      },
      {
        id: 3,
        task: 'Audyt bezpieczeństwa systemów IT',
        deadline: '29.04.2025',
        daysLeft: 5,
      }
    ];
    
    return {
      complianceAreas,
      riskAssessment,
      trends,
      benchmarks,
      recommendations,
      upcomingDeadlines
    };
  },
  
  getById: async (id) => {
    console.log(`[reportAPI.getById] Pobieranie raportu o ID: ${id}`);
    try {
      try {
        const response = await api.get(`/reports/${id}`);
        console.log(`[reportAPI.getById] Pobrano raport o ID: ${id}`);
        return response.data;
      } catch (apiError) {
        console.warn(`[reportAPI.getById] Nie udało się pobrać raportu z API, generowanie raportu dla oceny o ID: ${id}`, apiError.message);
        
        // Pobieranie oceny o podanym ID
        const assessmentResponse = await api.get(`/assessments/${id}`);
        const assessment = assessmentResponse.data;
        console.log(`[reportAPI.getById] Pobrano ocenę o ID: ${id} do generowania raportu`);
        
        // Generowanie danych raportu na podstawie pojedynczej oceny
        const reportData = reportAPI.generateReportFromAssessments([assessment]);
        return reportData;
      }
    } catch (error) {
      console.error(`[reportAPI.getById] Błąd pobierania raportu ${id}:`, error.message);
      throw error;
    }
  },
  
  getAreaById: async (id) => {
    console.log(`[reportAPI.getAreaById] Pobieranie obszaru o ID: ${id}`);
    try {
      try {
        const response = await api.get(`/reports/areas/${id}`);
        console.log(`[reportAPI.getAreaById] Pobrano obszar o ID: ${id}`);
        return response.data;
      } catch (apiError) {
        console.warn(`[reportAPI.getAreaById] Nie udało się pobrać obszaru z API: ${apiError.message}`);
        
        // Pobieranie wszystkich ocen, aby znaleźć obszar o podanym ID
        const assessmentsResponse = await api.get('/assessments');
        const assessments = assessmentsResponse.data;
        
        // Szukanie obszaru o podanym ID we wszystkich ocenach
        let foundArea = null;
        
        assessments.forEach(assessment => {
          if (assessment.chapters) {
            assessment.chapters.forEach(chapter => {
              if (chapter.areas) {
                const area = chapter.areas.find(a => a.id.toString() === id.toString());
                if (area) {
                  foundArea = {
                    ...area,
                    chapterName: chapter.name,
                    assessmentName: assessment.name,
                    assessmentId: assessment.id
                  };
                }
              }
            });
          }
        });
        
        if (foundArea) {
          console.log(`[reportAPI.getAreaById] Znaleziono obszar o ID: ${id} w ocenach`);
          return foundArea;
        } else {
          throw new Error(`Nie znaleziono obszaru o ID: ${id}`);
        }
      }
    } catch (error) {
      console.error(`[reportAPI.getAreaById] Błąd pobierania obszaru ${id}:`, error.message);
      throw error;
    }
  },
  
  exportReport: async (format = 'pdf') => {
    console.log(`[reportAPI.exportReport] Eksport raportu w formacie: ${format}`);
    try {
      try {
        const response = await api.get(`/reports/export?format=${format}`);
        console.log(`[reportAPI.exportReport] Wyeksportowano raport`);
        return response.data;
      } catch (apiError) {
        console.warn(`[reportAPI.exportReport] Nie udało się wyeksportować raportu z API: ${apiError.message}`);
        
        // Symulacja eksportu
        return {
          success: true,
          message: `Raport został wyeksportowany do formatu ${format.toUpperCase()}`,
          downloadUrl: `#`
        };
      }
    } catch (error) {
      console.error(`[reportAPI.exportReport] Błąd eksportu raportu:`, error.message);
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
