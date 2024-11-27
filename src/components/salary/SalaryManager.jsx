import { useEffect, useState } from 'react'
import useFetchAuth from '../../hooks/useFetchAuth';
import EmployeeSalaryModel from '../../models/EmployeeSalaryModel';
import './SalaryManager.css';
import IconButton from '../general/IconButton';
import SalaryModal from './SalaryModal';

function SalaryManager({ employee_id, onUnAuth }) {
    const [salaries, setSalaries] = useState([]);
    const fetchAuth = useFetchAuth();
    const [addModalVis, setAddModalVis] = useState(false);

    async function fetchData() {
        const res = await fetchAuth(`/salaries?employee_id=${employee_id}`, 'get');
        if (res == null) { onUnAuth(); return; }
        if (res.status === 200) {
            const data = await res.json();
            setSalaries(data.map(d => new EmployeeSalaryModel(d)));
        }
    }

    useEffect(() => {
        if (employee_id != null) fetchData();
    }, [employee_id])

    async function onDelete(id) {
        let res = await fetchAuth(`/salaries/${id}`, 'delete');
        if (res.status === 200) setSalaries((salaries) => salaries.filter((s) => s.id !== id));
    }

    return (
        <div className='salary-manager container'>
            <div className='top-bar'>
                <h4>employee salaries</h4>
                <span className='flex-grow-1'></span>
                <IconButton icon={'playlist_add'} title='add' onClick={() => setAddModalVis(true)} />
            </div>
            {
                salaries.length > 0
                    ?
                    <table className='w-100'>
                        <thead style={{ borderBottom: '1px solid gray' }}>
                            <tr>
                                <td><h6>payment date</h6></td>
                                <td><h6>amount</h6></td>
                                <td><h6>description</h6></td>
                                <td></td>
                            </tr>
                        </thead>
                        <tbody className='pt-3'>
                            {salaries.map((s) =>
                                <tr key={s.id}>
                                    <td>{s.payment_date}</td>
                                    <td>{s.amount}</td>
                                    <td className='flex-grow-1'>{s.description}</td>
                                    <td className='d-flex justify-content-end'>
                                        <IconButton icon={'delete'} title={null} onClick={() => onDelete(s.id)} />
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                    :
                    <span className='m-3 text-align-center row'>no data</span>
            }

            <SalaryModal modalId={"addEditSalaryModal"} employee_id={employee_id} isVisible={addModalVis}
                toggleVis={() => setAddModalVis(false)} onSave={fetchData} onUnauth={onUnAuth} />
        </div>
    )
}

export default SalaryManager