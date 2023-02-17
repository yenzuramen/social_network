import React, { useEffect, useState } from 'react'
import { Link, NavLink } from 'react-router-dom';
import avatar from '../../../assets/img/user.png'
import { Global } from '../../../helpers/Global';
import useAuth from '../../../hooks/useAuth'
import { useForm } from '../../../hooks/useForm';

export const Sidebar = () => {

    const { auth, counters } = useAuth();

    const { form, updateFormObj } = useForm({});

    const [isSaved, setIsSaved] = useState('')

    const savePost = async (e) => {
        e.preventDefault();

        //get data from form
        let newPost = form;

        //Request to save on db
        let request = await fetch(Global.url + 'post/save-post', {
            method: "POST",
            body: JSON.stringify(newPost),
            headers: {
                "Content-Type": "application/json",
                "Authorization": localStorage.getItem('sessionToken')
            }

        })

        let data = await request.json()

        ////console.log(data);

        if (data.status == 'success') {
            setIsSaved('saved')
            ////console.log('aver');

            //upload image
            const fileInput = document.querySelector('#file')

            if (fileInput.files[0]) {

                const formData = new FormData();
                formData.append(
                    "file0", fileInput.files[0]
                )

                let requestUpload = await fetch(Global.url + 'post/upload/' + data.savedPost._id, {
                    method: "POST",
                    body: formData,
                    headers: {
                        // "Content-Type": "application/json",
                        "Authorization": localStorage.getItem('sessionToken')
                    }

                })

                let dataUpload = await requestUpload.json()

                if (dataUpload.status == 'success') {
                    setIsSaved('saved')
                }
                //console.log(dataUpload);

            }

            let postForm = document.querySelector('#post-form')
            postForm.reset();


        } else {
            setIsSaved('not-saved')
        }


    }

    return (
        <aside className="layout__aside">

            <header className="aside__header">
                <h1 className="aside__title">Hola, {auth.name}</h1>
            </header>

            <div className="aside__container">

                <div className="aside__profile-info">

                    <div className="profile-info__general-info">
                        <div className="general-info__container-avatar">
                            {auth.image === 'default.png' ?
                                <img src={avatar} className="container-avatar__img" alt="Foto de perfil" />
                                :
                                <img src={Global.url + 'user/show-avatar/' + auth.image} className="container-avatar__img" alt="Foto de perfil" />
                            }
                        </div>

                        <div className="general-info__container-names">
                            <NavLink to={"/social/profile/" + auth._id} className="container-names__name">{auth.name} {auth.surname}</NavLink>
                            <p className="container-names__nickname">{auth.nickname}</p>
                        </div>
                    </div>

                    <div className="profile-info__stats">

                        <div className="stats__following">
                            <Link to={'following/' + auth._id} className="following__link">
                                <span className="following__title">Following</span>
                                <span className="following__number">{counters.following}</span>
                            </Link>
                        </div>
                        <div className="stats__following">
                            <Link to={'followers/' + auth._id} className="following__link">
                                <span className="following__title">Followers</span>
                                <span className="following__number">{counters.followers}</span>
                            </Link>
                        </div>


                        <div className="stats__following">
                            <NavLink to={"/social/profile/" + auth._id} className="following__link">
                                <span className="following__title">Posts</span>
                                <span className="following__number">{counters.posts}</span>
                            </NavLink>
                        </div>


                    </div>
                </div>


                <div className="aside__container-form">

                    {isSaved == 'saved' ?
                        <strong className='sign-up-alert alert-success'>
                            Posted!
                        </strong> : ''}

                    {isSaved == 'not-saved' ?
                        <strong className='sign-up-alert alert-error'>
                            Error posting.
                        </strong> : ''}

                    <form onSubmit={savePost} className="container-form__form-post" id="post-form">

                        <div className="form-post__inputs">
                            <label htmlFor="text" className="form-post__label">Post Something!</label>
                            <textarea name="text" className="form-post__textarea" onChange={updateFormObj}></textarea>
                        </div>

                        <div className="form-post__inputs">
                            <label htmlFor="image" className="form-post__label"></label>
                            <input type="file" name="file0" id="file" className="form-post__image" />
                        </div>

                        <input type="submit" value="Post" className="form-post__btn-submit" />

                    </form>

                </div>

            </div>

        </aside>

    )
}
