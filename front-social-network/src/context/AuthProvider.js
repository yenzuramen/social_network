import React, { createContext, useState, useEffect } from 'react';
import { Global } from '../helpers/Global';


const AuthContext = createContext();


export const AuthProvider = ({ children }) => {

    const [auth, setAuth] = useState({})
    const [counters, setCounters] = useState({})
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        authUser();
    }, [])

    const authUser = async (second) => {
        //Get data from identified user from localStorage
        const token = localStorage.getItem('sessionToken')

        //validate if you have user and token
        if (!token) {
            setLoading(false)
            return false;
        }

        const request = await fetch(Global.url + 'user/profile', {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": token
            }
        })

        const data = await request.json()

        // console.log(data.user);
        const requestCounters = await fetch(Global.url + 'user/follow-numbers/' + data.user._id, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": token
            }
        })

        const dataCounters = await requestCounters.json()
        console.log(dataCounters);
        //set auth state
        setAuth(data.user)
        setCounters(dataCounters)
        setLoading(false)
    }


    const logout = (e) => {
        console.log('login ou');
        localStorage.clear()
        setAuth({})
        setCounters({})
    }

    return (
        <AuthContext.Provider
            value={{
                auth,
                setAuth,
                counters,
                loading,
                logout
            }}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthContext;
