import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { FiretrackProvider } from './store/FiretrackContext';
import { AuthProvider } from './store/AuthProvider';
import { LoadingProvider } from './store/LoadingContext';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <LoadingProvider>
      <AuthProvider>
        <FiretrackProvider>
          <App />
        </FiretrackProvider>
      </AuthProvider>
    </LoadingProvider>
  </React.StrictMode>
);
