import axios from 'axios';
const axiosRateLimit = require('axios-rate-limit');

export const httpClient = axiosRateLimit(axios.create(), {
  maxRequests: 60,
  perMilliseconds: 60000,
});
