import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';

import './styles/index.css';
import App from './App';

axios.interceptors.response.use((response) => { // Status codes within 200
  // Do something with response data
  return response;
}, (error) => { // Status outside of 200
  const statusCode = error.response.status;
  const messageTitle = statusCode == 500 ? 'Internal Server Error' : 'Unknown Error';
  alert(messageTitle + ': ' + error.response.data);

  return Promise.reject(error);
});

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);