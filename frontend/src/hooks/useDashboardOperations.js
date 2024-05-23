import useOperationsBase from './useOperationsBase';
import {
  apiFetchTransactions,
  apiFetchForecasts,
  apiAddTransaction,
  apiAddForecast,
  apiUpdateTransaction,
  apiUpdateForecast,
  apiDeleteTransaction,
  apiDeleteForecast,
  apiAcceptForecast
} from '../api/api';

const useDashboardOperations = () => {
  const transactions = useOperationsBase(apiFetchTransactions, apiAddTransaction, apiUpdateTransaction, apiDeleteTransaction);
  const forecasts = useOperationsBase(apiFetchForecasts, apiAddForecast, apiUpdateForecast, apiDeleteForecast);

  const handleAcceptForecast = async (id) => {
    try {
      await apiAcceptForecast(id);
      forecasts.setOperations(forecasts.operations.map(forecast => forecast._id === id ? { ...forecast, status: 'accepted' } : forecast));
      forecasts.setNotification({ message: 'Forecast accepted successfully', type: 'success' });
    } catch (error) {
      forecasts.setNotification({ message: 'Error accepting forecast', type: 'error' });
      console.error('Error accepting forecast:', error);
    }
  };

  return {
    transactions,
    forecasts,
    handleAcceptForecast
  };
};

export default useDashboardOperations;
