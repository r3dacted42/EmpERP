import { useNavigate, useLocation } from 'react-router-dom'
import LogoutButton from './LogoutButton';
import IconButton from './IconButton';
import './Navbar.css';
import {pathMap} from '../../utilities/routes'

function Navbar({pathname}) {
    const navigate = useNavigate();
    const location = useLocation();
    const currentPath = location.pathname;

    return (
        <nav className='navbar'>
            <IconButton icon={'badge'} title='employees' onClick={() => navigate("/")} 
                disabled={pathMap[currentPath] === 'employees'} />
            <IconButton icon={'domain'} title='departments' onClick={() => navigate("/departments")}
                disabled={pathMap[currentPath] === 'departments'} />
            <span className='flex-grow-1'></span>
            <LogoutButton />
        </nav>
    )
}

export default Navbar