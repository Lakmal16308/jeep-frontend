import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

function Login() {
  const [formData, setFormData] = useState({ email: '', password: '', role: 'tourist' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const apiUrl = process.env.REACT_APP_API_URL || 'https://jeep-ten.vercel.app';
  const cleanApiUrl = apiUrl.replace(/\/+$/, '');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(null); // Clear error on input change
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (!formData.email || !formData.password) {
        throw new Error('Email and password are required');
      }

      console.log(`[${new Date().toISOString()}] Sending login request to ${cleanApiUrl}/api/auth/login:`, {
        email: formData.email,
        role: formData.role
      });

      const res = await axios.post(`${cleanApiUrl}/api/auth/login`, formData, {
        headers: { 'Content-Type': 'application/json' }
      });

      console.log(`[${new Date().toISOString()}] Login response:`, res.data);

      localStorage.setItem('token', res.data.token);
      if (formData.role === 'tourist') {
        navigate('/tourist-dashboard');
      } else if (formData.role === 'provider') {
        navigate('/provider-dashboard');
      } else if (formData.role === 'admin') {
        navigate('/admin-panel');
      }
    } catch (err) {
      console.error(`[${new Date().toISOString()}] Login error:`, {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status
      });
      setError(err.response?.data?.error || err.message || 'Failed to log in. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container container">
      <h2>Login</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Role</label>
          <select name="role" value={formData.role} onChange={handleChange}>
            <option value="tourist">Tourist</option>
            <option value="provider">Provider</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        <div className="form-group">
          <label>{formData.role === 'admin' ? 'Username' : 'Email'}</label>
          <input
            type="text"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <button type="submit" disabled={loading}>
            {loading ? 'Logging In...' : 'Login'}
          </button>
        </div>
      </form>
      <p>
        Don't have an account? <Link to="/signup">Sign Up</Link>
      </p>
    </div>
  );
}

export default Login;