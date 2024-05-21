// TransactionForm.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TransactionForm = ({ onTransactionAdded, editingTransaction, setEditingTransaction }) => {
  const [categories, setCategories] = useState([]);
  const [transaction, setTransaction] = useState({
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

        const defaultCategory = response.data.find(category => category.isSystem && category.defaultFor === 'transaction');
        if (defaultCategory) {
          setTransaction(prevTransaction => ({
            ...prevTransaction,
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
    if (editingTransaction) {
      const formattedDate = new Date(editingTransaction.date).toISOString().split('T')[0];
      setTransaction({
        ...editingTransaction,
        date: formattedDate,
      });
    }
  }, [editingTransaction]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTransaction({
      ...transaction,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = editingTransaction
        ? await axios.put(`http://localhost:5001/api/transactions/${editingTransaction._id}`, transaction)
        : await axios.post('http://localhost:5001/api/transactions', transaction);

      onTransactionAdded(response.data, editingTransaction);
      setTransaction({
        date: '',
        amount: '',
        category: categories.find(category => category.isSystem && category.defaultFor === 'transaction')?._id || '',
        description: '',
        type: 'expense',
      });
      setEditingTransaction(null);
    } catch (error) {
      console.error('Error saving transaction:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="date"
        name="date"
        value={transaction.date}
        onChange={handleInputChange}
        placeholder="Date"
        required
      />
      <input
        type="number"
        name="amount"
        value={transaction.amount}
        onChange={handleInputChange}
        placeholder="Amount"
        required
      />
      <select
        name="category"
        value={transaction.category}
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
        value={transaction.description}
        onChange={handleInputChange}
        placeholder="Description"
      />
      <select
        name="type"
        value={transaction.type}
        onChange={handleInputChange}
        placeholder="Type"
      >
        <option value="income">Income</option>
        <option value="expense">Expense</option>
      </select>
      <button type="submit">{editingTransaction ? 'Update Transaction' : 'Add Transaction'}</button>
    </form>
  );
};

export default TransactionForm;
