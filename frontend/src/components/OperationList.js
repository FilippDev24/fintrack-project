import React from 'react';

const OperationList = ({ operations, categories, openModal }) => {
  return (
    <div>
      {operations.map(op => (
        <div key={op._id} onClick={() => openModal(op)}>
          {op.type === 'income' ? '+' : '-'}{op.amount} {categories.find(category => category._id === op.category)?.name || 'Unknown'} {op.isForecast && '(Прогноз)'}
        </div>
      ))}
    </div>
  );
};

export default OperationList;
