import { useEffect, useState } from 'react';
import useFetchAuth from '../../hooks/useFetchAuth';
import DepartmentModel from '../../models/DepartmentModel';
import './DepartmentSelect.css';

function DepartmentSelect({ currentValue, onChange, onUnauth, ...selectProps }) {
    const [models, setModels] = useState([]);
    const fetchAuth = useFetchAuth();

    function fetchData() {
        fetchAuth("/departments", 'get', null, null)
            .then((res) => {
                if (res == null) {
                    onUnauth();
                    return;
                }
                if (res.status === 200) {
                    res.json().then((d) => {
                        setModels(d.map((dpt) => new DepartmentModel(dpt)));
                    })
                } else {
                    setModels(null);
                }
            })
    }

    useEffect(() => {
        fetchData();
    }, [])

    return (
        <div className='dept-select'>
            <select value={currentValue} onChange={(e) => onChange(e)}
                {...selectProps}>
                <option key={'selDept'} value={null} hidden>department</option>
                {models ? models.map((d) =>
                (<option key={'dept' + d.department_id} value={d.department_id}>
                    {d.name} ({d.strength} / {d.capacity})
                </option>)) : ''}
            </select>
        </div>
    )
}

export default DepartmentSelect