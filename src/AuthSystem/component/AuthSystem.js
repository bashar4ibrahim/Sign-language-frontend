// src/components/AuthSystem.js
import React, { useState } from 'react';
import axios from 'axios';
import './AuthSystem.css';

axios.defaults.withCredentials = true; // Enable sending cookies for session-based auth
 const SERVER_URL = process.env.REACT_APP_SERVER_URL;
const AuthSystem = () => {
  const [mode, setMode] = useState('userLogin'); // userLogin, userSignup, adminLogin
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [message, setMessage] = useState({ text: '', type: '' });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: '', type: '' });

    try {
      let response;
      const { name, email, password } = formData;

      if (mode === 'userSignup') {
        response = await axios.post(`${SERVER_URL}/api/auth/register`, { name, email, password });
        setMessage({ text: 'Registration successful! Please login.', type: 'success' });
        setMode('userLogin');
      } else {
        response = await axios.post(`${SERVER_URL}/api/auth/login`, { email, password });

        if (mode === 'adminLogin' && !response.data.user?.is_admin) {
          setMessage({ text: 'Admin privileges required', type: 'error' });
          return;
        }

        setMessage({ text: 'Login successful!', type: 'success' });

        setTimeout(() => {
          window.location.href = response.data.user?.is_admin ? '/Admin' : '/';
        }, 1500);
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message ||
        (mode === 'userSignup' ? 'Registration failed' : 'Login failed');
      setMessage({ text: errorMsg, type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const renderForm = () => {
    const isLogin = mode.includes('Login');
    const isAdmin = mode === 'adminLogin';

    return (
      <form onSubmit={handleSubmit} className="auth-form">
        <div className="form-header">
          <div className={`form-icon ${isAdmin ? 'admin' : ''}`}>
            {isAdmin ? (
              <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 15a3 3 0 100-6 3 3 0 000 6z" /><path fillRule="evenodd" d="M1.323 11.447C2.811 6.976 7.028 3.75 12.001 3.75c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113-1.487 4.471-5.705 7.697-10.677 7.697-4.97 0-9.186-3.223-10.675-7.69a1.762 1.762 0 010-1.113z" /></svg>
            ) : (
              <svg viewBox="0 0 24 24" fill="currentColor"><path fillRule="evenodd" d="M18.685 19.097A9.723 9.723 0 0021.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 003.065 7.097A9.716 9.716 0 0012 21.75a9.716 9.716 0 006.685-2.653zM15.75 9a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" /></svg>
            )}
          </div>
          <h2>{isAdmin ? 'Admin Login' : mode === 'userSignup' ? 'Create Account' : 'User Login'}</h2>
          <p className="subtitle">{isAdmin ? 'Access the administration panel' : mode === 'userSignup' ? 'Join our community' : 'Welcome back!'}</p>
        </div>

        {mode === 'userSignup' && (
          <div className="form-group">
            <label>Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Enter your full name"
            />
          </div>
        )}

        <div className="form-group">
          <label>Email Address</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            placeholder="Enter your email"
          />
        </div>

        <div className="form-group">
          <label>Password</label>
          <div className="password-wrapper">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              minLength={6}
              placeholder="Enter your password"
            />
            <button type="button" className="password-toggle" onClick={togglePasswordVisibility}>
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </div>
        </div>

        <button type="submit" disabled={loading}>
          {loading ? 'Processing...' : isLogin ? 'Login' : 'Sign Up'}
        </button>

        {message.text && (
          <div className={`form-message ${message.type}`}>{message.text}</div>
        )}

        <div className="form-switch">
          {mode === 'userLogin' ? (
            <>
              <span>Don’t have an account?</span>
              <button type="button" onClick={() => setMode('userSignup')}>Sign Up</button>
              <button type="button" onClick={() => setMode('adminLogin')}>Admin Login</button>
            </>
          ) : (
            <button type="button" onClick={() => setMode('userLogin')}>Back to User Login</button>
          )}
        </div>
      </form>
    );
  };

  return (
    <div className="auth-system">
      {renderForm()}
    </div>
  );
};

export default AuthSystem;
