import axios from 'axios';

const api = axios.create({
  baseURL: 'https://iammusic.onrender.com/api/',
});

export default api;
