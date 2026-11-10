import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import { InventarioProvider } from './context/InventarioContext.jsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <InventarioProvider>
      <App />
    </InventarioProvider>
  </React.StrictMode>
);
