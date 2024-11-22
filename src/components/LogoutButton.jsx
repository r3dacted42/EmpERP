import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useCookies } from 'react-cookie';

function LogoutButton() {
    const navigate = useNavigate();
    const [cookies, setCookies, removeCookies] = useCookies(['username', 'token']);

    function logout() {
        removeCookies('username');
        removeCookies('token');
        navigate("/login");
    }

    return (
        <button onClick={logout}>logout</button>
    )
}

export default LogoutButton