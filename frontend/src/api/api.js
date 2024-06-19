import axiosInstance from './axiosConfig';

export const apiFetchTransactions = () => axiosInstance.get('/transactions');
export const apiFetchForecasts = () => axiosInstance.get('/forecasts');
export const apiFetchCategories = () => axiosInstance.get('/categories');
export const apiUpdateForecast = (id, data) => axiosInstance.put(`/forecasts/${id}`, data);
export const apiUpdateTransaction = (id, data) => axiosInstance.put(`/transactions/${id}`, data);
export const apiDeleteForecast = (id) => axiosInstance.delete(`/forecasts/${id}`);
export const apiDeleteTransaction = (id) => axiosInstance.delete(`/transactions/${id}`);
export const apiAcceptForecast = (id) => axiosInstance.put(`/forecasts/${id}/accept`);
export const apiAddForecast = (data) => axiosInstance.post('/forecasts', data);
export const apiAddTransaction = (data) => axiosInstance.post('/transactions', data);
