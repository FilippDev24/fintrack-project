import { useState, useEffect } from 'react';
import {
  apiFetchTransactions,
  apiFetchForecasts,
  apiFetchCategories,
  apiUpdateForecast,
  apiUpdateTransaction,
  apiDeleteForecast,
  apiDeleteTransaction,
  apiAcceptForecast,
  apiAddForecast,
  apiAddTransaction
} from '../api/api';

const useOperations = () => {
  const [state, setState] = useState({
    currentMonth: new Date().getMonth(),
    currentYear: new Date().getFullYear(),
    transactions: [],
    forecasts: [],
    categories: [],
    isModalOpen: false,
    selectedOperation: null,
    notification: null,
  });

  useEffect(() => {
    fetchOperations();
    fetchCategoriesData();
  }, [state.currentMonth, state.currentYear]);

  const fetchOperations = async () => {
    try {
      const transactionsResponse = await apiFetchTransactions();
      const forecastsResponse = await apiFetchForecasts();
      setState(prevState => ({
        ...prevState,
        transactions: transactionsResponse.data.map(t => ({ ...t, isForecast: false })),
        forecasts: forecastsResponse.data.filter(f => f.status !== 'deleted').map(f => ({ ...f, isForecast: true }))
      }));
    } catch (error) {
      setState(prevState => ({
        ...prevState,
        notification: { message: 'Error fetching operations', type: 'error' }
      }));
      console.error('Error fetching operations:', error);
    }
  };

  const fetchCategoriesData = async () => {
    try {
      const response = await apiFetchCategories();
      setState(prevState => ({ ...prevState, categories: response.data }));
    } catch (error) {
      setState(prevState => ({
        ...prevState,
        notification: { message: 'Error fetching categories', type: 'error' }
      }));
      console.error('Error fetching categories:', error);
    }
  };

  const openModal = (operation) => {
    setState(prevState => ({ ...prevState, selectedOperation: operation, isModalOpen: true }));
  };

  const closeModal = () => {
    setState(prevState => ({ ...prevState, selectedOperation: null, isModalOpen: false }));
  };

  const handleModalInputChange = (e) => {
    const { name, value } = e.target;
    setState(prevState => ({
      ...prevState,
      selectedOperation: { ...prevState.selectedOperation, [name]: value }
    }));
  };

  const saveChanges = async () => {
    try {
      if (state.selectedOperation.isForecast) {
        await apiUpdateForecast(state.selectedOperation._id, state.selectedOperation);
      } else {
        await apiUpdateTransaction(state.selectedOperation._id, state.selectedOperation);
      }
      fetchOperations();
      closeModal();
      setState(prevState => ({
        ...prevState,
        notification: { message: 'Changes saved successfully', type: 'success' }
      }));
    } catch (error) {
      setState(prevState => ({
        ...prevState,
        notification: { message: 'Error saving changes', type: 'error' }
      }));
      console.error('Error saving changes:', error);
    }
  };

  const deleteOperation = async () => {
    try {
      if (state.selectedOperation.isForecast) {
        await apiDeleteForecast(state.selectedOperation._id);
      } else {
        await apiDeleteTransaction(state.selectedOperation._id);
      }
      fetchOperations();
      closeModal();
      setState(prevState => ({
        ...prevState,
        notification: { message: 'Operation deleted successfully', type: 'success' }
      }));
    } catch (error) {
      setState(prevState => ({
        ...prevState,
        notification: { message: 'Error deleting operation', type: 'error' }
      }));
      console.error('Error deleting operation:', error);
    }
  };

  const acceptForecast = async () => {
    try {
      await apiAcceptForecast(state.selectedOperation._id);
      fetchOperations();
      closeModal();
      setState(prevState => ({
        ...prevState,
        notification: { message: 'Forecast accepted successfully', type: 'success' }
      }));
    } catch (error) {
      setState(prevState => ({
        ...prevState,
        notification: { message: 'Error accepting forecast', type: 'error' }
      }));
      console.error('Error accepting forecast:', error);
    }
  };

  const addOperation = async (operation) => {
    try {
      if (operation.isForecast) {
        await apiAddForecast(operation);
      } else {
        await apiAddTransaction(operation);
      }
      fetchOperations();
      setState(prevState => ({
        ...prevState,
        notification: { message: 'Operation added successfully', type: 'success' }
      }));
    } catch (error) {
      setState(prevState => ({
        ...prevState,
        notification: { message: 'Error adding operation', type: 'error' }
      }));
      console.error('Error adding operation:', error);
    }
  };

  const handleMonthChange = (month) => {
    setState(prevState => ({ ...prevState, currentMonth: month }));
  };

  const closeNotification = () => {
    setState(prevState => ({ ...prevState, notification: null }));
  };

  return {
    state,
    openModal,
    closeModal,
    handleModalInputChange,
    saveChanges,
    deleteOperation,
    acceptForecast,
    addOperation,
    handleMonthChange,
    closeNotification
  };
};

export default useOperations;
