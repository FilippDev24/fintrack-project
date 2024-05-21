// Balance.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Balance = () => {
  const [balance, setBalance] = useState(0);

  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const token = localStorage.getItem('token');
        const config = {
          headers: {
            'x-auth-token': token,
          },
        };
        const res = await axios.get('http://localhost:5001/api/balance', config);
        setBalance(res.data[0]?.amount || 0);
      } catch (err) {
        console.error(err);
      }
    };

    fetchBalance();
  }, []);

  return (
    <div className="balance">
      <h2>Current Balance</h2>
      <p>{balance} USD</p>
    </div>
  );
};

export default Balance;
