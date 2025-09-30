// lib/api.js

/**
 * The base URL of your backend API.
 * It's a good practice to use environment variables for this in a real project.
 */
const API_URL = 'http://localhost:4000/api/v1'; // <-- CHANGE 4000 to your backend's port

/**
 * Redirects the user to the backend's Google authentication endpoint.
 */
export const loginWithGoogle = () => {
  window.location.href = `${API_URL}/auth/google`;
};

/**
 * Checks if a user is currently authenticated by querying the backend.
 * This relies on the session cookie being sent automatically by the browser.
 * @returns {Promise<object|null>} The user object if authenticated, otherwise null.
 */
export const checkAuthStatus = async () => {
  try {
    // 'credentials: include' is essential for sending the httpOnly session cookie.
    const response = await fetch(`${API_URL}/api/auth/status`, {
      credentials: 'include',
    });

    if (!response.ok) {
      return null; // User is not logged in
    }

    const user = await response.json();
    return user;
  } catch (error) {
    console.error('Authentication check failed:', error);
    return null;
  }
};

/**
 * Logs the user out by calling the backend's logout endpoint.
 * @returns {Promise<boolean>} True if logout was successful, otherwise false.
 */
export const logoutUser = async () => {
  try {
    const response = await fetch(`${API_URL}/api/auth/logout`, {
      method: 'POST',
      credentials: 'include',
    });
    return response.ok;
  } catch (error) {
    console.error('Logout failed:', error);
    return false;
  }
};