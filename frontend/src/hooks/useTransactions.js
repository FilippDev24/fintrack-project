import useOperationsBase from './useOperationsBase';
import {
  apiFetchTransactions,
  apiAddTransaction,
  apiUpdateTransaction,
  apiDeleteTransaction
} from '../api/api';

const useTransactions = () => {
  return useOperationsBase(apiFetchTransactions, apiAddTransaction, apiUpdateTransaction, apiDeleteTransaction);
};

export default useTransactions;
