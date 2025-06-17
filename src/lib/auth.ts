'use client';

const AUTH_KEY = 'isLoggedIn';

export function isAuthenticated(): boolean {
  if (typeof window !== 'undefined') {
    return localStorage.getItem(AUTH_KEY) === 'true';
  }
  return false;
}

export function login(): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(AUTH_KEY, 'true');
  }
}

export function logout(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(AUTH_KEY);
  }
}
