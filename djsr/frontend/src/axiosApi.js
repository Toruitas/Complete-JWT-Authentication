// djsr/frontend/src/axiosApi.js

import axios from 'axios'

const axiosInstance = axios.create({
    baseURL: 'http://127.0.0.1:8000/api/',
    timeout: 5000,
    headers: {
        'Authorization': "JWT " + localStorage.getItem('access_token'),
        'Content-Type': 'application/json',
        'accept': 'application/json'
    }
});

axiosInstance.interceptors.response.use(
    response => response,
    error => {
      const originalRequest = error.config;

      if (error.response.status === 401 && error.response.statusText === "Unauthorized") {
          const refresh_token = localStorage.getItem('refresh_token');

          return axiosInstance
              .post('/token/refresh/', {refresh: refresh_token})
              .then((response) => {

                  localStorage.setItem('access_token', response.data.access);
                  localStorage.setItem('refresh_token', response.data.refresh);

                  axiosInstance.defaults.headers['Authorization'] = "JWT " + response.data.access;
                  originalRequest.headers['Authorization'] = "JWT " + response.data.access;

                  return axiosInstance(originalRequest);
              })
              .catch(err => {
                  console.log(err)
              });
      }
      return Promise.reject(error);
  }
);

export default axiosInstance