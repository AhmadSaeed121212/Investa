const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const getToken = () => localStorage.getItem('token');

async function request(path, { method = 'GET', body, isForm = false } = {}) {
  const headers = {};
  if (!isForm) headers['Content-Type'] = 'application/json';
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers,
    body: body ? (isForm ? body : JSON.stringify(body)) : undefined,
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok || data.success === false) {
    throw new Error(data.message || 'Request failed');
  }
  return data;
}

export const api = {
  register: (payload) => request('/auth/register', { method: 'POST', body: payload }),
  login: (payload) => request('/auth/login', { method: 'POST', body: payload }),
  me: () => request('/auth/me'),
  wallet: () => request('/wallet'),
  walletLedger: () => request('/wallet/ledger'),
  referralSummary: () => request('/wallet/referrals'),
  paymentMethods: () => request('/payment-methods'),
  createDeposit: (formData) => request('/deposits', { method: 'POST', body: formData, isForm: true }),
  myDeposits: () => request('/deposits/my'),
  createWithdrawal: (payload) => request('/withdrawals', { method: 'POST', body: payload }),
  myWithdrawals: () => request('/withdrawals/my'),
  plans: () => request('/plans'),
  invest: (payload) => request('/investments', { method: 'POST', body: payload }),
  myInvestments: () => request('/investments/my'),
  creditEarnings: () => request('/investments/my/credit-earnings', { method: 'POST' }),
  notifications: () => request('/notifications'),
};
