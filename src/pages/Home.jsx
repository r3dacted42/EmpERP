import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import useFetchAuth from '../hooks/useFetchAuth';
import Navbar from '../components/general/Navbar';
import Modal from '../components/general/Modal';
import IconButton from '../components/general/IconButton';
import EmployeeModel from '../models/EmployeeModel';
import EmployeeCard from '../components/employee/EmployeeCard';
import EmployeeModal from '../components/employee/EmployeeModal';

function Home() {
    const navigate = useNavigate();
    const fetchAuth = useFetchAuth();
    const [loginModalVis, setLoginModalVis] = useState(false);
    const [employees, setEmployees] = useState([]);
    const [currentEmp, setCurrentEmp] = useState(null);
    const [editModalVis, setEditModalVis] = useState(false);
    const [deleteModalVis, setDeleteModalVis] = useState(false);

    function fetchData() {
        fetchAuth("/employees", 'get', null, null)
            .then((res) => {
                if (res == null) {
                    setLoginModalVis(true);
                    return;
                }
                if (res.status === 200) {
                    res.json()
                        .then((data) => {
                            setEmployees(data.map((d) => (new EmployeeModel(d))));
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

    return (
        <div className='container'>
            <h2>employees</h2>
            <Navbar />

            <span className='d-flex flex-direction-row justify-content-end gap-3 mb-3'>
                <IconButton icon={'person_add'} title='add employee' onClick={() => { setCurrentEmp(null); setEditModalVis(true); }} />
                <IconButton icon={'delete'} title='delete all' />
            </span>

            <div className='row row-cols-lg-2 row-cols-1 row-gap-3'>
                {employees.map((e) =>
                    <div key={e.id} className='col'>
                        <EmployeeCard _model={e} onEdit={() => { setCurrentEmp(e); setEditModalVis(true); }}
                            onDelete={() => { setCurrentEmp(e); setDeleteModalVis(true); }} />
                    </div>)}
            </div>

            <EmployeeModal id={"addEditModal"} isVisible={editModalVis} model={currentEmp}
                toggleVis={() => { setEditModalVis(false); setCurrentEmp(null); }} onSave={(d, updated) => {
                    const newEmp = new EmployeeModel(d);
                    if (updated) {
                        const idx = employees.findIndex((e) => e.employee_id = d.employee_id);
                        newEmp.id = employees[idx].id;
                        newEmp.photo_url = employees[idx].photo_url;
                        let newEmps = employees;
                        newEmps[idx] = newEmp;
                        setEmployees(newEmps);
                    } else {
                        let newEmps = [newEmp, ...employees];
                        setEmployees(newEmps);
                    }
                }} onUnauth={() => { setLoginModalVis(true) }} />

            <Modal id={"deleteModal"} isVisible={deleteModalVis}
                toggleVis={() => { setDeleteModalVis(false); setCurrentEmp(null); }} onRefresh={() => fetchData()}>
                <h2>delete</h2>
                <p>are you sure you want to delete {currentEmp ? currentEmp.full_name : ''} ({currentEmp ? currentEmp.employee_id : ''})?</p>
                <span className='d-flex justify-content-center gap-2'>
                    <IconButton icon={'delete'} title='confirm' onClick={() => { /* delete one */ }} />
                    <IconButton icon={'cancel'} title={'cancel'} onClick={() => { setDeleteModalVis(false); setCurrentEmp(null); }} />
                </span>
            </Modal>

            <Modal id={'loginModal'} isVisible={loginModalVis} dismissOnBarrier={false}>
                <h2>message</h2>
                <p>please login to continue</p>
                <IconButton icon={'login'} title='login' onClick={() => { navigate("/login"); }} />
            </Modal>
        </div>
    )
}

export default Home