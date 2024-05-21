// Forecasts.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ForecastForm from '../components/ForecastForm';

const Forecasts = () => {
  const [forecasts, setForecasts] = useState([]);
  const [editingForecast, setEditingForecast] = useState(null);

  useEffect(() => {
    const fetchForecasts = async () => {
      try {
        const response = await axios.get('http://localhost:5001/api/forecasts');
        setForecasts(response.data);
      } catch (error) {
        console.error('Error fetching forecasts:', error);
      }
    };

    fetchForecasts();
  }, []);

  const handleForecastAdded = (newForecast, isEditing) => {
    if (isEditing) {
      setForecasts(forecasts.map(f => f._id === newForecast._id ? newForecast : f));
    } else {
      setForecasts([...forecasts, newForecast]);
    }
  };

  const handleEdit = (forecast) => {
    setEditingForecast(forecast);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5001/api/forecasts/${id}`);
      setForecasts(forecasts.filter(forecast => forecast._id !== id));
    } catch (error) {
      console.error('Error deleting forecast:', error);
    }
  };

  const handleAccept = async (id) => {
    try {
      await axios.post(`http://localhost:5001/api/forecasts/${id}/accept`);
      setForecasts(forecasts.map(forecast => forecast._id === id ? { ...forecast, status: 'accepted' } : forecast));
    } catch (error) {
      console.error('Error accepting forecast:', error);
    }
  };

  return (
    <div>
      <h1>Forecasts</h1>
      <ForecastForm onForecastAdded={handleForecastAdded} editingForecast={editingForecast} setEditingForecast={setEditingForecast} />
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
          {forecasts.map((forecast) => (
            <tr key={forecast._id}>
              <td>{new Date(forecast.date).toLocaleDateString()}</td>
              <td>{forecast.amount}</td>
              <td>{forecast.category}</td>
              <td>{forecast.description}</td>
              <td>{forecast.type}</td>
              <td>{forecast.status}</td>
              <td>
                <button onClick={() => handleEdit(forecast)}>Edit</button>
                <button onClick={() => handleDelete(forecast._id)}>Delete</button>
                {forecast.status === 'pending' && (
                  <button onClick={() => handleAccept(forecast._id)}>Accept</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Forecasts;
