// ForecastForm.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ForecastForm = ({ onForecastAdded, editingForecast, setEditingForecast }) => {
  const [categories, setCategories] = useState([]);
  const [forecast, setForecast] = useState({
    date: '',
    amount: '',
    category: '',
    description: '',
    type: 'expense',
  });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('http://localhost:5001/api/categories');
        setCategories(response.data);

        const defaultCategory = response.data.find(category => category.isSystem && category.defaultFor === 'forecast');
        if (defaultCategory) {
          setForecast(prevForecast => ({
            ...prevForecast,
            category: defaultCategory._id,
          }));
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    if (editingForecast) {
      const formattedDate = new Date(editingForecast.date).toISOString().split('T')[0];
      setForecast({
        ...editingForecast,
        date: formattedDate,
      });
    }
  }, [editingForecast]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForecast({
      ...forecast,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = editingForecast
        ? await axios.put(`http://localhost:5001/api/forecasts/${editingForecast._id}`, forecast)
        : await axios.post('http://localhost:5001/api/forecasts', forecast);

      onForecastAdded(response.data, editingForecast);
      setForecast({
        date: '',
        amount: '',
        category: categories.find(category => category.isSystem && category.defaultFor === 'forecast')?._id || '',
        description: '',
        type: 'expense',
      });
      setEditingForecast(null);
    } catch (error) {
      console.error('Error saving forecast:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="date"
        name="date"
        value={forecast.date}
        onChange={handleInputChange}
        placeholder="Date"
        required
      />
      <input
        type="number"
        name="amount"
        value={forecast.amount}
        onChange={handleInputChange}
        placeholder="Amount"
        required
      />
      <select
        name="category"
        value={forecast.category}
        onChange={handleInputChange}
        placeholder="Category"
        required
      >
        <option value="">Select Category</option>
        {categories.map((category) => (
          <option key={category._id} value={category._id}>
            {category.name}
          </option>
        ))}
      </select>
      <input
        type="text"
        name="description"
        value={forecast.description}
        onChange={handleInputChange}
        placeholder="Description"
      />
      <select
        name="type"
        value={forecast.type}
        onChange={handleInputChange}
        placeholder="Type"
      >
        <option value="income">Income</option>
        <option value="expense">Expense</option>
      </select>
      <button type="submit">{editingForecast ? 'Update Forecast' : 'Add Forecast'}</button>
    </form>
  );
};

export default ForecastForm;
