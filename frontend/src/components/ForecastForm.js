import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ForecastForm = ({ onForecastAdded, editingForecast, setEditingForecast, categories }) => {
  const [formData, setFormData] = useState({
    date: '',
    amount: '',
    category: '',
    description: '',
    type: 'income',
    status: 'pending',
  });

  const [availableCategories, setAvailableCategories] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No token found, please log in');
        return;
      }

      try {
        const response = await axios.get('http://localhost:5001/api/categories', {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        setAvailableCategories(response.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
        setError('Error fetching categories');
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    if (editingForecast) {
      setFormData({
        date: editingForecast.date.split('T')[0],
        amount: editingForecast.amount,
        category: editingForecast.category,
        description: editingForecast.description,
        type: editingForecast.type,
        status: editingForecast.status,
      });
    }
  }, [editingForecast]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No token found, please log in');
      return;
    }

    try {
      if (editingForecast) {
        await axios.put(`http://localhost:5001/api/forecasts/${editingForecast._id}`, formData, {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        setEditingForecast(null);
      } else {
        await axios.post('http://localhost:5001/api/forecasts', formData, {
          headers: { 'Authorization': `Bearer ${token}` },
        });
      }
      onForecastAdded();
      setFormData({
        date: '',
        amount: '',
        category: '',
        description: '',
        type: 'income',
        status: 'pending',
      });
    } catch (error) {
      console.error('Error saving forecast:', error);
      setError('Error saving forecast');
    }
  };

  return (
    <div>
      <h2>{editingForecast ? 'Edit Forecast' : 'Add Forecast'}</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleInputChange}
          required
        />
        <input
          type="number"
          name="amount"
          value={formData.amount}
          onChange={handleInputChange}
          required
        />
        <select
          name="category"
          value={formData.category}
          onChange={handleInputChange}
          required
        >
          <option value="" disabled>Select Category</option>
          {availableCategories.map((category) => (
            <option key={category._id} value={category._id}>
              {category.name}
            </option>
          ))}
        </select>
        <input
          type="text"
          name="description"
          value={formData.description}
          onChange={handleInputChange}
        />
        <select
          name="type"
          value={formData.type}
          onChange={handleInputChange}
          required
        >
          <option value="expense">Expense</option>
          <option value="income">Income</option>
        </select>
        <button type="submit">{editingForecast ? 'Update Forecast' : 'Add Forecast'}</button>
        {error && <div>{error}</div>}
      </form>
    </div>
  );
};

export default ForecastForm;
