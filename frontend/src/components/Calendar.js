import React from 'react';

const Calendar = ({ currentMonth, currentYear, daysInMonth, transactions, forecasts, categories, openModal }) => {
  const getOperationsForDay = (day) => {
    const operations = [
      ...transactions.filter(op => {
        const opDate = new Date(op.date);
        return opDate.getMonth() === currentMonth && opDate.getFullYear() === currentYear && opDate.getDate() === day;
      }),
      ...forecasts.filter(op => {
        const opDate = new Date(op.date);
        return opDate.getMonth() === currentMonth && opDate.getFullYear() === currentYear && opDate.getDate() === day && op.status === 'pending';
      })
    ];
    return operations;
  };

  return (
    <table>
      <thead>
        <tr>
          {Array.from({ length: daysInMonth }, (_, i) => (
            <th key={i}>{i + 1}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        <tr>
          {Array.from({ length: daysInMonth }, (_, i) => (
            <td key={i}>
              {getOperationsForDay(i + 1).map(op => (
                <div key={op._id} onClick={() => openModal(op)}>
                  {op.type === 'income' ? '+' : '-'}{op.amount} {categories.find(category => category._id === op.category)?.name || 'Unknown'} {op.isForecast && '(Прогноз)'}
                </div>
              ))}
            </td>
          ))}
        </tr>
      </tbody>
    </table>
  );
};

export default Calendar;
