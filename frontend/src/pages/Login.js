import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/authContext';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState(null);
  const { login } = useContext(AuthContext);

  const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async e => {
    e.preventDefault();
    try {
      await login(formData.email, formData.password);
    } catch (err) {
      setError('Login failed. Please check your credentials.');
      console.error('Login failed', err);
    }
  };

  return (
    <form onSubmit={onSubmit}>
      <div>
        <label>Email</label>
        <input type="email" name="email" value={formData.email} onChange={onChange} required />
      </div>
      <div>
        <label>Password</label>
        <input type="password" name="password" value={formData.password} onChange={onChange} required />
      </div>
      {error && <div>{error}</div>}
      <button type="submit">Login</button>
    </form>
  );
};

export default Login;
