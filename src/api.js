// Centralized API helper for Task Manager Express + MongoDB backend
const API_BASE_URL = 'http://localhost:5000';
const TOKEN_KEY = 'portfolio_auth_token';

/**
 * Token management helpers
 */
export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token) {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
  } else {
    localStorage.removeItem(TOKEN_KEY);
  }
}

export function removeToken() {
  localStorage.removeItem(TOKEN_KEY);
}

/**
 * Helper to get default headers with Authorization if token exists
 */
function getAuthHeaders(extraHeaders = {}) {
  const headers = { ...extraHeaders };
  const token = getToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

/**
 * Helper to process fetch responses, handle errors, and return JSON.
 * Clears token and notifies on 401 Unauthorized responses.
 */
async function handleResponse(response) {
  if (!response.ok) {
    if (response.status === 401) {
      // Clear token on 401 Unauthorized so client knows session expired/invalid
      removeToken();
      // Dispatch a storage event or custom event so UI can immediately react
      window.dispatchEvent(new CustomEvent('auth:unauthorized'));
    }

    let errorMessage = `Request failed with status ${response.status}`;
    try {
      const errorData = await response.json();
      if (errorData.details && Array.isArray(errorData.details)) {
        errorMessage = errorData.details.join(', ');
      } else if (errorData.error) {
        errorMessage = errorData.error;
      }
    } catch {
      // response body was not JSON
    }
    throw new Error(errorMessage);
  }

  // If response has no content (e.g. 204)
  if (response.status === 204) {
    return null;
  }

  return response.json();
}

/**
 * Authentication Endpoints (Practical 7)
 */

export async function registerUser(email, password) {
  try {
    const response = await fetch(`${API_BASE_URL}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });
    return await handleResponse(response);
  } catch (err) {
    if (err.name === 'TypeError' && err.message.includes('fetch')) {
      throw new Error('Unable to connect to Task Manager API server. Is the backend running on port 5000?');
    }
    throw err;
  }
}

export async function loginUser(email, password) {
  try {
    const response = await fetch(`${API_BASE_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });
    const data = await handleResponse(response);
    if (data && data.token) {
      setToken(data.token);
    }
    return data;
  } catch (err) {
    if (err.name === 'TypeError' && err.message.includes('fetch')) {
      throw new Error('Unable to connect to Task Manager API server. Is the backend running on port 5000?');
    }
    throw err;
  }
}

export async function getMe() {
  try {
    const response = await fetch(`${API_BASE_URL}/me`, {
      method: 'GET',
      headers: getAuthHeaders({
        'Accept': 'application/json'
      })
    });
    return await handleResponse(response);
  } catch (err) {
    if (err.name === 'TypeError' && err.message.includes('fetch')) {
      throw new Error('Unable to connect to Task Manager API server. Is the backend running on port 5000?');
    }
    throw err;
  }
}

export function logoutUser() {
  removeToken();
}

/**
 * Task Endpoints (Protected by Authorization: Bearer <token>)
 */

/**
 * 1. GET /tasks - Fetch all tasks for authenticated user
 */
export async function getTasks() {
  try {
    const response = await fetch(`${API_BASE_URL}/tasks`, {
      method: 'GET',
      headers: getAuthHeaders({
        'Accept': 'application/json'
      })
    });
    return await handleResponse(response);
  } catch (err) {
    if (err.name === 'TypeError' && err.message.includes('fetch')) {
      throw new Error('Unable to connect to Task Manager API server. Is the backend running on port 5000?');
    }
    throw err;
  }
}

/**
 * 2. POST /tasks - Create a new task
 */
export async function createTask(taskData) {
  try {
    const response = await fetch(`${API_BASE_URL}/tasks`, {
      method: 'POST',
      headers: getAuthHeaders({
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }),
      body: JSON.stringify(taskData)
    });
    return await handleResponse(response);
  } catch (err) {
    if (err.name === 'TypeError' && err.message.includes('fetch')) {
      throw new Error('Unable to connect to Task Manager API server. Is the backend running on port 5000?');
    }
    throw err;
  }
}

/**
 * 3. PUT /tasks/:id - Update an existing task
 */
export async function updateTask(id, updates) {
  try {
    const response = await fetch(`${API_BASE_URL}/tasks/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders({
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }),
      body: JSON.stringify(updates)
    });
    return await handleResponse(response);
  } catch (err) {
    if (err.name === 'TypeError' && err.message.includes('fetch')) {
      throw new Error('Unable to connect to Task Manager API server. Is the backend running on port 5000?');
    }
    throw err;
  }
}

/**
 * 4. DELETE /tasks/:id - Delete a task
 */
export async function deleteTask(id) {
  try {
    const response = await fetch(`${API_BASE_URL}/tasks/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders({
        'Accept': 'application/json'
      })
    });
    return await handleResponse(response);
  } catch (err) {
    if (err.name === 'TypeError' && err.message.includes('fetch')) {
      throw new Error('Unable to connect to Task Manager API server. Is the backend running on port 5000?');
    }
    throw err;
  }
}

