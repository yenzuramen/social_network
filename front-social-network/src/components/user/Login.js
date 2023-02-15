import React, { useState } from 'react'
import { Navigate } from 'react-router-dom';
import { Global } from '../../helpers/Global';
import useAuth from '../../hooks/useAuth';
import { useForm } from '../../hooks/useForm'

export const Login = () => {

  const { form, updateFormObj } = useForm({});
  const [loged, setLoged] = useState()

  const { setAuth } = useAuth();

  const logIn = async (e) => {
    e.preventDefault()

    let newLog = JSON.stringify(form);

    let request = await fetch(Global.url + 'user/log-in', {
      method: 'POST',
      body: newLog,
      headers: {
        "Content-Type": "application/json"
      }
    })

    let data = await request.json()

    console.log(data);

    if (data.status == 'success') {
      setLoged('logged')

      //save on local Storage
      localStorage.setItem("sessionToken", data.token);
      console.log(localStorage.getItem("sessionToken"));

      // setAuth(data.user)
      setTimeout(() => {
        console.log('navigate to social');
        window.location.reload()
      }, 1500)


    } else {
      setLoged('not-logged')
    }

  }

  return (
    <>
      <header className="content__header content__header--public">
        <h1 className="content__title">Log In</h1>
        {/* <button className="content__button">Mostrar nuevas</button> */}
      </header>
      {loged == 'logged' ?
        <strong className='sign-up-alert alert-success'>
          LogIn exitoso!
        </strong> : ''}
      {loged == 'not-logged' ?
        <strong className='sign-up-alert alert-error'>
          Email o contraseña invalidos...
        </strong> : ''}
      <div className='content__posts'>
        <form className='login-form' onSubmit={logIn}>
          <div className='from-group'>
            <label htmlFor='email'>Email</label>
            <input type='email' name='email' onChange={updateFormObj} />
          </div>
          <div className='from-group'>
            <label htmlFor='password'>Password</label>
            <input type='password' name='password' onChange={updateFormObj} />
          </div>
          <input type="submit" value="Log In" className='btn btn-succes' />
        </form>
      </div>
    </>
  )
}
