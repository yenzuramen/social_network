import React from 'react'
import avatar from '../../assets/img/user.png'
import { Global } from '../../helpers/Global'
import useAuth from '../../hooks/useAuth'



export const UserList = ({ userList, setUserList, following, setFollowing, loading, showMore, setUsersPage, usersPage }) => {

    const { auth } = useAuth()

    const follow = async (idToFollow) => {
        console.log('follow ' + idToFollow);

        //request   
        const request = await fetch(Global.url + 'follow/save-follow', {
            method: "post",
            body: JSON.stringify({ followed: idToFollow }),
            headers: {
                "Content-Type": "application/json",
                "Authorization": localStorage.getItem('sessionToken')
            }
        })

        const data = await request.json()

        console.log(data);

        if (data.status == 'success') {
            setFollowing([...following, idToFollow])
        }
        //adds user id to the list 
    }

    const unfollow = async (idToUnfollow) => {
        console.log('unfollow ' + idToUnfollow);

        ///request
        const request = await fetch(Global.url + 'follow/unfollow/' + idToUnfollow, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Authorization": localStorage.getItem('sessionToken')
            }
        })

        const data = await request.json()

        if (data.status == 'success') {
            //deletes from the list
            let filteredList = following.filter(followingId => idToUnfollow !== followingId)
            setFollowing(filteredList)
        }

    }


    const nextPage = () => {
        setUsersPage(usersPage + 1)

    }

    return (
        <>
            {userList.map(user => {
                return (
                    <article className="content__posts" key={user._id}>
                        <div className="posts__post">
                            <div className="post__container">
                                <div className="post__image-user">
                                    <a href="#" className="post__image-link">
                                        {user.image === 'default.png' ?
                                            <img src={avatar} className="post__user-image" alt="Foto de perfil" />
                                            : <img src={Global.url + 'user/show-avatar/' + user.image} className="post__user-image" alt="Foto de perfil" />

                                        }

                                    </a>
                                </div>

                                <div className="post__body">

                                    <div className="post__user-info">
                                        <a href="#" className="user-info__name">{user.name} {user.surname}</a>
                                        <span className="user-info__divider"> | </span>
                                        <a href="#" className="user-info__create-date">{user.created_at}</a>
                                    </div>

                                    <h4 className="post__content">{user.bio}</h4>

                                </div>

                            </div>
                            {user._id !== auth._id &&
                                <div className="post__buttons">

                                    {following.includes(user._id) ? <button onClick={() => { unfollow(user._id) }} className="unfollow__button">
                                        UnFollow
                                    </button> : <button onClick={() => { follow(user._id) }} className="follow__button">
                                        Follow
                                    </button>}

                                </div>
                            }
                        </div>
                    </article>
                )

            })}

            {loading ? <h3>Loading...</h3> : ""}

            <div className="content__container-btn">
                {showMore ?
                    (<button className="content__btn-more-post" onClick={nextPage}>
                        See more people
                    </button>) :
                    (<strong>No more users to show...</strong>)
                }

            </div>
            <br />
        </>
    )
}
