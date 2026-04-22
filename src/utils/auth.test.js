import { describe, it, expect, beforeEach } from 'vitest';
import { isAdminAuthenticated, loginAdmin, logoutAdmin, SessionManager } from './auth.js';

describe('auth', () => {
  beforeEach(() => {
    sessionStorage.clear();
  });

  describe('isAdminAuthenticated', () => {
    it('returns false when no auth key is set in sessionStorage', () => {
      expect(isAdminAuthenticated()).toBe(false);
    });

    it('returns true when auth key is set to "true" in sessionStorage', () => {
      sessionStorage.setItem('hirehub_admin_auth', 'true');
      expect(isAdminAuthenticated()).toBe(true);
    });

    it('returns false when auth key is set to a value other than "true"', () => {
      sessionStorage.setItem('hirehub_admin_auth', 'false');
      expect(isAdminAuthenticated()).toBe(false);
    });

    it('returns false when auth key is an empty string', () => {
      sessionStorage.setItem('hirehub_admin_auth', '');
      expect(isAdminAuthenticated()).toBe(false);
    });
  });

  describe('loginAdmin', () => {
    it('sets the auth key to "true" in sessionStorage', () => {
      loginAdmin();
      expect(sessionStorage.getItem('hirehub_admin_auth')).toBe('true');
    });

    it('makes isAdminAuthenticated return true after login', () => {
      expect(isAdminAuthenticated()).toBe(false);
      loginAdmin();
      expect(isAdminAuthenticated()).toBe(true);
    });
  });

  describe('logoutAdmin', () => {
    it('removes the auth key from sessionStorage', () => {
      sessionStorage.setItem('hirehub_admin_auth', 'true');
      logoutAdmin();
      expect(sessionStorage.getItem('hirehub_admin_auth')).toBeNull();
    });

    it('makes isAdminAuthenticated return false after logout', () => {
      loginAdmin();
      expect(isAdminAuthenticated()).toBe(true);
      logoutAdmin();
      expect(isAdminAuthenticated()).toBe(false);
    });

    it('does not throw when called without a prior login', () => {
      expect(() => logoutAdmin()).not.toThrow();
      expect(isAdminAuthenticated()).toBe(false);
    });
  });

  describe('SessionManager', () => {
    it('exposes isAdminAuthenticated, loginAdmin, and logoutAdmin methods', () => {
      expect(typeof SessionManager.isAdminAuthenticated).toBe('function');
      expect(typeof SessionManager.loginAdmin).toBe('function');
      expect(typeof SessionManager.logoutAdmin).toBe('function');
    });

    it('works correctly through the SessionManager object', () => {
      expect(SessionManager.isAdminAuthenticated()).toBe(false);
      SessionManager.loginAdmin();
      expect(SessionManager.isAdminAuthenticated()).toBe(true);
      SessionManager.logoutAdmin();
      expect(SessionManager.isAdminAuthenticated()).toBe(false);
    });
  });
});