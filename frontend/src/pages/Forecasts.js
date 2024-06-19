import React, { useCallback, useMemo } from 'react';
import ForecastForm from '../components/ForecastForm';
import Notification from '../components/Notification';
import useForecasts from '../hooks/useForecasts';
import axios from 'axios';

const Forecasts = () => {
  const {
    operations: forecasts,
    editingOperation: editingForecast,
    setEditingOperation: setEditingForecast,
    handleOperationAdded: handleForecastAdded,
    handleDelete,
    handleAccept,
    notification,
    closeNotification,
    categories
  } = useForecasts();

  const getCategoryName = useCallback((categoryId) => {
    const category = categories.find(category => category._id === categoryId);
    return category ? category.name : 'Unknown';
  }, [categories]);

  const memoizedForecasts = useMemo(() => (
    forecasts.map((forecast) => (
      <tr key={forecast._id}>
        <td>{new Date(forecast.date).toLocaleDateString()}</td>
        <td>{forecast.amount}</td>
        <td>{getCategoryName(forecast.category)}</td>
        <td>{forecast.description}</td>
        <td>{forecast.type}</td>
        <td>{forecast.status}</td>
        <td>
          <button onClick={() => setEditingForecast(forecast)}>Edit</button>
          <button onClick={() => handleDelete(forecast._id)}>Delete</button>
          {forecast.status === 'pending' && (
            <button onClick={() => handleAccept(forecast._id)}>Accept</button>
          )}
        </td>
      </tr>
    ))
  ), [forecasts, getCategoryName, handleDelete, handleAccept, setEditingForecast]);

  return (
    <div>
      <h1>Forecasts</h1>
      <ForecastForm
        onForecastAdded={handleForecastAdded}
        editingForecast={editingForecast}
        setEditingForecast={setEditingForecast}
        categories={categories}
      />
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Amount</th>
            <th>Category</th>
            <th>Description</th>
            <th>Type</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {memoizedForecasts}
        </tbody>
      </table>
      <Notification
        message={notification?.message}
        type={notification?.type}
        onClose={closeNotification}
      />
    </div>
  );
};

export default Forecasts;
