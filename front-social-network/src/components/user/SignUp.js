import React, { useState } from 'react'
import { Global } from '../../helpers/Global'
import { useForm } from '../../hooks/useForm'

export const SignUp = () => {

    const { form, updateFormObj } = useForm({})
    const [isSaved, setIsSaved] = useState(false)

    const saveUser = async (e) => {

        e.preventDefault()

        let newUser = form;
        console.log(newUser);

        //save user on backend
        const request = await fetch(Global.url + 'user/save-user', {
            method: "POST",
            body: JSON.stringify(newUser),
            headers: {
                "Content-Type": "application/json"
            }
        });

        const data = await request.json();
        console.log(data);

        if (data.status == 'success') {
            setIsSaved('saved')

        } else {
            setIsSaved('not-saved')
        }
    }

    return (
        <>
            <header className="content__header content__header--public">
                <h1 className="content__title">Sign Up</h1>
                {/* <button className="content__button">Mostrar nuevas</button> */}
            </header>
            {isSaved == 'saved' ?
                <strong className='sign-up-alert alert-success'>
                    User saved! You can log in now.
                </strong> : ''}

            {isSaved == 'not-saved' ?
                <strong className='sign-up-alert alert-error'>
                    User not saved.
                </strong> : ''}

            <div className='content__posts' onSubmit={saveUser}>


                <form className='signUp-form'>
                    <div className='form-group'>
                        <label htmlFor='name'>Name</label>
                        <input type='text' name='name' onChange={updateFormObj} />
                    </div>
                    <div className='form-group'>
                        <label htmlFor='surname'>Surname</label>
                        <input type='text' name='surname' onChange={updateFormObj} />
                    </div>
                    <div className='form-group'>
                        <label htmlFor='nickname'>Nickname</label>
                        <input type='text' name='nickname' onChange={updateFormObj} />
                    </div>
                    <div className='form-group'>
                        <label htmlFor='email'>Email</label>
                        <input type='email' name='email' onChange={updateFormObj} />
                    </div>
                    <div className='form-group'>
                        <label htmlFor='password'>Password</label>
                        <input type='password' name='password' onChange={updateFormObj} />
                    </div>

                    <input type='submit' value='Sign Up!' className='btn btn-succes' />
                </form>
            </div>
        </>
    )
}
