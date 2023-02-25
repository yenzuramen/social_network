import React, { useEffect, useState } from 'react'

import { Global } from '../../helpers/Global'

import { UserList } from './UserList'

export const DiscoverUsers = () => {

  const [usersPage, setUsersPage] = useState(1)
  const [userList, setUserList] = useState([])
  const [showMore, setShowMore] = useState(true)
  const [loading, setLoading] = useState()
  const [following, setFollowing] = useState([])
  const [followers, setFollowers] = useState([])


  useEffect(() => {
    getUsers()
  }, [])


  const getUsers = async () => {
    setLoading(true)

    //Request
    const request = await fetch(Global.url + 'user/list-users/' + usersPage, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": localStorage.getItem('sessionToken')
      }
    })

    const data = await request.json();
    // console.log(data);

    //update followers and following 
    setFollowers(data.followers)
    setFollowing(data.following)

    //state to list them
    if (data.status == 'succes' || data.users) {
      let updatedList = userList
      if (data.users.length >= 1) {
        updatedList = [...userList, ...data.users]
      }
      setUserList(updatedList)
    }

    setLoading(false)

    //Hidding "See more users" button
    if (data.pages == usersPage) {
      setShowMore(false)
    }

  }

  useEffect(() => {
    getUsers()
    // console.log(usersPage);
  }, [usersPage])

  // const nextPage = () => {
  //   setUsersPage(usersPage + 1)

  // }



  return (
    <>
      <header className="content__header">
        <h1 className="content__title">People</h1>
        {/* <button className="content__button">Mostrar nuevas</button> */}
      </header>

      <UserList userList={userList}
        setUserList={setUserList}
        following={following}
        setFollowing={setFollowing}
        loading={loading}
        showMore={showMore}
        usersPage={usersPage}
        setUsersPage={setUsersPage} />

      {/* {loading ? <h3>Loading...</h3> : ""}

      <div className="content__container-btn">
        {showMore ?
          (<button className="content__btn-more-post" onClick={nextPage}>
            See more people
          </button>) :
          (<strong>No more users to show...</strong>)
        }

      </div>
      <br /> */}
    </>
  )
}
