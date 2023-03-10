import React from 'react'
import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom'
import { Followers } from '../components/follow/Followers'
import { Following } from '../components/follow/Following'
import { PrivateLayout } from '../components/layout/private/PrivateLayout'
import { PublicLayout } from '../components/layout/public/PublicLayout'
import Feed from '../components/post/Feed'
import { ConfigUser } from '../components/user/ConfigUser'
import { DiscoverUsers } from '../components/user/DiscoverUsers'
import { Login } from '../components/user/Login'
import { Profile } from '../components/user/Profile'
import { SignUp } from '../components/user/SignUp'
import { AuthProvider } from '../context/AuthProvider'

export const Routing = () => {
    return (
        <BrowserRouter>
            <AuthProvider>
                <Routes>
                    <Route path='/' element={<PublicLayout />}>
                        <Route index element={<Login />} />
                        <Route path='log-in' element={<Login />} />
                        <Route path='sign-up' element={<SignUp />} />
                    </Route>

                    <Route path='/social' element={<PrivateLayout />}>
                        <Route index element={<Feed />} />
                        <Route path='feed' element={<Feed />} />
                        <Route path='discover-people' element={<DiscoverUsers />} />
                        <Route path='config-user' element={<ConfigUser />} />
                        <Route path='following/:idToConsult' element={<Following />} />
                        <Route path='followers/:idToConsult' element={<Followers />} />
                        <Route path='profile/:idToConsult' element={<Profile />} />
                    </Route>

                    <Route path='/*' element={<><h1>Error 404</h1><hr /><Link to="/">Back to home</Link></>} />

                </Routes>
            </AuthProvider>
        </BrowserRouter>
    )
}
