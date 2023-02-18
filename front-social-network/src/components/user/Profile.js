import React, { useEffect, useState, useLayoutEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import avatar from '../../assets/img/user.png'
import { GetProfile } from '../../helpers/GetProfile'
import { Global } from '../../helpers/Global'
import useAuth from '../../hooks/useAuth'
import { PostList } from '../post/PostList'
export const Profile = () => {

    const [profile, setProfile] = useState({})
    const params = useParams();
    const [counters, setCounters] = useState({})
    const [following, setFollowing] = useState(false)
    const [posts, setPosts] = useState([])
    const [postsPage, setPostsPage] = useState(1)
    const [showMore, setShowMore] = useState(true)

    const { auth } = useAuth();

    const getCounters = async () => {

        let request = await fetch(Global.url + 'user/follow-numbers/' + params.idToConsult, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": localStorage.getItem('sessionToken')
            }
        })

        let data = await request.json()
        if (data.status == "success") {
            setCounters({
                following: data.following,
                followers: data.followers,
                posts: data.posts
            })
        }
        //console.log(data);

    }

    useEffect(() => {
        setPostsPage(1)
        getDataUser()
        getCounters()

    }, [])

    useEffect(() => {
        setPostsPage(1)
        getDataUser()
        getCounters()

    }, [params])

    useEffect(() => {
        getPosts()
    }, [postsPage])

    // const nextPage = () => {
    //     setPostsPage(postsPage + 1)
    // }

    const getDataUser = async () => {
        let dataProfile = await GetProfile(params.idToConsult, setProfile)

        if (dataProfile.following && dataProfile.following._id) {
            setFollowing(true)
        }
    }


    const follow = async (idToFollow) => {
        //console.log('follow ' + idToFollow);

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

        //console.log(data);

        if (data.status == 'success') {
            setFollowing(true)
        }
        //adds user id to the list 
    }

    const unfollow = async (idToUnfollow) => {
        //console.log('unfollow ' + idToUnfollow);

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
            setFollowing(false)
        }

    }

    const getPosts = async () => {
        console.log('--------- ' + postsPage);

        const request = await fetch(Global.url + 'post/user-posts/' + params.idToConsult + '/' + postsPage, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": localStorage.getItem('sessionToken')
            }
        })
        const data = await request.json()

        console.log(data);
        if (data.status == 'success') {

            if (postsPage == 1) {
                setPosts(data.postsFound)

            } else {
                setPosts([...posts, ...data.postsFound])
            }
        }

        if (postsPage == data.numberOfPages || data.numberOfPages == 1) {
            setShowMore(false)
        } else {
            setShowMore(true)
        }
    }

    // const deletePost = async (postId) => {
    //     const request = await fetch(Global.url + 'post/remove/' + postId, {
    //         method: "DELETE",
    //         headers: {
    //             "Content-Type": "application/json",
    //             "Authorization": localStorage.getItem('sessionToken')
    //         }
    //     })

    //     const data = await request.json();
    //     console.log(data);
    //     if (data.status == 'success') {
    //         let filteredList = posts.filter(post => post._id !== postId)
    //         // setPosts(filteredList)
    //         setPostsPage(1)
    //     }
    // }

    return (
        <>

            <div className="aside__profile-info">

                <div className="profile-info__general-info profile_header">
                    <div className='profile_info'>
                        <div className="general-info__container-avatar">
                            {
                                profile.image == 'default.png' ?
                                    <img src={avatar} className="container-avatar__img" alt="Foto de perfil" />
                                    : <img src={Global.url + 'user/show-avatar/' + profile.image} className="container-avatar__img" alt="Foto de perfil" />
                            }

                        </div>

                        <div className="general-info__container-names">
                            <a href="#" className="container-names__name">{profile.name} {profile.surname}</a>
                            <p className="container-names__nickname">{profile.nickname}</p>
                            <p className="container-names__nickname bio">" {profile.bio} "</p>
                        </div>
                    </div>

                    <div className='profile-btn'>
                        {profile._id !== auth._id && (
                            following ? <button onClick={() => { unfollow(profile._id) }} className="unfollow__button">
                                UnFollow
                            </button> : <button onClick={() => { follow(profile._id) }} className="follow__button">
                                Follow
                            </button>
                        )
                        }
                    </div>

                </div>

                <div className="profile-info__stats">

                    <div className="stats__following">
                        <Link to={'/social/following/' + params.idToConsult} className="following__link">
                            <span className="following__title">Following</span>
                            <span className="following__number">{counters.following}</span>
                        </Link>
                    </div>
                    <div className="stats__following">
                        <Link to={'/social/followers/' + params.idToConsult} className="following__link">
                            <span className="following__title">Followers</span>
                            <span className="following__number">{counters.followers}</span>
                        </Link>
                    </div>


                    <div className="stats__following">
                        <Link to={'/social/profile/' + params.idToConsult} className="following__link">
                            <span className="following__title">Posts</span>
                            <span className="following__number">{counters.posts}</span>
                        </Link>
                    </div>


                </div>
            </div>

            <PostList posts={posts} setPostsPage={setPostsPage} postsPage={postsPage} showMore={showMore} />

        </>
    )
}
