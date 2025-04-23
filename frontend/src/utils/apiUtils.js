/**
 * Utility functions for API calls with consistent error handling
 */

const API_BASE_URL = 'http://localhost:8080';

/**
 * Makes an authenticated API request with proper error handling
 * @param {string} endpoint - API endpoint path (without base URL)
 * @param {Object} options - Request options (method, body, etc.)
 * @returns {Promise<Object>} - Response data or error object
 */
export const apiRequest = async (endpoint, options = {}) => {
  try {
    // Get token from localStorage
    const token = localStorage.getItem('token');
    
    // Check if token exists
    if (!token) {
      return {
        success: false,
        status: 401,
        message: 'Brak autoryzacji. Zaloguj się ponownie.'
      };
    }
    
    // Prepare headers with token
    const headers = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      ...(options.headers || {})
    };
    
    // Make the request
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: options.method || 'GET',
      headers,
      body: options.body ? JSON.stringify(options.body) : undefined,
      ...options
    });
    
    // Handle successful response
    if (response.ok) {
      // For blob responses (file downloads)
      if (options.responseType === 'blob') {
        const blob = await response.blob();
        return {
          success: true,
          data: blob,
          status: response.status
        };
      }
      
      // For JSON responses
      const data = await response.json().catch(() => ({}));
      return {
        success: true,
        data,
        status: response.status
      };
    }
    
    // Handle error responses
    if (response.status === 401) {
      // Unauthorized - token expired or invalid
      return {
        success: false,
        status: 401,
        message: 'Nieautoryzowany dostęp. Zaloguj się ponownie.'
      };
    }
    
    // Try to parse error response
    const errorData = await response.json().catch(() => ({}));
    return {
      success: false,
      status: response.status,
      message: errorData.message || `Błąd ${response.status}: ${response.statusText}`,
      data: errorData
    };
  } catch (error) {
    console.error('Błąd podczas wykonywania żądania API:', error);
    return {
      success: false,
      message: 'Wystąpił błąd podczas komunikacji z serwerem.',
      error
    };
  }
};

/**
 * Makes a GET request to the API
 * @param {string} endpoint - API endpoint path
 * @param {Object} options - Additional request options
 * @returns {Promise<Object>} - Response data or error object
 */
export const apiGet = (endpoint, options = {}) => {
  return apiRequest(endpoint, { ...options, method: 'GET' });
};

/**
 * Makes a POST request to the API
 * @param {string} endpoint - API endpoint path
 * @param {Object} data - Request body data
 * @param {Object} options - Additional request options
 * @returns {Promise<Object>} - Response data or error object
 */
export const apiPost = (endpoint, data, options = {}) => {
  return apiRequest(endpoint, { 
    ...options, 
    method: 'POST',
    body: data
  });
};

/**
 * Makes a PUT request to the API
 * @param {string} endpoint - API endpoint path
 * @param {Object} data - Request body data
 * @param {Object} options - Additional request options
 * @returns {Promise<Object>} - Response data or error object
 */
export const apiPut = (endpoint, data, options = {}) => {
  return apiRequest(endpoint, { 
    ...options, 
    method: 'PUT',
    body: data
  });
};

/**
 * Makes a DELETE request to the API
 * @param {string} endpoint - API endpoint path
 * @param {Object} options - Additional request options
 * @returns {Promise<Object>} - Response data or error object
 */
export const apiDelete = (endpoint, options = {}) => {
  return apiRequest(endpoint, { ...options, method: 'DELETE' });
};

/**
 * Downloads a file from the API
 * @param {string} endpoint - API endpoint path
 * @param {string} filename - Name to save the file as
 * @returns {Promise<Object>} - Success or error object
 */
export const apiDownloadFile = async (endpoint, filename) => {
  try {
    const result = await apiRequest(endpoint, { responseType: 'blob' });
    
    if (result.success) {
      const url = URL.createObjectURL(result.data);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      return { success: true };
    }
    
    return result;
  } catch (error) {
    console.error('Błąd podczas pobierania pliku:', error);
    return {
      success: false,
      message: 'Wystąpił błąd podczas pobierania pliku.'
    };
  }
};
