import React from 'react'
import { NavLink } from 'react-router-dom'
import avatar from '../../../assets/img/user.png'
import { Global } from '../../../helpers/Global'
import useAuth from '../../../hooks/useAuth'

export const Nav = () => {

    const { auth, logout } = useAuth()
    return (
        <nav className="navbar__container-lists">

            <ul className="container-lists__menu-list">

                <li className="menu-list__item">
                    <NavLink to="/social" className="menu-list__link">
                        <i className="fa-solid fa-list"></i>
                        <span className="menu-list__title">Timeline</span>
                    </NavLink>
                </li>

                <li className="menu-list__item">
                    <NavLink to="/social/discover-people" className="menu-list__link">
                        <i className="fa-solid fa-user"></i>
                        <span className="menu-list__title">People</span>
                    </NavLink>
                </li>

            </ul>

            <ul className="container-lists__list-end">
                <li className="list-end__item">
                    <a href="#" className="list-end__link-image">
                        {auth.image === 'default.png' ?
                            <img src={avatar} className="list-end__img" alt="Imagen de perfil" />
                            :
                            <img src={Global.url + 'user/show-avatar/' + auth.image} className="list-end__img" alt="Imagen de perfil" />
                        }


                    </a>
                </li>
                <li className="list-end__item">
                    <a href="#" className="list-end__link">
                        <span className="list-end__name">{auth.nickname}</span>
                    </a>
                </li>
                <li className="list-end__item">
                    <NavLink to='/social/config-user' className="list-end__link">
                        <i className="fa-solid fa-gear"></i>
                        <span className="list-end__name">Edit</span>
                    </NavLink>
                </li>
                <li className="list-end__item">
                    <a onClick={logout} className="list-end__link">
                        <i className="fa-solid fa-arrow-right-from-bracket"></i>
                        <span className="list-end__name">Log out</span>
                    </a>
                </li>
            </ul>

        </nav>
    )
}
