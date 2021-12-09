import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import { QueryClient, QueryClientProvider } from 'react-query';
import { CookiesProvider } from "react-cookie";

import './styles/index.css';
import App from './App';

axios.interceptors.response.use((response) => { // Status codes within 200
	// Do something with response data
	return response;
}, (error) => { // Status outside of 200
	const statusCode = Number(error.response.status);
	const messageTitle = statusCode === 500 ? 'Internal Server Error' : 'Unknown Error';
	alert(messageTitle + ': ' + error.response.data);

	return Promise.reject(error);
});

ReactDOM.render(
	<React.StrictMode>
		<CookiesProvider>
			<QueryClientProvider client={new QueryClient()}>
				<App />
			</QueryClientProvider>
		</CookiesProvider>
	</React.StrictMode>,
	document.getElementById('root')
);