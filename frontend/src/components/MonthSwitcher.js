import React from 'react';

const MonthSwitcher = ({ currentMonth, currentYear, months, handleMonthChange, handleYearChange }) => {
  return (
    <div>
      <select value={currentYear} onChange={(e) => handleYearChange(parseInt(e.target.value, 10))}>
        {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - 2 + i).map(year => (
          <option key={year} value={year}>{year}</option>
        ))}
      </select>
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
};

export default MonthSwitcher;
