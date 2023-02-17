import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { GetProfile } from '../../helpers/GetProfile'

import { Global } from '../../helpers/Global'

import { UserList } from '../user/UserList'

export const Followers = () => {

    const [usersPage, setUsersPage] = useState(1)
    const [userList, setUserList] = useState([])
    const [showMore, setShowMore] = useState(true)
    const [loading, setLoading] = useState()
    const [following, setFollowing] = useState([])
    const [followers, setFollowers] = useState([])

    const [profile, setProfile] = useState({})

    const params = useParams();

    useEffect(() => {
        getUsers()
        GetProfile(params.idToConsult, setProfile)
    }, [])


    const getUsers = async () => {
        setLoading(true)

        let idToConsult = params.idToConsult;
        //Request
        const request = await fetch(Global.url + 'follow/follower-list/' + idToConsult + '/' + usersPage, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": localStorage.getItem('sessionToken')
            }
        })

        const data = await request.json();
        console.log(data);

        //update followers and following 
        setFollowers(data.followers)
        setFollowing(data.following)

        let cleanUsers = []
        data.followsFound.forEach(element => {
            console.log(element.user);
            cleanUsers.push(element.user)  //Se asignan los usuarios a los que el logeado sigue
        });

        console.log(cleanUsers);
        data.users = cleanUsers;
        //state to list them
        if (data.status == 'succes' || data.users) {
            let updatedList = userList;

            if (data.users.length >= 1) {
                updatedList = [...userList, ...data.users]
                console.log('entrando');
            }
            setUserList(updatedList)
        }

        setLoading(false)

        //Hidding "See more users" button
        if (data.totalPages == usersPage) {
            setShowMore(false)
        }

    }

    useEffect(() => {
        getUsers()
        console.log(usersPage);
    }, [usersPage])



    return (
        <>
            <header className="content__header">
                <h1 className="content__title">{profile.name} is Followed by:</h1>
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

        </>
    )
}
