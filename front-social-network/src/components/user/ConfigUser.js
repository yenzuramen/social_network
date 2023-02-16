import React, { useState } from 'react'
import { Global } from '../../helpers/Global';
import useAuth from '../../hooks/useAuth';
import { useForm } from '../../hooks/useForm'
import avatar from '../../assets/img/user.png'
import { SerializeForm } from '../../helpers/SerializeForm';


export const ConfigUser = () => {
    const [isSaved, setIsSaved] = useState()

    const { form, updateFormObj } = useForm();

    const { auth, setAuth } = useAuth();



    const editUser = async (e) => {
        e.preventDefault();

        // Get data from form
        let infoToUpdate = SerializeForm(e.target)

        delete infoToUpdate.file0;

        console.log(infoToUpdate);

        //Update on database
        const request = await fetch(Global.url + 'user/update', {
            method: "PUT",
            body: JSON.stringify(infoToUpdate),
            headers: {
                "Content-Type": "application/json",
                "Authorization": localStorage.getItem("sessionToken")
            }
        })

        const data = await request.json()
        console.log(data);
        if (data.status == "success") {
            setIsSaved('saved')
            delete data.userUpdated.password;
            setAuth(data.userUpdated)

            //Update image
            const fileInput = document.querySelector('#file')
            if (fileInput.files[0]) {

                //Get image to upload
                const formData = new FormData();
                formData.append('file0', fileInput.files[0])

                const uploadRequest = await fetch(Global.url + 'user/upload-avatar', {
                    method: "POST",
                    body: formData,
                    headers: {
                        "Authorization": localStorage.getItem("sessionToken")

                    }
                })

                const uploadData = await uploadRequest.json()
                console.log(uploadData);
                if (uploadData.status == 'success') {
                    setIsSaved('saved')
                    delete data.user.password;
                    setAuth(data.user)
                }

            }
        } else {
            setIsSaved('not-saved')

        }


    }

    return (
        <>
            <header className="content__header content__header--public">
                <h1 className="content__title">Edit Profile Info</h1>
                {/* <button className="content__button">Mostrar nuevas</button> */}
            </header>
            {isSaved == 'saved' ?
                <strong className='sign-up-alert alert-success'>
                    El usuario ha sido editado!
                </strong> : ''}

            {isSaved == 'not-saved' ?
                <strong className='sign-up-alert alert-error'>
                    Error el usuario no se ha editado.
                </strong> : ''}

            <div className='content__posts' onSubmit={editUser}>


                <form className='edit-form'>
                    <div className='form-group'>
                        <label htmlFor='name'>Name</label>
                        <input type='text' name='name' defaultValue={auth.name} />
                    </div>
                    <div className='form-group'>
                        <label htmlFor='surname'>Surname</label>
                        <input type='text' name='surname' defaultValue={auth.surname} />
                    </div>
                    <div className='form-group'>
                        <label htmlFor='nickname'>Nickname</label>
                        <input type='text' name='nickname' defaultValue={auth.nickname} />
                    </div>
                    <div className='form-group'>
                        <label htmlFor='email'>Email</label>
                        <input type='email' name='email' defaultValue={auth.email} />
                    </div>
                    <div className='form-group'>
                        <label htmlFor='bio'>Bio</label>
                        <textarea type='text' name='bio' defaultValue={auth.bio} />
                    </div>
                    <div className='form-group'>
                        <label htmlFor='password'>Password</label>
                        <input type='password' name='password' />
                    </div>

                    <div className='form-group'>
                        <label htmlFor='file0'>Upload Avatar</label>

                        <div className="general-info__container-avatar">
                            {auth.image === 'default.png' ?
                                <img src={avatar} className="container-avatar__img" alt="Foto de perfil" />
                                :
                                <img src={Global.url + 'user/show-avatar/' + auth.image} className="container-avatar__img" alt="Foto de perfil" />
                            }
                        </div>
                        <br />
                        <input type="file" name="file0" id="file" />
                    </div>
                    <br />
                    <input type='submit' value='Save Changes' className='btn btn-succes' />
                </form>
            </div>
        </>
    )
}
