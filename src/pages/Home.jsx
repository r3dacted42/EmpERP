import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import useFetchAuth from '../hooks/useFetchAuth';
import Navbar from '../components/general/Navbar';
import Modal from '../components/general/Modal';
import IconButton from '../components/general/IconButton';
import EmployeeModel from '../models/EmployeeModel';
import EmployeeCard from '../components/employee/EmployeeCard';

function Home() {
    const navigate = useNavigate();
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
                            let emps = data.map((d) => (new EmployeeModel(d)));
                            setEmployees(emps);
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
            <h2>employees</h2>
            <Navbar />

            <span className='d-flex flex-direction-row justify-content-end gap-3 mb-3'>
                <IconButton icon={'person_add'} title='add employee' />
                <IconButton icon={'delete'} title='delete all' />
            </span>

            <div className='row row-cols-lg-2 row-cols-1 row-gap-3'>
                {employees.map((e) =>
                    <div key={e.id} className='col'>
                        <EmployeeCard _model={e} />
                    </div>)}
            </div>

            <Modal id={'loginModal'} isVisible={loginModalVis} dismissOnBarrier={false}>
                <h2>message</h2>
                <p>please login to continue</p>
                <IconButton icon={'login'} title='login' onClick={() => { navigate("/login"); }} />
            </Modal>
        </div>
    )
}

export default Home