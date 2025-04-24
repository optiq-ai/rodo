# API Integration Documentation

## Overview

This document provides a comprehensive guide to the integration between the React frontend and Java backend in the RODO project, focusing on the token parameter authentication mechanism.

## Authentication Flow

1. **User Login/Registration**:
   - User submits credentials via the login or registration form
   - Backend validates credentials and returns a JWT token
   - Frontend stores the token in localStorage

2. **API Requests with Token Parameter**:
   - Frontend automatically adds the token as a URL parameter to all API requests
   - Backend validates the token from the URL parameter
   - If valid, the request is processed; if invalid, a 401 Unauthorized response is returned

## Backend Implementation

The backend is configured to accept JWT tokens in two ways:

1. **Traditional Method**: Via the `Authorization: Bearer {token}` header
2. **Parameter Method**: Via the URL parameter `?token={token}`

### Key Components

#### JwtAuthFilter.java

This filter intercepts all requests and checks for the JWT token in both the Authorization header and URL parameters:

```java
// Check Authorization header
String header = request.getHeader(HttpHeaders.AUTHORIZATION);
String token = null;

if (header != null && header.startsWith("Bearer ")) {
    token = header.substring(7);
} else {
    // If token not in header, check request parameter
    token = request.getParameter("token");
}

if (token != null) {
    // Validate token and set authentication in security context
    var authentication = userAuthProvider.validateToken(token);
    // ...
}
```

## Frontend Implementation

The frontend is configured to automatically add the JWT token as a URL parameter to all API requests.

### Key Components

#### api.js

The API service uses axios interceptors to add the token to all requests:

```javascript
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
```

#### AuthContext.js

The authentication context manages the token and provides login/register/logout functionality:

```javascript
// Login function
const login = async (credentials) => {
  try {
    const response = await authAPI.login(credentials);
    
    // Store token in localStorage
    localStorage.setItem('token', response.token);
    
    // Set current user
    setCurrentUser({
      username: response.username || credentials.userName,
      email: response.email,
      role: response.role || 'USER'
    });
    
    return { success: true };
  } catch (error) {
    // Error handling...
  }
};
```

#### ProtectedRoute.js

The protected route component ensures that only authenticated users can access protected routes:

```javascript
const ProtectedRoute = ({ element, children }) => {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  if (element) {
    return element;
  }
  
  return children;
};
```

## API Endpoints

All API endpoints (except login and register) support token parameter authentication:

### Authentication Endpoints

- **POST /login** - Login with username and password
- **POST /register** - Register a new user

### Protected Endpoints

- **GET /assessments** - Get all assessments
- **GET /assessments/{id}** - Get assessment by ID
- **POST /assessments** - Create a new assessment
- **PUT /assessments/{id}** - Update an assessment
- **DELETE /assessments/{id}** - Delete an assessment
- **GET /users/profile** - Get user profile
- **PUT /users/profile** - Update user profile
- **GET /reports** - Get all reports
- **GET /subscriptions** - Get subscription information

## Example Usage

### Login

```javascript
const response = await authAPI.login({
  userName: "username",
  password: "password"
});

// Token is automatically stored in localStorage
```

### Making API Requests

```javascript
// Token is automatically added as a URL parameter
const assessments = await assessmentAPI.getAll();
```

This will make a request to:
```
GET /assessments?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Troubleshooting

### Common Issues

1. **401 Unauthorized**:
   - Check if the token is present in localStorage
   - Verify that the token is valid and not expired
   - Ensure the token is being correctly added to the request

2. **Token Not Being Added**:
   - Check if the axios interceptor is working correctly
   - Verify that the token is stored in localStorage

3. **Backend Not Recognizing Token**:
   - Ensure the backend is properly configured to check for the token parameter
   - Check server logs for any token validation errors

## Conclusion

The integration between the React frontend and Java backend is properly configured to use token parameter authentication. The frontend automatically adds the JWT token as a URL parameter to all API requests, and the backend validates the token from either the Authorization header or the URL parameter.
