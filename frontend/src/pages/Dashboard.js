import React from 'react';
import Modal from 'react-modal';
import Calendar from '../components/Calendar';
import NewOperationForm from '../components/NewOperationForm';
import MonthSwitcher from '../components/MonthSwitcher';
import OperationModal from '../components/OperationModal';
import Notification from '../components/Notification';
import useOperations from '../hooks/useOperations';

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
  } = useOperations();

  const daysInMonth = getDaysInMonth(state.currentMonth, state.currentYear);

  return (
    <div>
      <h1>Dashboard</h1>
      <MonthSwitcher
        currentMonth={state.currentMonth}
        currentYear={state.currentYear}
        months={months}
        handleMonthChange={handleMonthChange}
      />
      <NewOperationForm categories={state.categories} addOperation={addOperation} />
      <Calendar
        currentMonth={state.currentMonth}
        currentYear={state.currentYear}
        daysInMonth={daysInMonth}
        transactions={state.transactions}
        forecasts={state.forecasts}
        categories={state.categories}
        openModal={openModal}
      />
      <OperationModal
        isModalOpen={state.isModalOpen}
        selectedOperation={state.selectedOperation}
        categories={state.categories}
        handleModalInputChange={handleModalInputChange}
        saveChanges={saveChanges}
        deleteOperation={deleteOperation}
        acceptForecast={acceptForecast}
        closeModal={closeModal}
      />
      <Notification
        message={state.notification?.message}
        type={state.notification?.type}
        onClose={closeNotification}
      />
    </div>
  );
};

export default Dashboard;
