import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCookies } from 'react-cookie';
import { useFetchAuth } from '../hooks/useFetchAuth';
import Navbar from '../components/Navbar';
import Modal from '../components/Modal';
import IconButton from '../components/IconButton';

function Home() {
    const navigate = useNavigate();
    const [cookies, setCookies, removeCookies] = useCookies(['username', 'token']);
    const fetchAuth = useFetchAuth();
    const [loginModalVis, setLoginModalVis] = useState(false);

    useEffect(() => {
        fetchAuth("http://localhost:8080/api/v1/employees", 'get', null, null)
            .then((res) => {
                if (res == null) {
                    setLoginModalVis(true);
                    return;
                }
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
            <Modal id={'loginModal'} isVisible={loginModalVis} dismissOnBarrier={false}>
                <h2>message</h2>
                <p>please login to continue</p>
                <IconButton icon={'login'} title='login' onClick={() => {navigate("/login");}} />
            </Modal>
        </div>
    )
}

export default Home