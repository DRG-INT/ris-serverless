import { renderLogin } from './views/login.js';
import { renderRegister } from './views/register.js';
import { renderDashboard } from './views/dashboard.js';

export function renderRoute() {
  const hash = location.hash || '#/dashboard';
  if (hash === '#/login' || hash === '#/register') {
    if (localStorage.getItem('accessToken')) {
      location.hash = '#/dashboard';
      return;
    }
  }
  const app = document.getElementById('app');
  if (!app) return;
  app.innerHTML = '';

  if (hash === '#/login') renderLogin(app);
  else if (hash === '#/register') renderRegister(app);
  else renderDashboard(app);
}

export function initRouter() {
  window.addEventListener('hashchange', renderRoute);
  renderRoute();
}
