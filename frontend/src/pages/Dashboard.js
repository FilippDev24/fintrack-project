import React, { useEffect, useState } from 'react';
import axios from 'axios';

const months = [
  'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
  'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
];

const getDaysInMonth = (month, year) => {
  return new Date(year, month + 1, 0).getDate();
};

const Dashboard = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [transactions, setTransactions] = useState([]);
  const [forecasts, setForecasts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [newOperation, setNewOperation] = useState({
    date: '',
    amount: '',
    category: '',
    description: '',
    type: 'income',
    isForecast: false,
  });

  useEffect(() => {
    fetchOperations();
    fetchCategories();
  }, [currentMonth]);

  const fetchOperations = async () => {
    try {
      const transactionsResponse = await axios.get('http://localhost:5001/api/transactions');
      const forecastsResponse = await axios.get('http://localhost:5001/api/forecasts');
      setTransactions(transactionsResponse.data);
      setForecasts(forecastsResponse.data);
    } catch (error) {
      console.error('Error fetching operations:', error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get('http://localhost:5001/api/categories');
      setCategories(response.data);

      const defaultCategory = response.data.find(category => category.isSystem && category.defaultFor === 'transaction');
      if (defaultCategory) {
        setNewOperation(prevOperation => ({
          ...prevOperation,
          category: defaultCategory._id,
        }));
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewOperation({
      ...newOperation,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const operationDate = new Date(newOperation.date);
    const currentDate = new Date();
    if (operationDate > currentDate && !newOperation.isForecast) {
      alert('Date cannot be in the future for a transaction.');
      return;
    }

    try {
      const endpoint = newOperation.isForecast ? 'http://localhost:5001/api/forecasts' : 'http://localhost:5001/api/transactions';
      const response = await axios.post(endpoint, newOperation);

      if (newOperation.isForecast) {
        setForecasts([...forecasts, response.data]);
      } else {
        setTransactions([...transactions, response.data]);
      }

      setNewOperation({
        date: '',
        amount: '',
        category: categories.find(category => category.isSystem && category.defaultFor === 'transaction')?._id || '',
        description: '',
        type: 'income',
        isForecast: false,
      });
    } catch (error) {
      console.error('Error saving operation:', error);
    }
  };

  const handleTabClick = (index) => {
    setCurrentMonth(index);
  };

  const getMonthClassName = (index) => {
    return `month-tab ${index === currentMonth ? 'active-month' : ''}`;
  };

  const filterOperationsByMonth = (operations) => {
    return operations.filter(op => {
      const date = new Date(op.date);
      return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
    });
  };

  const calculateBalance = (combinedOperations) => {
    let balance = 0;
    let dailyBalances = Array.from({ length: getDaysInMonth(currentMonth, currentYear) }, () => 0);
    combinedOperations.forEach(op => {
      const date = new Date(op.date).getDate();
      if (!op.isForecast || (op.isForecast && op.status === 'accepted')) {
        const amount = op.type === 'expense' ? -op.amount : op.amount;
        dailyBalances[date - 1] += amount;
      }
    });
    for (let i = 0; i < dailyBalances.length; i++) {
      balance += dailyBalances[i];
      dailyBalances[i] = balance;
    }
    return dailyBalances;
  };

  const combinedOperations = filterOperationsByMonth([...transactions, ...forecasts]);
  const dailyBalances = calculateBalance(combinedOperations);

  return (
    <div>
      <h1>Dashboard</h1>
      <div>
        {months.map((month, index) => (
          <button
            key={index}
            onClick={() => handleTabClick(index)}
            className={getMonthClassName(index)}
          >
            {month}
          </button>
        ))}
      </div>
      <form onSubmit={handleSubmit}>
        <input
          type="date"
          name="date"
          value={newOperation.date}
          onChange={handleInputChange}
          placeholder="Date"
          required
        />
        <input
          type="number"
          name="amount"
          value={newOperation.amount}
          onChange={handleInputChange}
          placeholder="Amount"
          required
        />
        <select
          name="category"
          value={newOperation.category}
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
          value={newOperation.description}
          onChange={handleInputChange}
          placeholder="Description"
        />
        <select
          name="type"
          value={newOperation.type}
          onChange={handleInputChange}
          placeholder="Type"
        >
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>
        <label>
          <input
            type="checkbox"
            name="isForecast"
            checked={newOperation.isForecast}
            onChange={(e) => handleInputChange({ target: { name: 'isForecast', value: e.target.checked } })}
          />
          Is Forecast
        </label>
        <button type="submit">Add Operation</button>
      </form>
      <h2>Операции</h2>
      <table>
        <thead>
          <tr>
            {Array.from({ length: getDaysInMonth(currentMonth, currentYear) }, (_, i) => (
              <th key={i}>{i + 1}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            {Array.from({ length: getDaysInMonth(currentMonth, currentYear) }, (_, i) => (
              <td key={i}>
                {combinedOperations.filter(op => new Date(op.date).getDate() === i + 1).reduce((sum, op) => sum + op.amount, 0)}
              </td>
            ))}
          </tr>
          <tr>
            {Array.from({ length: getDaysInMonth(currentMonth, currentYear) }, (_, i) => (
              <td key={i}>
                {combinedOperations.filter(op => new Date(op.date).getDate() === i + 1 && op.type === 'income').map(op => (
                  <div key={op._id}>
                    {op.amount} {categories.find(category => category._id === op.category)?.name || 'Unknown'} {op.isForecast && '(Прогноз)'}
                  </div>
                ))}
              </td>
            ))}
          </tr>
          <tr>
            {Array.from({ length: getDaysInMonth(currentMonth, currentYear) }, (_, i) => (
              <td key={i}>
                {combinedOperations.filter(op => new Date(op.date).getDate() === i + 1 && op.type === 'expense').map(op => (
                  <div key={op._id}>
                    -{op.amount} {categories.find(category => category._id === op.category)?.name || 'Unknown'} {op.isForecast && '(Прогноз)'}
                  </div>
                ))}
              </td>
            ))}
          </tr>
          <tr>
            {Array.from({ length: getDaysInMonth(currentMonth, currentYear) }, (_, i) => (
              <td key={i}>
                {dailyBalances[i]}
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default Dashboard;
