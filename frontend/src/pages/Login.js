import React, { useState } from 'react';
import { api } from '../api';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const Login = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    phone: '',
    confirmPassword: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isLogin) {
        const res = await api.login({ email: formData.email, password: formData.password });
        localStorage.setItem('token', res.data.token);
      } else {
        const res = await api.register({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
          confirmPassword: formData.confirmPassword,
          role: 'user',
        });
        localStorage.setItem('token', res.data.token);
      }
      localStorage.setItem('isAuthenticated', 'true');
      navigate('/dashboard');
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="text-center mb-4">
          <div className="login-icon">
            <i className="fas fa-donate"></i>
          </div>
          <h3 className="login-title">Investa</h3>
          <p className="login-subtitle">Secure Login to Dashboard</p>
        </div>

        {/* Login Form */}
        {isLogin ? (
          <form id="loginForm" onSubmit={handleSubmit}>
            <h5 className="text-white mb-4">Login</h5>
            <div className="mb-3">
              <label htmlFor="loginEmail" className="form-label">Email Address</label>
              <div className="input-group">
                <span className="input-group-text">
                  <i className="fas fa-envelope"></i>
                </span>
                <input
                  type="email"
                  className="form-control"
                  id="loginEmail"
                  name="email"
                  placeholder="Enter"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="mb-4">
              <label htmlFor="loginPassword" className="form-label">Password</label>
              <div className="input-group">
                <span className="input-group-text">
                  <i className="fas fa-lock"></i>
                </span>
                <input
                  type="password"
                  className="form-control"
                  id="loginPassword"
                  name="password"
                  placeholder="Enter"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <button
              type="submit"
              className="login-btn"
            >
              <i className="fas fa-arrow-right me-2"></i>Login
            </button>
            <p className="text-center mt-3 mb-0">
              <span className="text-white-50">New user?</span>
              <span
                className="register-link"
                onClick={() => setIsLogin(false)}
              >
                Register
              </span>
            </p>
          </form>
        ) : (
          <form id="registerForm" onSubmit={handleSubmit}>
            <h5 className="text-white mb-4">Register</h5>
            <div className="mb-3">
              <label htmlFor="registerName" className="form-label">Full Name</label>
              <div className="input-group">
                <span className="input-group-text">
                  <i className="fas fa-user"></i>
                </span>
                <input
                  type="text"
                  className="form-control"
                  id="registerName"
                  name="name"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="mb-3">
              <label htmlFor="registerEmail" className="form-label">Email Address</label>
              <div className="input-group">
                <span className="input-group-text">
                  <i className="fas fa-envelope"></i>
                </span>
                <input
                  type="email"
                  className="form-control"
                  id="registerEmail"
                  name="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="mb-3">
              <label htmlFor="registerPhone" className="form-label">Phone Number</label>
              <div className="input-group">
                <span className="input-group-text">
                  <i className="fas fa-phone"></i>
                </span>
                <input
                  type="tel"
                  className="form-control"
                  id="registerPhone"
                  name="phone"
                  placeholder="Enter your phone number"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="mb-3">
              <label htmlFor="registerPassword" className="form-label">Password</label>
              <div className="input-group">
                <span className="input-group-text">
                  <i className="fas fa-lock"></i>
                </span>
                <input
                  type="password"
                  className="form-control"
                  id="registerPassword"
                  name="password"
                  placeholder="Create a password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="mb-4">
              <label htmlFor="registerConfirmPassword" className="form-label">Confirm Password</label>
              <div className="input-group">
                <span className="input-group-text">
                  <i className="fas fa-lock"></i>
                </span>
                <input
                  type="password"
                  className="form-control"
                  id="registerConfirmPassword"
                  name="confirmPassword"
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <button
              type="submit"
              className="register-btn"
            >
              <i className="fas fa-user-plus me-2"></i>Create Account
            </button>
            <p className="text-center mt-3 mb-0">
              <span className="text-white-50">Already have an account?</span>
              <span
                className="register-link"
                onClick={() => setIsLogin(true)}
              >
                Login
              </span>
            </p>
          </form>
        )}
      </div>
    </div>
  );
};

export default Login;
