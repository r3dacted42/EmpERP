import React from 'react'
import { useNavigate } from 'react-router-dom'
import LogoutButton from './LogoutButton';

function Navbar() {
    const navigate = useNavigate();

    return (
        <nav className='navbar'>
            <button>employees</button>
            <button>departments</button>
            <span className='flex-grow-1'></span>
            <LogoutButton />
        </nav>
    )
}

export default Navbar