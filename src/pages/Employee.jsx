import React, { useEffect, useState } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import useFetchAuth from '../hooks/useFetchAuth';
import Navbar from '../components/general/Navbar';
import Modal from '../components/general/Modal';
import IconButton from '../components/general/IconButton';
import EmployeeModel from '../models/EmployeeModel';
import EmployeeModal from '../components/employee/EmployeeModal';
import SalaryManager from '../components/salary/SalaryManager';
import Footer from '../components/general/Footer';

function Employee() {
    const navigate = useNavigate();
    const { employee_id } = useParams();
    const fetchAuth = useFetchAuth();
    const [loginModalVis, setLoginModalVis] = useState(false);
    const [employee, setEmployee] = useState(null);
    const [editModalVis, setEditModalVis] = useState(false);
    const [deleteModalVis, setDeleteModalVis] = useState(false);

    function fetchData() {
        fetchAuth(`/employees/${employee_id}`, 'get', null, null)
            .then((res) => {
                if (res == null) {
                    setLoginModalVis(true);
                    return;
                }
                if (res.status === 200) {
                    res.json()
                        .then((data) => {
                            const emp = new EmployeeModel(data);
                            emp.photo_url = emp.photo_url + `${new Date().getMilliseconds()}`;
                            setEmployee(emp);
                            setEditModalVis(false);
                            setDeleteModalVis(false);
                        });
                } else {
                    res.text()
                        .then((txt) => {
                            alert(txt);
                        });
                }
            });
    }

    useEffect(() => {
        fetchData();
    }, []);

    async function onDelete() {
        let res = await fetchAuth(`/employees/${employee.id}`, 'delete');
        if (res.status === 200) {
            navigate("/");
        }
    }

    return (
        <div className='container'>
            <h2>{employee_id}</h2>
            <Navbar />

            {
                employee
                    ?
                    <div className='employee-page'>
                        <img src={employee.photo_url} onError={(e) => {
                            e.target.src = `${process.env.PUBLIC_URL}/images/profile.png`;
                        }} alt={employee.employee_id + "'s photo"}></img>
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
                                <IconButton icon={'edit'} title={'edit'} onClick={() => setEditModalVis(true)} />
                                <IconButton icon={'delete'} title={'delete'} onClick={() => setDeleteModalVis(true)} />
                            </span>
                        </div>
                    </div>
                    :
                    <div className='w-100 h-100 text-align-center d-flex justify-content-center align-content-center'>
                        loading...
                    </div>
            }

            <SalaryManager employee_id={employee ? employee.id : null} onUnAuth={() => setLoginModalVis(true)} />

            <EmployeeModal id={"addEditModal"} isVisible={editModalVis} model={employee}
                toggleVis={() => { setEditModalVis(false); }} onSave={(d) => { 
                    setEmployee(null); 
                    fetchData();
                    navigate(`/${d.employee_id}`); 
                }} 
                onUnauth={() => setLoginModalVis(true)} />

            <Modal id={"deleteModal"} isVisible={deleteModalVis}
                toggleVis={() => { setDeleteModalVis(false); }}>
                <h2>delete</h2>
                <p>are you sure you want to delete {employee ? employee.full_name : ''} ({employee ? employee.employee_id : ''})?</p>
                <span className='d-flex justify-content-center gap-2'>
                    <IconButton icon={'delete'} title='confirm' onClick={onDelete} />
                    <IconButton icon={'cancel'} title={'cancel'} onClick={() => { setDeleteModalVis(false) }} />
                </span>
            </Modal>

            <Modal id={'loginModal'} isVisible={loginModalVis} dismissOnBarrier={false}>
                <h2>message</h2>
                <p>please login to continue</p>
                <IconButton icon={'login'} title='login' onClick={() => { navigate("/login"); }} />
            </Modal>

            <Footer />
        </div>
    )
}

export default Employee