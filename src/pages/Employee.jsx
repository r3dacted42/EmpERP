import React, { useEffect, useState } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import useFetchAuth from '../hooks/useFetchAuth';
import Navbar from '../components/general/Navbar';
import Modal from '../components/general/Modal';
import IconButton from '../components/general/IconButton';
import EmployeeModel from '../models/EmployeeModel';

function Employee() {
    const navigate = useNavigate();
    const { employee_id } = useParams();
    const fetchAuth = useFetchAuth();
    const [loginModalVis, setLoginModalVis] = useState(false);
    const [employee, setEmployee] = useState(null);

    useEffect(() => {
        fetchAuth(`/employees/${employee_id}`, 'get', null, null)
            .then((res) => {
                if (res == null) {
                    setLoginModalVis(true);
                    return;
                }
                if (res.status === 200) {
                    res.json()
                        .then((data) => {
                            setEmployee(new EmployeeModel(data));
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
            <h2>{employee_id}</h2>
            <Navbar />

            {
                employee
                    ?
                    <div className='employee-page'>
                        <img src={employee.photo_url} alt={employee.employee_id + "'s photo"}></img>
                        <div className='emp-info'>
                            <h3 className='text-align-center'>{employee.full_name}</h3>
                            <span className='emp-field'>
                                <span className='material-icons'>work</span>
                                <h4>{employee.title}</h4>
                            </span>
                            <span className='emp-field'>
                                <span className='material-icons'>email</span>
                                <a href={"mailto:" + employee.email}>{employee.email}</a>
                            </span>
                            <span className='emp-field'>
                                <span className='material-icons'>domain</span>
                                <Link to={`/departments/${employee.department_id}`}>{employee.department_name}</Link>
                            </span>
                            <div className='flex-grow-1'></div>
                            <span className='button-bar'>
                                <IconButton icon={'edit'} title={'edit'} />
                                <IconButton icon={'delete'} title={'delete'} />
                            </span>
                        </div>
                    </div>
                    :
                    <div className='w-100 h-100 text-align-center d-flex justify-content-center align-content-center'>
                        loading...
                    </div>
            }

            <Modal id={'loginModal'} isVisible={loginModalVis} dismissOnBarrier={false}>
                <h2>message</h2>
                <p>please login to continue</p>
                <IconButton icon={'login'} title='login' onClick={() => { navigate("/login"); }} />
            </Modal>
        </div>
    )
}

export default Employee