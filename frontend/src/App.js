import React, { useContext, useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transactions';
import Forecasts from './pages/Forecasts';
import Categories from './pages/Categories';
import Users from './pages/Users';
import Reports from './pages/Reports';
import Login from './pages/Login';
import Navbar from './components/Navbar';
import PrivateRoute from './components/PrivateRoute';
import { AuthContext } from './context/authContext';

const App = () => {
  const { checkAuth, isAuthenticated, loading } = useContext(AuthContext);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    console.log('App isAuthenticated:', isAuthenticated);
  }, [isAuthenticated]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Navbar />
      <Routes>
        <Route element={<PrivateRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/transactions" element={<Transactions />} />
          <Route path="/forecasts" element={<Forecasts />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/" element={<Dashboard />} />
        </Route>
        <Route element={<PrivateRoute role="admin" />}>
          <Route path="/users" element={<Users />} />
        </Route>
        <Route path="/login" element={<Login />} />
      </Routes>
    </>
  );
};

export default App;
