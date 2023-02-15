import React from 'react'
import { Outlet } from 'react-router-dom'
import { Header } from './Header'

export const PublicLayout = () => {
    return (
        <>
            {/* LAYOUT */}
            <Header />

            {/* MAIN CONTENT */}
            <section className='layout__content'>
                <Outlet />
            </section>
        </>
    )
}
