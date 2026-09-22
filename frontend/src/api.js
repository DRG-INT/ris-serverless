const API_BASE = '/api/v1';
const TOKEN_KEY = 'accessToken';
const REFRESH_TOKEN_KEY = 'refreshToken';

export function getToken() { return localStorage.getItem(TOKEN_KEY); }
export function setToken(t) { localStorage.setItem(TOKEN_KEY, t); }
export function getRefreshToken() { return localStorage.getItem(REFRESH_TOKEN_KEY); }
export function setRefreshToken(t) { localStorage.setItem(REFRESH_TOKEN_KEY, t); }
export function clearTokens() { localStorage.removeItem(TOKEN_KEY); localStorage.removeItem(REFRESH_TOKEN_KEY); }

export async function api(url, options = {}) {
  const token = getToken();
  const headers = { 'Content-Type': 'application/json', ...(token ? { Authorization: 'Bearer ' + token } : {}), ...options.headers };
  const res = await fetch(API_BASE + url, { ...options, headers });
  if (res.status === 401) { clearTokens(); location.href = '/#/login'; throw new Error('Unauthorized'); }
  if (!res.ok) {
    let message = 'Request failed';
    try {
      const err = await res.json();
      message = err.error?.message || message;
    } catch {
      // keep default message
    }
    throw new Error(message);
  }
  if (res.status === 204) return null;
  return res.json();
}
