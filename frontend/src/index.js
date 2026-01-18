import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import AuthProvider from './Context/AuthContext';
import AdminProvider  from './Context/AdminContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AdminProvider>
    <AuthProvider>
    <App />
    </AuthProvider>
    </AdminProvider>
  </React.StrictMode>
);

