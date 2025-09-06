import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { ModalsProvider } from '@mantine/modals';
import { DatesProvider } from '@mantine/dates';
import App from './App';
import './styles/index.css';
import './i18n';

// Import Mantine styles
import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';
import '@mantine/dates/styles.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <BrowserRouter>
            <MantineProvider>
                <ModalsProvider>
                    <DatesProvider settings={{ firstDayOfWeek: 0 }}>
                        <Notifications />
                        <App />
                    </DatesProvider>
                </ModalsProvider>
            </MantineProvider>
        </BrowserRouter>
    </React.StrictMode>
);
