import useOperationsBase from './useOperationsBase';
import {
  apiFetchForecasts,
  apiAddForecast,
  apiUpdateForecast,
  apiDeleteForecast,
  apiAcceptForecast
} from '../api/api';

const useForecasts = () => {
  const base = useOperationsBase(apiFetchForecasts, apiAddForecast, apiUpdateForecast, apiDeleteForecast);

  const handleAccept = async (id) => {
    try {
      await apiAcceptForecast(id);
      base.setOperations(base.operations.map(forecast => forecast._id === id ? { ...forecast, status: 'accepted' } : forecast));
      base.setNotification({ message: 'Forecast accepted successfully', type: 'success' });
    } catch (error) {
      base.setNotification({ message: 'Error accepting forecast', type: 'error' });
      console.error('Error accepting forecast:', error);
    }
  };

  return {
    ...base,
    handleAccept
  };
};

export default useForecasts;
