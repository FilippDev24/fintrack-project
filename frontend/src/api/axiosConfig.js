// src/api/axiosConfig.js
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:5001/api', // замените на ваш порт, если он отличается
});

export default axiosInstance;
