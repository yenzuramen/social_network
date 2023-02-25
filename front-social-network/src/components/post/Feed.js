import React, { useEffect, useState, useLayoutEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import avatar from '../../assets/img/user.png'
import { GetProfile } from '../../helpers/GetProfile'
import { Global } from '../../helpers/Global'
import useAuth from '../../hooks/useAuth'
import { PostList } from '../post/PostList'


const Feed = () => {

    // const [profile, setProfile] = useState({})
    const params = useParams();
    // const [counters, setCounters] = useState({})
    // const [following, setFollowing] = useState(false)
    const [posts, setPosts] = useState([])
    const [postsPage, setPostsPage] = useState(1)
    const [showMore, setShowMore] = useState(true)

    const { auth } = useAuth();


    useEffect(() => {
        setPostsPage(1)
        // getDataUser()
        // getCounters()

    }, [])

    // useEffect(() => {
    //     setPostsPage(1)
    //     getDataUser()
    //     getCounters()

    // }, [params])

    useEffect(() => {
        getPosts()
    }, [postsPage])


    const getPosts = async () => {
        // console.log('--------- ' + postsPage);

        const request = await fetch(Global.url + 'post/feed-posts/' + postsPage, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": localStorage.getItem('sessionToken')
            }
        })
        const data = await request.json()

        // console.log(data);
        if (data.status == 'success') {

            if (postsPage == 1) {
                setPosts(data.postPaginated)

            } else {
                setPosts([...posts, ...data.postPaginated])
            }
        }

        if (postsPage == data.numberOfPages || data.numberOfPages == 1) {
            setShowMore(false)
        } else {
            setShowMore(true)
        }
    }

    return (
        <>
            <header className="content__header">
                <h1 className="content__title">Timeline</h1>
                <button className="content__button" onClick={() => { setPostsPage(1) }}> Show newest</button>
            </header>
            <PostList posts={posts} setPostsPage={setPostsPage} postsPage={postsPage} showMore={showMore} />

        </>
    )
}

export default Feed