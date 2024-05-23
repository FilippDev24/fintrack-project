import { useState, useEffect, useCallback } from 'react';
import { apiFetchCategories } from '../api/api';

const useOperationsBase = (fetchOperationsApi, addOperationApi, updateOperationApi, deleteOperationApi) => {
  const [operations, setOperations] = useState([]);
  const [editingOperation, setEditingOperation] = useState(null);
  const [notification, setNotification] = useState(null);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [categories, setCategories] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOperation, setSelectedOperation] = useState(null);

  const fetchOperations = useCallback(async () => {
    try {
      const response = await fetchOperationsApi();
      setOperations(response.data);
    } catch (error) {
      setNotification({ message: 'Error fetching operations', type: 'error' });
      console.error('Error fetching operations:', error);
    }
  }, [fetchOperationsApi]);

  useEffect(() => {
    fetchOperations();
    fetchCategories();
  }, [fetchOperations, currentMonth, currentYear]);

  const fetchCategories = async () => {
    try {
      const response = await apiFetchCategories();
      setCategories(response.data);
    } catch (error) {
      setNotification({ message: 'Error fetching categories', type: 'error' });
      console.error('Error fetching categories:', error);
    }
  };

  const handleOperationAdded = async (operation, isEditing) => {
    try {
      if (isEditing) {
        const response = await updateOperationApi(operation._id, operation);
        setOperations(operations.map(op => op._id === operation._id ? response.data : op));
      } else {
        const response = await addOperationApi(operation);
        setOperations([...operations, response.data]);
      }
      setNotification({ message: 'Operation saved successfully', type: 'success' });
    } catch (error) {
      setNotification({ message: 'Error saving operation', type: 'error' });
      console.error('Error saving operation:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteOperationApi(id);
      setOperations(operations.filter(operation => operation._id !== id));
      setNotification({ message: 'Operation deleted successfully', type: 'success' });
    } catch (error) {
      setNotification({ message: 'Error deleting operation', type: 'error' });
      console.error('Error deleting operation:', error);
    }
  };

  const handleMonthChange = (month) => {
    setCurrentMonth(month);
  };

  const handleYearChange = (year) => {
    setCurrentYear(year);
  };

  const openModal = (operation) => {
    setSelectedOperation(operation);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedOperation(null);
    setIsModalOpen(false);
  };

  const handleModalInputChange = (e) => {
    const { name, value } = e.target;
    setSelectedOperation(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const saveChanges = async () => {
    try {
      if (selectedOperation.isForecast) {
        await updateOperationApi(selectedOperation._id, selectedOperation);
      } else {
        await updateOperationApi(selectedOperation._id, selectedOperation);
      }
      fetchOperations();
      closeModal();
      setNotification({ message: 'Changes saved successfully', type: 'success' });
    } catch (error) {
      setNotification({ message: 'Error saving changes', type: 'error' });
      console.error('Error saving changes:', error);
    }
  };

  const closeNotification = () => {
    setNotification(null);
  };

  return {
    operations,
    editingOperation,
    setEditingOperation,
    handleOperationAdded,
    handleDelete,
    notification,
    closeNotification,
    currentMonth,
    currentYear,
    categories,
    handleMonthChange,
    handleYearChange,
    isModalOpen,
    openModal,
    closeModal,
    selectedOperation,
    handleModalInputChange,
    saveChanges
  };
};

export default useOperationsBase;
