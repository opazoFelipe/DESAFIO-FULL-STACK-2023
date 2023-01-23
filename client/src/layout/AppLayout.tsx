import React from 'react';
import { ProSidebarProvider } from 'react-pro-sidebar';

import { SideBar } from '../ui';

type Props = {
    children: JSX.Element,
};

export const AppLayout = ({ children }: Props) => {
    return (
        <ProSidebarProvider>
            <div className="d-flex flex-row" style={{ 
                    minHeight: '100vh',
               }}>
                <SideBar />
                <div className="my-2 mx-2" style={{ width: '100%'}}>
                    {children}
                </div>
            </div>
        </ProSidebarProvider>
    )
}
