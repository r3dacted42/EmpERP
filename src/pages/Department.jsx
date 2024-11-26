import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import useFetchAuth from '../hooks/useFetchAuth';
import DepartmentModel from '../models/DepartmentModel';
import EmployeeModel from '../models/EmployeeModel';
import DepartmentModal from '../components/department/DepartmentModal';
import Modal from '../components/general/Modal';
import IconButton from '../components/general/IconButton';
import Navbar from '../components/general/Navbar';

function Department() {
    const navigate = useNavigate();
    const { department_id } = useParams();
    const fetchAuth = useFetchAuth();
    const [loginModalVis, setLoginModalVis] = useState(false);
    const [department, setDepartment] = useState(null);
    const [editModalVis, setEditModalVis] = useState(false);
    const [deleteModalVis, setDeleteModalVis] = useState(false);
    const [employees, setEmployees] = useState([]);

    function fetchData() {
        fetchAuth(`/departments/${department_id}`, 'get')
            .then((res) => {
                if (res == null) {
                    setLoginModalVis(true);
                    return;
                }
                if (res.status === 200) {
                    res.json()
                        .then((data) => {
                            setDepartment(new DepartmentModel(data));
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
        fetchAuth(`/departments/${department_id}/employees`, 'get')
            .then((res) => {
                if (res == null) {
                    setLoginModalVis(true);
                    return;
                }
                if (res.status === 200) {
                    res.json()
                        .then((data) => {
                            setEmployees(data.map((d) => (new EmployeeModel(d))));
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
        let res = await fetchAuth(`/departments/${department.department_id}`, 'delete');
        if (res.status === 200) {
            navigate("/");
        }
    }

    return (
        <div className='container'>
            <h2>{department ? department.name : '...'}</h2>
            <Navbar />

            {
                department
                    ?
                    <div className='department-page'>
                        <div className='department-info'>
                            <h3 className='text-align-center'>{department.name}</h3>
                            <div className='dept-field'>
                                <span className='material-icons'>tag</span>
                                capacity: {department.capacity}
                            </div>
                            <div className='dept-field'>
                                <span className='material-icons'>person</span>
                                strength: {department.strength}
                            </div>
                            <span className='button-bar'>
                                <IconButton icon={'edit'} title={'edit'}
                                    onClick={() => { setEditModalVis(true); }} />
                                <IconButton icon={'delete'} title={'delete'}
                                    onClick={() => { setDeleteModalVis(true); }} />
                            </span>
                        </div>
                        {
                            employees != []
                                ?
                                <>
                                    <h4>employees</h4>
                                    {employees.map((e) =>
                                        <div key={e.employee_id}>
                                            <Link to={`/${e.employee_id}`}>{e.full_name} ({e.employee_id})</Link>
                                        </div>
                                    )}
                                </>
                                :
                                null
                        }
                    </div>
                    :
                    <div className='w-100 h-100 text-align-center d-flex justify-content-center align-content-center'>
                        loading...
                    </div>
            }


            <DepartmentModal id={"addEditModal"} isVisible={editModalVis} model={department}
                toggleVis={() => { setEditModalVis(false); }} onSave={(d) => navigate(`/${d.department_id}`)} onUnauth={() => setLoginModalVis(true)} />

            <Modal id={"deleteModal"} isVisible={deleteModalVis}
                toggleVis={() => { setDeleteModalVis(false); }}>
                <h2>delete</h2>
                <p>are you sure you want to delete {department ? department.name : ''} ({department ? department.department_id : ''})?<br></br>
                    all employees in the department will also be deleted!</p>
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
        </div>
    )
}

export default Department