import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import { api } from '../api';
import './Profile.css';

const Profile = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    api.me().then((r)=>setUser(r.data.user)).catch(console.error);
  }, []);

  const logout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('token');
    window.location.href = '/';
  };

  return (
    <Layout title="Profile">
      <div className="p-4 dashboard-card">
        <h4 className="text-white">{user?.name || '-'}</h4>
        <p className="text-gray">{user?.email}</p>
        <p className="text-gray">{user?.phone}</p>
        <p className="text-gray">Referral Code: {user?.referralCode}</p>
        <button className="btn-deposit" onClick={logout}>Logout</button>
      </div>
    </Layout>
  );
};

export default Profile;
