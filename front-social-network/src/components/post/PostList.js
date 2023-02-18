import React from 'react'

import { Link, useParams } from 'react-router-dom'
import avatar from '../../assets/img/user.png'
import { Global } from '../../helpers/Global'
import useAuth from '../../hooks/useAuth'

export const PostList = ({posts, postsPage, setPostsPage, showMore}) => {
    const { auth } = useAuth();

    const nextPage = () => {
        setPostsPage(postsPage + 1)
    }


    const deletePost = async (postId) => {
        const request = await fetch(Global.url + 'post/remove/' + postId, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Authorization": localStorage.getItem('sessionToken')
            }
        })

        const data = await request.json();
        console.log(data);
        if (data.status == 'success') {
            let filteredList = posts.filter(post => post._id !== postId)
            // setPosts(filteredList)
            setPostsPage(1)
        }
    }


    return (
        <>
            <div className="content__posts">
                {posts.map(post => {
                    return (
                        <article className="posts__post" key={post._id}>

                            <div className="post__container">

                                <div className="post__image-user">
                                    <Link to={"/social/profile/" + post.user._id} className="post__image-link">
                                        {post.user.image === 'default.png' ?
                                            <img src={avatar} className="post__user-image" alt="Foto de perfil" />
                                            : <img src={Global.url + 'user/show-avatar/' + post.user.image} className="post__user-image" alt="Foto de perfil" />

                                        }

                                    </Link>
                                </div>

                                <div className="post__body">

                                    <div className="post__user-info">
                                        <Link to={"/social/profile/" + post.user._id} className="user-info__name">{post.user.name} {post.user.surname}</Link>
                                        <span className="user-info__divider"> | </span>
                                        <a href="#" className="user-info__create-date">{post.created_at}</a>
                                    </div>

                                    <h4 className="post__content">{post.text}</h4>
                                    {post.file && <img src={Global.url + 'post/post-image/' + post.file} />}
                                </div>
                            </div>

                            <div className="post__buttons">
                                {auth._id == post.user._id &&
                                    <button onClick={() => { deletePost(post._id) }} className="post__button delete-button">
                                        <i className="fa-solid fa-trash-can"></i>
                                    </button>
                                }


                            </div>

                        </article>
                    )
                })}

            </div>

            <div className="content__container-btn">
                {showMore ?
                    <button onClick={nextPage} className="content__btn-more-post">
                        Show more posts
                    </button> : <strong>No more posts to show...</strong>}

            </div>
            <br />
        </>
    )
}
