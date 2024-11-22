import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCookies } from 'react-cookie';
import LogoutButton from '../components/LogoutButton';
import { useFetchAuth } from '../hooks/useFetchAuth';
import Navbar from '../components/Navbar';

function Home() {
    const navigate = useNavigate();
    const [cookies, setCookies, removeCookies] = useCookies(['username', 'token']);
    const fetchAuth = useFetchAuth();

    useEffect(() => {
        if (!(cookies.username)) navigate("/login");
        fetchAuth("http://localhost:8080/api/v1/employees", 'get', null, null)
            .then((res) => {
                if (!res) return;
                if (res.status === 200) {
                    res.json()
                        .then((data) => {
                            const emps = document.getElementById('emps');
                            emps.textContent = data.reduce((p, c) => p + ' ' + c.first_name, '');
                        });
                } else {
                    res.text()
                        .then((txt) => {
                            alert(txt);
                        });
                }
            });
    }, []);

    return (
        <div className='container'>
            <h2>welcome @{cookies.username ?? "username"}</h2>
            <Navbar />
            <div id='emps'></div>
        </div>
    )
}

export default Home