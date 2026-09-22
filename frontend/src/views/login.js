import { api, setToken, setRefreshToken } from '../api.js';

export function renderLogin(app) {
  app.innerHTML = '';
  const wrap = document.createElement('div');
  wrap.className = 'flex items-center justify-center h-screen bg-gray-50 p-4';
  const card = document.createElement('div');
  card.className = 'card p-6 w-full max-w-sm';
  card.appendChild(document.createElement('h1')).className = 'text-xl font-bold text-gray-900 text-center mb-1';
  card.lastChild.textContent = 'Recreation in Sport';
  card.appendChild(document.createElement('p')).className = 'text-sm text-gray-600 text-center mb-6';
  card.lastChild.textContent = 'Sign in to your account';

  const form = document.createElement('form');
  form.className = 'space-y-4';
  const error = document.createElement('div');
  error.className = 'hidden text-sm text-error';

  const emailInput = document.createElement('input');
  emailInput.type = 'email';
  emailInput.placeholder = 'Email';
  emailInput.className = 'input';
  emailInput.required = true;

  const passwordInput = document.createElement('input');
  passwordInput.type = 'password';
  passwordInput.placeholder = 'Password';
  passwordInput.className = 'input';
  passwordInput.required = true;

  const btn = document.createElement('button');
  btn.type = 'submit';
  btn.className = 'btn btn-primary w-full';
  btn.textContent = 'Sign in';

  form.appendChild(error);
  form.appendChild(document.createElement('label')).textContent = 'Email';
  form.appendChild(emailInput);
  form.appendChild(document.createElement('label')).textContent = 'Password';
  form.appendChild(passwordInput);
  form.appendChild(btn);
  form.appendChild(document.createElement('p')).className = 'text-sm text-gray-600 text-center';
  form.lastChild.innerHTML = 'No account? <a href="#/register" class="text-primary-600">Register</a>';

  card.appendChild(form);
  wrap.appendChild(card);
  app.appendChild(wrap);

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    error.classList.add('hidden');
    btn.disabled = true;
    try {
      const res = await api('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email: emailInput.value, password: passwordInput.value }),
      });
      setToken(res.accessToken);
      setRefreshToken(res.refreshToken);
      location.hash = '#/dashboard';
    } catch (err) {
      error.textContent = err.message;
      error.classList.remove('hidden');
    } finally {
      btn.disabled = false;
    }
  });
}
