import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import useFetchAuth from '../hooks/useFetchAuth';
import DepartmentModel from '../models/DepartmentModel';
import DepartmentModal from '../components/department/DepartmentModal';
import DepartmentCard from '../components/department/DepartmentCard';
import Modal from '../components/general/Modal';
import Navbar from '../components/general/Navbar';
import IconButton from '../components/general/IconButton';

function AllDepartments() {
    const navigate = useNavigate();
    const fetchAuth = useFetchAuth();
    const [loginModalVis, setLoginModalVis] = useState(false);
    const [departments, setDepartments] = useState([]);
    const [currentDept, setCurrentDept] = useState(null);
    const [editModalVis, setEditModalVis] = useState(false);
    const [deleteModalVis, setDeleteModalVis] = useState(false);

    function fetchData() {
        fetchAuth("/departments", 'get')
            .then((res) => {
                if (res == null) {
                    setLoginModalVis(true);
                    return;
                }
                if (res.status === 200) {
                    res.json()
                        .then((data) => {
                            setDepartments(data.map((d) => (new DepartmentModel(d))));
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

    function onSave(data, updated) {
        const newDept = new DepartmentModel(data);
        if (updated) {
            const idx = departments.findIndex(d => d.department_id === data.department_id);
            console.log(`updating index ${idx}`);
            let newDepts = departments;
            newDepts[idx] = newDept;
            setDepartments(newDepts);
        } else {
            let newDepts = [newDept, ...departments];
            setDepartments(newDepts);
        }
    }

    async function onDelete(id) {
        let res = await fetchAuth(`/departments/${id}`, 'delete');
        if (res.status === 200) {
            let newDepts = departments;
            newDepts.splice(newDepts.findIndex(d => d.department_id === id), 1);
            setDepartments(newDepts);
            setDeleteModalVis(false);
            setCurrentDept(null);
        }
    }

    return (
        <div className='container'>
            <h2>departments</h2>
            <Navbar />

            <span className='d-flex flex-direction-row justify-content-end gap-3 mb-3'>
                <IconButton icon={'domain_add'} title='add department' onClick={() => { setCurrentDept(null); setEditModalVis(true); }} />
                <IconButton icon={'delete'} title='delete all' />
            </span>

            <div className='row row-cols-lg-2 row-cols-1 row-gap-3'>
                {departments.map((d) =>
                    <div key={d.department_id} className='col'>
                        <DepartmentCard _model={d} onEdit={() => { setCurrentDept(d); setEditModalVis(true); }}
                            onDelete={() => { setCurrentDept(d); setDeleteModalVis(true); }} />
                    </div>)}
            </div>

            <DepartmentModal id={"addEditModal"} isVisible={editModalVis} model={currentDept} toggleVis={() => { setEditModalVis(false); 
                setCurrentDept(null); }} onSave={onSave} onUnauth={() => { setLoginModalVis(true) }} />

            <Modal id={"deleteModal"} isVisible={deleteModalVis}
                toggleVis={() => { setDeleteModalVis(false); setCurrentDept(null); }} onRefresh={() => fetchData()}>
                <h2>delete</h2>
                <p>are you sure you want to delete {currentDept ? currentDept.name : ''} ({currentDept ? currentDept.department_id : ''})?<br></br>
                all employees in the department will also be deleted!</p>
                <span className='d-flex justify-content-center gap-2'>
                    <IconButton icon={'delete'} title='confirm' onClick={() => { onDelete(currentDept.department_id); }} />
                    <IconButton icon={'cancel'} title={'cancel'} onClick={() => { setDeleteModalVis(false); setCurrentDept(null); }} />
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

export default AllDepartments