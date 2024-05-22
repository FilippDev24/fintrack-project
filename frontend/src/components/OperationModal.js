import React from 'react';
import Modal from 'react-modal';

const OperationModal = ({
  isModalOpen,
  selectedOperation,
  categories,
  handleModalInputChange,
  saveChanges,
  deleteOperation,
  acceptForecast,
  closeModal
}) => {
  return (
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
  );
};

export default OperationModal;
