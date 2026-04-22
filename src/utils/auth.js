/**
 * SessionManager / AdminAuthManager
 *
 * Session-based admin authentication utility using sessionStorage.
 * Provides login, logout, and authentication check for admin access gating.
 *
 * @module auth
 */

const AUTH_KEY = 'hirehub_admin_auth';

/**
 * Checks if the admin is currently authenticated.
 * Reads from sessionStorage to ensure tab isolation.
 *
 * @returns {boolean} True if admin is authenticated, false otherwise.
 */
export function isAdminAuthenticated() {
  try {
    return sessionStorage.getItem(AUTH_KEY) === 'true';
  } catch (e) {
    console.error('SessionManager: Failed to read admin auth state.', e);
    return false;
  }
}

/**
 * Sets the admin session as authenticated.
 * Stores 'true' in sessionStorage under the auth key.
 */
export function loginAdmin() {
  try {
    sessionStorage.setItem(AUTH_KEY, 'true');
  } catch (e) {
    console.error('SessionManager: Failed to set admin auth state.', e);
  }
}

/**
 * Clears the admin session, logging the admin out.
 * Removes the auth key from sessionStorage.
 */
export function logoutAdmin() {
  try {
    sessionStorage.removeItem(AUTH_KEY);
  } catch (e) {
    console.error('SessionManager: Failed to remove admin auth state.', e);
  }
}

export const SessionManager = {
  isAdminAuthenticated,
  loginAdmin,
  logoutAdmin,
};