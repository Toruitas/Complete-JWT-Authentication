// djsr/frontend/src/axiosApi.js

import axios from 'axios'

const axiosInstance = axios.create({
    baseURL: 'http://127.0.0.1:8000/api/',
    timeout: 5000,
    headers: {
        'Authorization': localStorage.getItem('access_token') ? "JWT " + localStorage.getItem('access_token') : null,
        'Content-Type': 'application/json',
        'accept': 'application/json'
    }
});

axiosInstance.interceptors.response.use(
    response => response,
    error => {
      const originalRequest = error.config;

      if (!originalRequest._retry){
        originalRequest._retry = true;
        // test for token presence, no point in sending a request if token isn't present
        if (error.response.data.code === "token_not_valid" && error.response.status === 401 && error.response.statusText === "Unauthorized") {
            const refresh_token = localStorage.getItem('refresh_token');

            if (refresh_token){
                const tokenParts = JSON.parse(atob(refresh_token.split('.')[1]));

                // exp date in token is expressed in seconds, while now() returns milliseconds:
                const now = Math.ceil(Date.now() / 1000);
                console.log(tokenParts.exp);

                if (tokenParts.exp > now) {
                    return axiosInstance
                    .post('/token/refresh/', {refresh: refresh_token})
                    .then((response) => {
        
                        localStorage.setItem('access_token', response.data.access);
                        localStorage.setItem('refresh_token', response.data.refresh);
        
                        axiosInstance.defaults.headers['Authorization'] = "JWT " + response.data.access;
                        originalRequest.headers['Authorization'] = "JWT " + response.data.access;

                        console.log("Tokens refreshed.")
        
                        return axiosInstance(originalRequest);
                    })
                    .catch(err => {
                        console.log(err)
                    });
                }else{
                    console.log("Refresh token is expired", tokenParts.exp, now);
                }
            }else{
                console.log("Refresh token not available.")
            }
        }else{
            console.log("Do other API intercepting unrelated to Token Refreshment here.")
        }
      }else{
          console.log("Too many retries.")
      }
     
      // specific error handling done elsewhere
      return Promise.reject(error);
  }
);

export default axiosInstance