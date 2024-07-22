import React from 'react';
import ReactDOM from 'react-dom/client';
import { MantineProvider } from '@mantine/core';
import AppRoutes from './routes';
import '@mantine/core/styles.css';
// import './index.css'

// const theme = createTheme({
//    primaryColor : 'cyan'
// })

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);

root.render(
  <React.StrictMode>
    <MantineProvider withGlobalClasses>
      <AppRoutes />
    </MantineProvider>
  </React.StrictMode>
);
