import { api, setToken, setRefreshToken } from '../api.js';

export function renderRegister(app) {
  app.innerHTML = '';
  const wrap = document.createElement('div');
  wrap.className = 'flex items-center justify-center h-screen bg-gray-50 p-4';
  const card = document.createElement('div');
  card.className = 'card p-6 w-full max-w-sm';
  card.appendChild(document.createElement('h1')).className = 'text-xl font-bold text-gray-900 text-center mb-1';
  card.lastChild.textContent = 'Recreation in Sport';
  card.appendChild(document.createElement('p')).className = 'text-sm text-gray-600 text-center mb-6';
  card.lastChild.textContent = 'Create your account';

  const form = document.createElement('form');
  form.className = 'space-y-4';
  const error = document.createElement('div');
  error.className = 'hidden text-sm text-error';

  const fields = [
    { label: 'First name', name: 'firstName', type: 'text' },
    { label: 'Last name', name: 'lastName', type: 'text' },
    { label: 'Organization', name: 'organizationName', type: 'text' },
    { label: 'Email', name: 'email', type: 'email' },
    { label: 'Password', name: 'password', type: 'password' },
  ];
  const inputs = {};
  fields.forEach(f => {
    form.appendChild(document.createElement('label')).className = 'label';
    form.lastChild.textContent = f.label;
    inputs[f.name] = document.createElement('input');
    inputs[f.name].type = f.type;
    inputs[f.name].name = f.name;
    inputs[f.name].className = 'input';
    inputs[f.name].required = true;
    form.appendChild(inputs[f.name]);
  });

  const btn = document.createElement('button');
  btn.type = 'submit';
  btn.className = 'btn btn-primary w-full';
  btn.textContent = 'Create account';

  form.appendChild(btn);
  form.appendChild(document.createElement('p')).className = 'text-sm text-gray-600 text-center';
  form.lastChild.innerHTML = 'Have an account? <a href="#/login" class="text-primary-600">Sign in</a>';

  card.appendChild(form);
  wrap.appendChild(card);
  app.appendChild(wrap);

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    error.classList.add('hidden');
    btn.disabled = true;
    try {
      const res = await api('/auth/register', {
        method: 'POST',
        body: JSON.stringify({
          email: inputs.email.value,
          password: inputs.password.value,
          firstName: inputs.firstName.value,
          lastName: inputs.lastName.value,
          organizationName: inputs.organizationName.value,
        }),
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
