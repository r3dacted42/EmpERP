import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCookies } from 'react-cookie';
import { useFetchAuth } from '../hooks/useFetchAuth';
import Navbar from '../components/Navbar';
import Modal from '../components/Modal';
import IconButton from '../components/IconButton';
import Employee from '../models/Employee';

function Home() {
    const navigate = useNavigate();
    const [cookies, setCookies, removeCookies] = useCookies(['username', 'token']);
    const fetchAuth = useFetchAuth();
    const [loginModalVis, setLoginModalVis] = useState(false);
    const [employees, setEmployees] = useState([]);

    useEffect(() => {
        fetchAuth("/employees", 'get', null, null)
            .then((res) => {
                if (res == null) {
                    setLoginModalVis(true);
                    return;
                }
                if (res.status === 200) {
                    res.json()
                        .then((data) => {
                            let _employees = data.map((d) => (new Employee(d)));
                            setEmployees(_employees);
                            const emps = document.getElementById('emps');
                            emps.innerHTML = `<img src='${_employees[0].photo_url}'> <p>${_employees[0].fullName}</p>`;
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