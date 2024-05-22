import React from 'react';

const MonthSwitcher = React.memo(({ currentMonth, currentYear, months, handleMonthChange }) => {
  return (
    <div>
      {months.map((month, index) => (
        <button
          key={index}
          onClick={() => handleMonthChange(index)}
          style={{
            backgroundColor: index === currentMonth ? 'lightblue' : 'white',
            border: '1px solid #ccc',
            padding: '5px 10px',
            cursor: 'pointer'
          }}
        >
          {month}
        </button>
      ))}
    </div>
  );
});

export default MonthSwitcher;
