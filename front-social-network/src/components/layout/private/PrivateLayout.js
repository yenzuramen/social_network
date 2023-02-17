import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import useAuth from '../../../hooks/useAuth'
import { Header } from './Header'
import { Sidebar } from './Sidebar'

export const PrivateLayout = () => {
    const { auth,loading } = useAuth();

    // console.log('private');
    // console.log(auth);
    if (loading) {
        return (<h1>Loading...</h1>)
    } else {
        return (
            <>
                {/* LAYOUT */}

                {/* HEADER */}
                <Header />

                {/* MAIN CONTENT */}
                <section className='layout__content'>
                    {!auth._id ?
                        <Navigate to='/log-in' />
                        : <Outlet />}
                </section>
                {/* BARRA LATERAL */}
                <Sidebar />
            </>
        )
    }


}
