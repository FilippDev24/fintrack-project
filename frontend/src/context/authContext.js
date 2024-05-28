import React, { createContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const checkAuth = useCallback(() => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    if (token && storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      setIsAuthenticated(true);
      setUserRole(parsedUser.role);
    } else {
      setIsAuthenticated(false);
      setUser(null);
      setUserRole(null);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const login = async (email, password) => {
    try {
      const res = await axios.post('http://localhost:5001/api/users/auth/login', { email, password });
      const { user, token } = res.data;
      setUser(user);
      setIsAuthenticated(true);
      setUserRole(user.role);
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      console.log('Logged in user:', user);  // Временный вывод данных пользователя
      navigate('/dashboard');  // Перенаправление на страницу dashboard после успешного логина
    } catch (error) {
      console.error('Login failed', error);
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    setUserRole(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');  // Перенаправление на страницу login после выхода
  };

  return (
    <AuthContext.Provider value={{ user, setUser, login, logout, isAuthenticated, checkAuth, userRole, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthProvider, AuthContext };
