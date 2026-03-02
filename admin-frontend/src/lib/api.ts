const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const getToken = () => localStorage.getItem('adminToken');

async function request(path: string, options: RequestInit = {}) {
  const headers: Record<string, string> = { 'Content-Type': 'application/json', ...(options.headers as Record<string, string> || {}) };
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });
  const data = await res.json().catch(() => ({}));
  if (!res.ok || data.success === false) throw new Error(data.message || 'Request failed');
  return data;
}

export const api = {
  login: (email: string, password: string) => request('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),
  dashboard: () => request('/admin/dashboard'),
  users: () => request('/admin/users'),
  updateUserStatus: (id: string, isBlocked: boolean) => request(`/admin/users/${id}/status`, { method: 'PATCH', body: JSON.stringify({ isBlocked }) }),
  adjustWallet: (id: string, amount: number, action: 'CREDIT'|'DEBIT') => request(`/admin/users/${id}/wallet`, { method: 'PATCH', body: JSON.stringify({ amount, action }) }),
  plans: () => request('/admin/plans'),
  createPlan: (payload: any) => request('/admin/plans', { method: 'POST', body: JSON.stringify(payload) }),
  updatePlan: (id: string, payload: any) => request(`/admin/plans/${id}`, { method: 'PUT', body: JSON.stringify(payload) }),
  togglePlan: (id: string) => request(`/admin/plans/${id}/toggle`, { method: 'PATCH' }),
  deletePlan: (id: string) => request(`/admin/plans/${id}`, { method: 'DELETE' }),
  pendingDeposits: () => request('/deposits/admin/pending'),
  reviewDeposit: (id: string, action: 'APPROVE'|'REJECT', reviewNote = '') => request(`/deposits/admin/${id}/review`, { method: 'PATCH', body: JSON.stringify({ action, reviewNote }) }),
  pendingWithdrawals: () => request('/withdrawals/admin/pending'),
  reviewWithdrawal: (id: string, action: 'APPROVE'|'DENY', denyReason = '', txHash = '') => request(`/withdrawals/admin/${id}/review`, { method: 'PATCH', body: JSON.stringify({ action, denyReason, txHash }) }),
};
