import React, { useCallback, useMemo } from 'react';
import TransactionForm from '../components/TransactionForm';
import Notification from '../components/Notification';
import useTransactions from '../hooks/useTransactions';

const Transactions = () => {
  const {
    operations: transactions,
    editingOperation: editingTransaction,
    setEditingOperation: setEditingTransaction,
    handleOperationAdded: handleTransactionAdded,
    handleDelete,
    notification,
    closeNotification,
    categories
  } = useTransactions();

  const getCategoryName = useCallback((categoryId) => {
    const category = categories.find(category => category._id === categoryId);
    return category ? category.name : 'Unknown';
  }, [categories]);

  const memoizedTransactions = useMemo(() => (
    transactions.map((transaction) => (
      <tr key={transaction._id}>
        <td>{new Date(transaction.date).toLocaleDateString()}</td>
        <td>{transaction.amount}</td>
        <td>{getCategoryName(transaction.category)}</td>
        <td>{transaction.description}</td>
        <td>{transaction.type}</td>
        <td>
          <button onClick={() => setEditingTransaction(transaction)}>Edit</button>
          <button onClick={() => handleDelete(transaction._id)}>Delete</button>
        </td>
      </tr>
    ))
  ), [transactions, getCategoryName, handleDelete, setEditingTransaction]);

  return (
    <div>
      <h1>Transactions</h1>
      <TransactionForm
        onTransactionAdded={handleTransactionAdded}
        editingTransaction={editingTransaction}
        setEditingTransaction={setEditingTransaction}
        categories={categories}
      />
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Amount</th>
            <th>Category</th>
            <th>Description</th>
            <th>Type</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {memoizedTransactions}
        </tbody>
      </table>
      <Notification
        message={notification?.message}
        type={notification?.type}
        onClose={closeNotification}
      />
    </div>
  );
};

export default Transactions;
