import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { Provider } from 'react-redux';
import store from './Store';
import AuthProvider from './Context/auth';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthProvider>
     <Provider store={store}>
        <App />
     </Provider>
   </AuthProvider>
  </React.StrictMode>
);


