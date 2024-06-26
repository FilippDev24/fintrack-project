import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'user' });

  useEffect(() => {
    const fetchUsers = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No token found, please log in');
        return;
      }

      try {
        const res = await axios.get('http://localhost:5001/api/users', {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        setUsers(res.data);
      } catch (err) {
        console.error(err.response.data);
      }
    };
    fetchUsers();
  }, []);

  const { name, email, password, role } = formData;

  const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async e => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No token found, please log in');
      return;
    }

    try {
      await axios.post('http://localhost:5001/api/users', formData, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      setFormData({ name: '', email: '', password: '', role: 'user' });
      // Обновление списка пользователей после создания нового
      const res = await axios.get('http://localhost:5001/api/users', {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      setUsers(res.data);
    } catch (err) {
      console.error(err.response.data);
    }
  };

  return (
    <div>
      <h1>Users</h1>
      <form onSubmit={onSubmit}>
        <div>
          <label>Name</label>
          <input type="text" name="name" value={name} onChange={onChange} required />
        </div>
        <div>
          <label>Email</label>
          <input type="email" name="email" value={email} onChange={onChange} required />
        </div>
        <div>
          <label>Password</label>
          <input type="password" name="password" value={password} onChange={onChange} required />
        </div>
        <div>
          <label>Role</label>
          <select name="role" value={role} onChange={onChange}>
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        <button type="submit">Create User</button>
      </form>
      <ul>
        {users.map(u => (
          <li key={u._id}>{u.name} ({u.email}) - {u.role}</li>
        ))}
      </ul>
    </div>
  );
};

export default Users;
