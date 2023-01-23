import React from 'react'
import { AppLayout } from '../layout/AppLayout'

interface Props {
    children: JSX.Element,
}

export const AppPage = ({ children }: Props) => {
    return (
        <AppLayout>
            {children}
        </AppLayout>
    )
}
