import { StrictMode } from 'react';
import router from './lib/Routes.jsx';
import { RouterProvider } from 'react-router-dom';
import { createRoot } from 'react-dom/client';
import React from 'react';
import { UserProvider } from '../src/hooks/useUser.jsx'; // Asegúrate de usar la ruta correcta
import '../src/css/main/main.css';

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <UserProvider> {/* Aquí se envuelve el RouterProvider con UserProvider */}
      <RouterProvider router={router} />
    </UserProvider>
  </React.StrictMode>
);
