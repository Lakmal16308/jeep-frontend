import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

function Signup() {
  const [formData, setFormData] = useState({
    role: 'tourist',
    fullName: '',
    email: '',
    password: '',
    country: '',
    serviceName: '',
    contact: '',
    category: '',
    location: '',
    price: '',
    description: '',
    profilePicture: null,
    photos: []
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const categories = [
    'Jeep Safari',
    'Tuk Tuk Ride',
    'Catamaran Boat Ride',
    'Bullock Cart Ride',
    'Village Lunch'
  ];

  const apiUrl = process.env.REACT_APP_API_URL || 'https://jeep-ten.vercel.app';
  const cleanApiUrl = apiUrl.replace(/\/+$/, '');

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'profilePicture') {
      setFormData({ ...formData, [name]: files[0] });
    } else if (name === 'photos') {
      setFormData({ ...formData, [name]: Array.from(files) });
    } else {
      setFormData({ ...formData, [name]: value });
    }
    setError(null); // Clear error on input change
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Validate password length
      if (formData.password.length < 6) {
        throw new Error('Password must be at least 6 characters');
      }

      const endpoint = formData.role === 'tourist' ? '/api/auth/tourist/signup' : '/api/auth/provider/signup';
      const headers = formData.role === 'tourist' ? { 'Content-Type': 'application/json' } : { 'Content-Type': 'multipart/form-data' };
      let data;

      if (formData.role === 'tourist') {
        if (!formData.fullName || !formData.email || !formData.country) {
          throw new Error('Full name, email, and country are required');
        }
        data = {
          fullName: formData.fullName,
          email: formData.email,
          password: formData.password,
          country: formData.country
        };
      } else {
        if (!formData.serviceName || !formData.contact || !formData.category || !formData.location || !formData.price || !formData.description) {
          throw new Error('All provider fields are required');
        }
        if (!formData.profilePicture || formData.photos.length === 0) {
          throw new Error('Profile picture and at least one photo are required for providers');
        }
        if (!categories.includes(formData.category)) {
          throw new Error('Invalid category selected');
        }
        if (Number(formData.price) <= 0) {
          throw new Error('Price must be a positive number');
        }
        data = new FormData();
        data.append('role', formData.role);
        data.append('fullName', formData.fullName);
        data.append('email', formData.email);
        data.append('password', formData.password);
        data.append('serviceName', formData.serviceName);
        data.append('contact', formData.contact);
        data.append('category', formData.category);
        data.append('location', formData.location);
        data.append('price', formData.price);
        data.append('description', formData.description);
        if (formData.profilePicture) {
          data.append('profilePicture', formData.profilePicture);
        }
        formData.photos.forEach((photo) => data.append('photos', photo));
      }

      const formDataEntries = formData.role === 'tourist'
        ? data
        : Object.fromEntries([...data.entries()].map(([key, value]) => [key, value instanceof File ? value.name : value]));
      console.log(`[${new Date().toISOString()}] Sending signup request to ${cleanApiUrl}${endpoint}:`, JSON.stringify(formDataEntries, null, 2));

      const res = await axios.post(`${cleanApiUrl}${endpoint}`, data, { headers });
      console.log(`[${new Date().toISOString()}] Signup response:`, JSON.stringify(res.data, null, 2));

      localStorage.setItem('token', res.data.token);
      navigate(formData.role === 'tourist' ? '/tourist-dashboard' : '/provider-dashboard');
    } catch (err) {
      console.error(`[${new Date().toISOString()}] Signup error:`, {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status
      });
      setError(err.response?.data?.error || err.message || 'Failed to sign up. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container container">
      <h2>Sign Up</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Role</label>
          <select name="role" value={formData.role} onChange={handleChange}>
            <option value="tourist">Tourist</option>
            <option value="provider">Provider</option>
          </select>
        </div>
        <div className="form-group">
          <label>Full Name</label>
          <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Email</label>
          <input type="email" name="email" value={formData.email} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Password (minimum 6 characters)</label>
          <input type="password" name="password" value={formData.password} onChange={handleChange} required />
        </div>
        {formData.role === 'tourist' && (
          <div className="form-group">
            <label>Country</label>
            <input type="text" name="country" value={formData.country} onChange={handleChange} required />
          </div>
        )}
        {formData.role === 'provider' && (
          <>
            <div className="form-group">
              <label>Service Name</label>
              <input type="text" name="serviceName" value={formData.serviceName} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Contact</label>
              <input type="text" name="contact" value={formData.contact} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Category</label>
              <select name="category" value={formData.category} onChange={handleChange} required>
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Location</label>
              <input type="text" name="location" value={formData.location} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Price</label>
              <input type="number" name="price" value={formData.price} onChange={handleChange} required min="1" />
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea name="description" value={formData.description} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Profile Picture</label>
              <input type="file" name="profilePicture" accept="image/jpeg,image/png" onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Photos (up to 5)</label>
              <input type="file" name="photos" accept="image/jpeg,image/png" multiple onChange={handleChange} required />
            </div>
          </>
        )}
        <div className="form-group">
          <button type="submit" disabled={loading}>{loading ? 'Signing Up...' : 'Sign Up'}</button>
        </div>
      </form>
      <p>
        Already have an account? <Link to="/login">Login</Link>
      </p>
    </div>
  );
}

export default Signup;