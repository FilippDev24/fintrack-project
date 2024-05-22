import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Modal from 'react-modal';

// Настройка модального окна
Modal.setAppElement('#root');

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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOperation, setSelectedOperation] = useState(null);

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
    setNewOperation({ ...newOperation, [name]: value });
  };

  const addOperation = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5001/api/transactions', newOperation);
      setTransactions([...transactions, response.data]);
      setNewOperation({
        date: '',
        amount: '',
        category: '',
        description: '',
        type: 'income',
        isForecast: false,
      });
    } catch (error) {
      console.error('Error adding operation:', error);
    }
  };

  const combinedOperations = [...transactions, ...forecasts];

  const openModal = (operation) => {
    setSelectedOperation(operation);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedOperation(null);
  };

  const handleModalInputChange = (e) => {
    const { name, value } = e.target;
    setSelectedOperation({ ...selectedOperation, [name]: value });
  };

  const saveChanges = async () => {
    try {
      if (selectedOperation.isForecast) {
        await axios.put(`http://localhost:5001/api/forecasts/${selectedOperation._id}`, selectedOperation);
        setForecasts(forecasts.map(f => f._id === selectedOperation._id ? selectedOperation : f));
      } else {
        await axios.put(`http://localhost:5001/api/transactions/${selectedOperation._id}`, selectedOperation);
        setTransactions(transactions.map(t => t._id === selectedOperation._id ? selectedOperation : t));
      }
      closeModal();
    } catch (error) {
      console.error('Error saving changes:', error);
    }
  };

  const deleteOperation = async () => {
    try {
      if (selectedOperation.isForecast) {
        await axios.delete(`http://localhost:5001/api/forecasts/${selectedOperation._id}`);
        setForecasts(forecasts.filter(f => f._id !== selectedOperation._id));
      } else {
        await axios.delete(`http://localhost:5001/api/transactions/${selectedOperation._id}`);
        setTransactions(transactions.filter(t => t._id !== selectedOperation._id));
      }
      closeModal();
    } catch (error) {
      console.error('Error deleting operation:', error);
    }
  };

  const acceptForecast = async () => {
    try {
      await axios.put(`http://localhost:5001/api/forecasts/${selectedOperation._id}/accept`);
      setForecasts(forecasts.filter(f => f._id !== selectedOperation._id));
      closeModal();
    } catch (error) {
      console.error('Error accepting forecast:', error);
    }
  };

  return (
    <div>
      <h1>Дэшборд</h1>
      <form onSubmit={addOperation}>
        <input type="date" name="date" value={newOperation.date} onChange={handleInputChange} required />
        <input type="number" name="amount" value={newOperation.amount} onChange={handleInputChange} required />
        <select name="category" value={newOperation.category} onChange={handleInputChange} required>
          {categories.map(category => (
            <option key={category._id} value={category._id}>{category.name}</option>
          ))}
        </select>
        <input type="text" name="description" value={newOperation.description} onChange={handleInputChange} />
        <select name="type" value={newOperation.type} onChange={handleInputChange} required>
          <option value="income">Доход</option>
          <option value="expense">Расход</option>
        </select>
        <button type="submit">Добавить операцию</button>
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
                  <div key={op._id} onClick={() => openModal(op)}>
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
                  <div key={op._id} onClick={() => openModal(op)}>
                    -{op.amount} {categories.find(category => category._id === op.category)?.name || 'Unknown'} {op.isForecast && '(Прогноз)'}
                  </div>
                ))}
              </td>
            ))}
          </tr>
          <tr>
            {Array.from({ length: getDaysInMonth(currentMonth, currentYear) }, (_, i) => (
              <td key={i}>
                {combinedOperations.filter(op => new Date(op.date).getDate() === i + 1 && op.type === 'income').map(op => (
                  <div key={op._id} onClick={() => openModal(op)}>
                    {op.amount} {categories.find(category => category._id === op.category)?.name || 'Unknown'} {op.isForecast && '(Прогноз)'}
                  </div>
                ))}
              </td>
            ))}
          </tr>
        </tbody>
      </table>
      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="Редактировать операцию"
      >
        {selectedOperation && (
          <div>
            <h2>Редактировать операцию</h2>
            <input type="date" name="date" value={selectedOperation.date} onChange={handleModalInputChange} required />
            <input type="number" name="amount" value={selectedOperation.amount} onChange={handleModalInputChange} required />
            <select name="category" value={selectedOperation.category} onChange={handleModalInputChange} required>
              {categories.map(category => (
                <option key={category._id} value={category._id}>{category.name}</option>
              ))}
            </select>
            <input type="text" name="description" value={selectedOperation.description} onChange={handleModalInputChange} />
            <select name="type" value={selectedOperation.type} onChange={handleModalInputChange} required>
              <option value="income">Доход</option>
              <option value="expense">Расход</option>
            </select>
            <button onClick={saveChanges}>Сохранить</button>
            <button onClick={deleteOperation}>Удалить</button>
            {selectedOperation.isForecast && (
              <button onClick={acceptForecast}>Принять</button>
            )}
            <button onClick={closeModal}>Закрыть</button>
          </div>
        )}
      </Modal>
    </div>
  );
}

export default Dashboard;
