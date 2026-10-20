// Centralized API helper for Task Manager Express + MongoDB backend
const API_BASE_URL = 'http://localhost:5000';

/**
 * Helper to process fetch responses, handle errors, and return JSON.
 */
async function handleResponse(response) {
  if (!response.ok) {
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
 * 1. GET /tasks - Fetch all tasks from MongoDB
 */
export async function getTasks() {
  try {
    const response = await fetch(`${API_BASE_URL}/tasks`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
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
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
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
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
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
      headers: {
        'Accept': 'application/json'
      }
    });
    return await handleResponse(response);
  } catch (err) {
    if (err.name === 'TypeError' && err.message.includes('fetch')) {
      throw new Error('Unable to connect to Task Manager API server. Is the backend running on port 5000?');
    }
    throw err;
  }
}
