import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { ThemeProvider } from 'react-bootstrap';
import { ProSidebarProvider } from 'react-pro-sidebar';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { AppRouter } from './router/AppRouter';
import { AppLayout } from './layout/AppLayout';

export const App = () => {
    return (
        <ThemeProvider
            breakpoints={['xxxl', 'xxl', 'xl', 'lg', 'md', 'sm', 'xs', 'xxs']}
            minBreakpoint="xxs"
        >
            <AppRouter />
            <ToastContainer />
        </ThemeProvider>
    )
}
