import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useCookies } from 'react-cookie';
import IconButton from './IconButton';

function LogoutButton() {
    const navigate = useNavigate();
    const [cookies, setCookies, removeCookies] = useCookies(['username', 'token']);

    function logout() {
        removeCookies('username');
        removeCookies('token');
        navigate("/login");
    }

    return (
        <IconButton icon={'logout'} title='logout' onClick={logout}>logout</IconButton>
    )
}

export default LogoutButton