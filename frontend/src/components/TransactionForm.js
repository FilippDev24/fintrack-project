import React, { useEffect, useState } from 'react';
import axios from 'axios';

const TransactionForm = ({ onTransactionAdded, editingTransaction, setEditingTransaction, categories }) => {
  const [formData, setFormData] = useState({
    date: '',
    amount: '',
    category: '',
    description: '',
    type: 'expense',
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
    if (editingTransaction) {
      setFormData({
        date: editingTransaction.date.split('T')[0],
        amount: editingTransaction.amount,
        category: editingTransaction.category,
        description: editingTransaction.description,
        type: editingTransaction.type,
      });
    }
  }, [editingTransaction]);

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
      if (editingTransaction) {
        await axios.put(`http://localhost:5001/api/transactions/${editingTransaction._id}`, formData, {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        setEditingTransaction(null);
      } else {
        await axios.post('http://localhost:5001/api/transactions', formData, {
          headers: { 'Authorization': `Bearer ${token}` },
        });
      }
      onTransactionAdded();
      setFormData({
        date: '',
        amount: '',
        category: '',
        description: '',
        type: 'expense',
      });
    } catch (error) {
      console.error('Error saving transaction:', error);
      setError('Error saving transaction');
    }
  };

  return (
    <div>
      <h2>{editingTransaction ? 'Edit Transaction' : 'Add Transaction'}</h2>
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
        <button type="submit">{editingTransaction ? 'Update Transaction' : 'Add Transaction'}</button>
        {error && <div>{error}</div>}
      </form>
    </div>
  );
};

export default TransactionForm;
