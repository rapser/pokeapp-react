import axios from 'axios';

export const API_BASE_URL = 'https://pokeapi.co/api/v2';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
});
