import React from 'react';
import Modal from 'react-modal';
import Calendar from '../components/Calendar';
import NewOperationForm from '../components/NewOperationForm';
import MonthSwitcher from '../components/MonthSwitcher';
import OperationModal from '../components/OperationModal';
import Notification from '../components/Notification';
import useDashboardOperations from '../hooks/useDashboardOperations';

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
  
  const {
    transactions,
    forecasts,
    handleAcceptForecast
  } = useDashboardOperations();

  const daysInMonth = getDaysInMonth(transactions.currentMonth, transactions.currentYear);

  return (
    <div>
      <h1>Dashboard</h1>
      <MonthSwitcher
        currentMonth={transactions.currentMonth}
        currentYear={transactions.currentYear}
        months={months}
        handleMonthChange={transactions.handleMonthChange}
        handleYearChange={transactions.handleYearChange}
      />
      <NewOperationForm categories={transactions.categories} addOperation={transactions.handleOperationAdded} />
      <Calendar
        currentMonth={transactions.currentMonth}
        currentYear={transactions.currentYear}
        daysInMonth={daysInMonth}
        transactions={transactions.operations}
        forecasts={forecasts.operations}
        categories={transactions.categories}
        openModal={transactions.openModal}
      />
      <OperationModal
        isModalOpen={transactions.isModalOpen}
        selectedOperation={transactions.selectedOperation}
        categories={transactions.categories}
        handleModalInputChange={transactions.handleModalInputChange}
        saveChanges={transactions.saveChanges}
        deleteOperation={transactions.handleDelete}
        acceptForecast={handleAcceptForecast}
        closeModal={transactions.closeModal}
      />
      <Notification
        message={transactions.notification?.message || forecasts.notification?.message}
        type={transactions.notification?.type || forecasts.notification?.type}
        onClose={transactions.closeNotification || forecasts.closeNotification}
      />
    </div>
  );
};

export default Dashboard;
