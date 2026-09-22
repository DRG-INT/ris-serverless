import { api, clearTokens } from '../api.js';
import { el } from '../utils.js';

export async function renderDashboard(app) {
  app.innerHTML = '';
  const shell = el('div', { class: 'flex h-screen' });
  const sidebar = el('aside', { class: 'fixed inset-y-0 left-0 z-50 w-64 bg-gray-900 text-white transform -translate-x-full lg:translate-x-0 transition-transform duration-200' });
  const content = el('div', { class: 'flex flex-1 flex-col lg:pl-64' });
  const header = el('header', { class: 'flex h-16 items-center justify-between bg-white px-4 shadow-sm lg:px-6' });
  const main = el('main', { class: 'flex-1 overflow-auto p-4 lg:p-6' });
  content.appendChild(header);
  content.appendChild(main);
  shell.appendChild(sidebar);
  shell.appendChild(content);
  app.appendChild(shell);

  const nav = [
    ['Dashboard', '#/dashboard'], ['Calendar', '#/calendar'], ['Activities', '#/activities'], ['Bookings', '#/bookings'],
    ['Members', '#/members'], ['Memberships', '#/memberships'], ['Attendance', '#/attendance'], ['Payments', '#/payments'],
    ['CRM', '#/crm'], ['Messages', '#/messages'], ['Reports', '#/reports'], ['Settings', '#/settings'],
  ];
  const navEl = el('nav', { class: 'mt-5 px-2 space-y-1' });
  sidebar.appendChild(el('div', { class: 'flex h-16 items-center justify-center border-b border-gray-800', text: 'Recreation in Sport' }));
  nav.forEach(([name, href]) => {
    const a = el('a', { href, class: 'block rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-800 hover:text-white', text: name });
    navEl.appendChild(a);
  });
  sidebar.appendChild(navEl);

  const userEmailEl = el('span', { class: 'text-sm text-gray-700' });
  const logoutBtn = el('button', { class: 'rounded-md bg-gray-100 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-200', text: 'Logout' });
  logoutBtn.onclick = () => { clearTokens(); location.hash = '#/login'; };
  header.appendChild(el('button', { class: 'lg:hidden text-2xl', text: '☰' }));
  header.appendChild(el('div', { class: 'ml-auto flex items-center gap-4' }));
  header.lastChild.appendChild(userEmailEl);
  header.lastChild.appendChild(logoutBtn);

  try {
    const userRes = await api('/auth/me');
    if (userRes?.user?.email) {
      userEmailEl.textContent = userRes.user.email;
    }
  } catch (e) {
    // If not authenticated, redirect handled by api() interceptor
  }

  const views = {
    dashboard: async () => {
      main.innerHTML = '';
      main.appendChild(el('h1', { class: 'text-2xl font-bold text-gray-900 mb-6', text: 'Dashboard' }));
      const grid = el('div', { class: 'grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6' });
      const stats = [
        ['Total Members', 'members', 'meta.total'],
        ['Activities', 'activities', 'length'],
        ['Revenue', 'reports/revenue', 'total'],
      ];
      for (const [label, ep, field] of stats) {
        const card = el('div', { class: 'card p-4' });
        card.appendChild(el('p', { class: 'text-sm font-medium text-gray-600', text: label }));
        const value = el('p', { class: 'mt-2 text-3xl font-bold text-gray-900' });
        card.appendChild(value);
        grid.appendChild(card);
        try {
          const data = await api('/' + ep);
          if (field === 'length') value.textContent = data.length || 0;
          else if (field === 'meta.total') value.textContent = data?.meta?.total || 0;
          else value.textContent = data?.total?.toLocaleString() || 0;
        } catch (e) { value.textContent = '-'; }
      }
      const statusCard = el('div', { class: 'card p-4' });
      statusCard.appendChild(el('p', { class: 'text-sm font-medium text-gray-600', text: 'Status' }));
      statusCard.appendChild(el('p', { class: 'mt-2 text-3xl font-bold text-green-600', text: 'Active' }));
      grid.appendChild(statusCard);
      main.appendChild(grid);

      const recentCard = el('div', { class: 'card p-4' });
      recentCard.appendChild(el('h2', { class: 'text-lg font-semibold text-gray-900 mb-4', text: 'Recent Activities' }));
      try {
        const activities = await api('/activities');
        if (activities && activities.length) {
          const ul = el('ul', { class: 'mt-4 space-y-2' });
          activities.slice(0, 5).forEach(a => ul.appendChild(el('li', { class: 'text-sm text-gray-700', text: a.name + ' - ' + a.type })));
          recentCard.appendChild(ul);
        } else recentCard.appendChild(el('p', { class: 'mt-4 text-sm text-gray-500', text: 'No activities yet.' }));
      } catch (e) { recentCard.appendChild(el('p', { class: 'mt-4 text-sm text-error', text: 'Failed to load activities.' })); }
      main.appendChild(recentCard);
    },
    members: async () => {
      main.innerHTML = '';
      main.appendChild(el('h1', { class: 'text-2xl font-bold text-gray-900 mb-6', text: 'Members' }));
      const card = el('div', { class: 'card' });
      const form = el('form', { class: 'p-4 border-b border-gray-200 space-y-4' });
      form.appendChild(el('h2', { class: 'text-lg font-semibold', text: 'New Member' }));
      const fields = [
        { label: 'First name', name: 'firstName' },
        { label: 'Last name', name: 'lastName' },
        { label: 'Email', name: 'email', type: 'email' },
        { label: 'Phone', name: 'phone' },
      ];
      const inputs = {};
      fields.forEach(f => {
        form.appendChild(el('label', { class: 'label', text: f.label }));
        inputs[f.name] = el('input', { type: f.type || 'text', name: f.name, class: 'input', required: f.name !== 'phone' ? '' : undefined });
        form.appendChild(inputs[f.name]);
      });
      const btn = el('button', { type: 'submit', class: 'btn btn-primary', text: 'Create Member' });
      form.appendChild(btn);
      const errorEl = el('p', { class: 'text-sm text-error hidden' });
      form.appendChild(errorEl);
      card.appendChild(form);
      const tableWrap = el('div', { class: 'overflow-x-auto' });
      const table = el('table', { class: 'min-w-full divide-y divide-gray-200' });
      table.innerHTML = '<thead class="bg-gray-50"><tr><th class="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">Name</th><th class="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">Email</th><th class="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">Phone</th><th class="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">Status</th></tr></thead><tbody class="divide-y divide-gray-200 bg-white"></tbody>';
      const tbody = table.querySelector('tbody');
      tableWrap.appendChild(table);
      card.appendChild(tableWrap);
      main.appendChild(card);
      async function loadMembers() {
        try {
          const data = await api('/members');
          tbody.innerHTML = '';
          if (!data.data || !data.data.length) { tbody.innerHTML = '<tr><td colspan="4" class="px-4 py-8 text-center text-sm text-gray-500">No members found.</td></tr>'; return; }
          data.data.forEach(m => {
            tbody.appendChild(el('tr', { class: 'hover:bg-gray-50', html: '<td class="px-4 py-3 text-sm font-medium text-gray-900">' + m.firstName + ' ' + m.lastName + '</td><td class="px-4 py-3 text-sm text-gray-700">' + m.email + '</td><td class="px-4 py-3 text-sm text-gray-700">' + (m.phone || '-') + '</td><td class="px-4 py-3 text-sm"><span class="badge ' + (m.status === 'active' ? 'badge-success' : '') + '">' + m.status + '</span></td>' }));
          });
        } catch (e) { tbody.innerHTML = '<tr><td colspan="4" class="px-4 py-8 text-center text-sm text-error">Failed to load members.</td></tr>'; }
      }
      await loadMembers();
      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        errorEl.classList.add('hidden');
        btn.disabled = true;
        try { await api('/members', { method: 'POST', body: JSON.stringify({ firstName: inputs.firstName.value, lastName: inputs.lastName.value, email: inputs.email.value, phone: inputs.phone.value || undefined }) }); form.reset(); await loadMembers(); }
        catch (err) { errorEl.textContent = err.message; errorEl.classList.remove('hidden'); }
        finally { btn.disabled = false; }
      });
    },
    genericList: async (title, endpoint, columns) => {
      main.innerHTML = '';
      main.appendChild(el('h1', { class: 'text-2xl font-bold text-gray-900 mb-6', text: title }));
      const card = el('div', { class: 'card' });
      const tableWrap = el('div', { class: 'overflow-x-auto' });
      const table = el('table', { class: 'min-w-full divide-y divide-gray-200' });
      const thead = el('thead', { class: 'bg-gray-50' });
      const headerRow = el('tr');
      columns.forEach(col => headerRow.appendChild(el('th', { class: 'px-4 py-3 text-left text-xs font-medium uppercase text-gray-500', text: col.label })));
      thead.appendChild(headerRow);
      table.appendChild(thead);
      const tbody = el('tbody', { class: 'divide-y divide-gray-200 bg-white' });
      table.appendChild(tbody);
      tableWrap.appendChild(table);
      card.appendChild(tableWrap);
      main.appendChild(card);
      try {
        const data = await api('/' + endpoint);
        if (!data || (Array.isArray(data) && !data.length)) { tbody.innerHTML = '<tr><td colspan="' + columns.length + '" class="px-4 py-8 text-center text-sm text-gray-500">No records found.</td></tr>'; return; }
        (Array.isArray(data) ? data : [data]).forEach(row => {
          const tr = el('tr', { class: 'hover:bg-gray-50' });
          columns.forEach(col => tr.appendChild(el('td', { class: 'px-4 py-3 text-sm text-gray-700', text: col.render ? col.render(row) : (row[col.key] || '-') })));
          tbody.appendChild(tr);
        });
      } catch (e) { tbody.innerHTML = '<tr><td colspan="' + columns.length + '" class="px-4 py-8 text-center text-sm text-error">Failed to load ' + title.toLowerCase() + '.</td></tr>'; }
    },
    reports: async () => {
      main.innerHTML = '';
      main.appendChild(el('h1', { class: 'text-2xl font-bold text-gray-900 mb-6', text: 'Reports' }));
      const grid = el('div', { class: 'grid grid-cols-1 gap-6 lg:grid-cols-3' });
      const cards = [
        { title: 'Revenue', ep: '/reports/revenue', render: r => (r?.total?.toLocaleString() || '0') + ' ' + (r?.currency || '') + '<div class="mt-1 text-xs text-gray-500">' + (r?.count || 0) + ' transactions</div>' },
        { title: 'Bookings', ep: '/reports/bookings', render: r => '<div>' + (r?.total || 0) + '</div><div class="mt-1 text-xs text-gray-500">' + Object.entries(r?.byStatus || {}).map(([k,v]) => k + ': ' + v).join(', ') + '</div>' },
        { title: 'Members', ep: '/reports/members', render: r => '<div>' + (r?.total || 0) + '</div><div class="mt-1 text-xs text-gray-500">' + (r?.activeMemberships || 0) + ' active memberships</div>' },
      ];
      for (const c of cards) {
        const card = el('div', { class: 'card p-4' });
        card.appendChild(el('h3', { class: 'text-sm font-medium text-gray-600', text: c.title }));
        const body = el('div', { class: 'mt-2 text-3xl font-bold text-gray-900' });
        card.appendChild(body);
        grid.appendChild(card);
        try { const data = await api(c.ep); body.innerHTML = c.render(data); } catch (e) { body.textContent = '-'; }
      }
      main.appendChild(grid);
    },
    settings: () => {
      main.innerHTML = '';
      main.appendChild(el('h1', { class: 'text-2xl font-bold text-gray-900 mb-6', text: 'Settings' }));
      const grid = el('div', { class: 'grid grid-cols-1 gap-6 lg:grid-cols-2' });
      const sections = [
        { title: 'Organization', text: 'Manage organization details and settings through the API.' },
        { title: 'Users & Roles', text: 'Manage staff, instructors, and permissions.' },
        { title: 'Integrations', text: 'Configure third-party integrations.' },
        { title: 'Security', text: 'Security and authentication settings.' },
      ];
      sections.forEach(s => {
        const card = el('div', { class: 'card p-4' });
        card.appendChild(el('h2', { class: 'text-lg font-semibold text-gray-900', text: s.title }));
        card.appendChild(el('p', { class: 'mt-1 text-sm text-gray-600', text: s.text }));
        grid.appendChild(card);
      });
      main.appendChild(grid);
    },
  };

  const routeViews = {
    '#/dashboard': () => views.dashboard(),
    '#/members': () => views.members(),
    '#/activities': () => views.genericList('Activities', 'activities', [{ key: 'name' }, { key: 'type' }, { key: 'capacity' }, { key: 'duration' }, { key: 'status' }]),
    '#/calendar': () => views.genericList('Calendar', 'scheduling', [{ key: 'activityId', label: 'Activity' }, { key: 'locationId', label: 'Location' }, { key: 'startsAt', label: 'Starts', render: r => new Date(r.startsAt).toLocaleString() }, { key: 'endsAt', label: 'Ends', render: r => new Date(r.endsAt).toLocaleString() }, { key: 'capacity' }, { key: 'status' }]),
    '#/bookings': () => views.genericList('Bookings', 'bookings', [{ key: 'memberId' }, { key: 'sessionId' }, { key: 'status' }, { key: 'source' }]),
    '#/memberships': () => views.genericList('Memberships', 'memberships', [{ key: 'memberId' }, { key: 'productId' }, { key: 'status' }, { key: 'startsAt', render: r => new Date(r.startsAt).toLocaleDateString() }, { key: 'expiresAt', render: r => r.expiresAt ? new Date(r.expiresAt).toLocaleDateString() : '-' }]),
    '#/attendance': () => views.genericList('Attendance', 'attendance', [{ key: 'memberId' }, { key: 'sessionId' }, { key: 'method' }, { key: 'checkedInAt', render: r => new Date(r.checkedInAt).toLocaleString() }]),
    '#/payments': () => views.genericList('Payments', 'payments', [{ key: 'memberId' }, { key: 'amount', render: r => Number(r.amount).toFixed(2) }, { key: 'currency' }, { key: 'status' }, { key: 'provider' }]),
    '#/crm': () => views.genericList('CRM', 'crm', [{ key: 'source' }, { key: 'status' }, { key: 'notes' }, { key: 'createdAt', render: r => new Date(r.createdAt).toLocaleDateString() }]),
    '#/messages': () => views.genericList('Messages', 'messages', [{ key: 'channel' }, { key: 'subject' }, { key: 'status' }, { key: 'sentAt', render: r => r.sentAt ? new Date(r.sentAt).toLocaleString() : '-' }]),
    '#/reports': () => views.reports(),
    '#/settings': () => views.settings(),
  };

  function renderRoute() {
    const hash = location.hash || '#/dashboard';
    const view = routeViews[hash];
    if (view) view();
    else main.innerHTML = '<div class="p-6 text-sm text-gray-600">Select a section from the sidebar.</div>';
  }

  window.addEventListener('hashchange', renderRoute);
  renderRoute();
}
