

import { Global } from './Global'

export const GetProfile = async (userId, setProfile) => {

    let request = await fetch(Global.url + 'user/profile/' + userId, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": localStorage.getItem('sessionToken')
        }
    })

    let data = await request.json()
    if (data.status === 'success') {
       // console.log(data);
        setProfile(data.user)
    }

    return data;
}