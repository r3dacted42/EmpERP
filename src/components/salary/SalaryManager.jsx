import { useEffect, useState } from 'react'
import useFetchAuth from '../../hooks/useFetchAuth';
import EmployeeSalaryModel from '../../models/EmployeeSalaryModel';
import './SalaryManager.css';
import IconButton from '../general/IconButton';
import SalaryModal from './SalaryModal';

function SalaryManager({ employee_id, onUnAuth }) {
    const [salaries, setSalaries] = useState([]);
    const fetchAuth = useFetchAuth();
    const [currentSalary, setCurrentSalary] = useState(null);
    const [addModalVis, setAddModalVis] = useState(false);

    async function fetchData() {
        const res = await fetchAuth(`/salaries?employee_id=${employee_id}`, 'get');
        if (res == null) {
            onUnAuth();
            return;
        }
        if (res.status === 200) {
            const data = await res.json();
            setSalaries(data.map(d => new EmployeeSalaryModel(d)));
            console.log(data);
        }
    }

    useEffect(() => {
        if (employee_id != null) {
            fetchData();
        }
        console.log("employee id: " + employee_id);
    }, [employee_id])

    function onSave(data, updated) {
        const newSalary = new EmployeeSalaryModel(data);
        if (updated) {
            const idx = salaries.findIndex(e => e.employee_id === data.employee_id);
            console.log(`updating index ${idx}`);
            let newSalaries = salaries;
            newSalaries[idx] = newSalary;
            setSalaries(newSalaries);
        } else {
            newSalary.payment_date = newSalary.payment_date.substring(0, 10);
            let newSalaries = [newSalary, ...salaries];
            setSalaries(newSalaries);
        }
    }

    async function onDelete(id) {
        let res = await fetchAuth(`/salaries/${id}`, 'delete');
        if (res.status === 200) {
            let newSalaries = salaries;
            newSalaries.splice(newSalaries.findIndex(e => e.id === id), 1);
            setSalaries(newSalaries);
        }
        res.text().then((t) => alert(t));
    }

    return (
        <div className='salary-manager container'>
            <div className='top-bar'>
                <h4>employee salaries</h4>
                <span className='flex-grow-1'></span>
                <IconButton icon={'playlist_add'} title='add' onClick={() => setAddModalVis(true)} />
                <IconButton icon={'delete'} title='delete all' />
            </div>
            {
                salaries.length > 0
                    ?
                    <table className='w-100'>
                        <thead style={{ borderBottom: '1px solid gray', paddingBottom: '8px' }}>
                            <tr>
                                <td><h6>payment date</h6></td>
                                <td><h6>amount</h6></td>
                                <td><h6>description</h6></td>
                                <td></td>
                            </tr>
                        </thead>
                        <tbody className='pt-3'>
                            {salaries.map((s, idx) =>
                                <tr key={s.id || idx}>
                                    <td>{s.payment_date}</td>
                                    <td>{s.amount}</td>
                                    <td className='flex-grow-1'>{s.description}</td>
                                    <td><IconButton icon={'delete'} title={null} onClick={() => { onDelete(s.id) }} /></td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                    :
                    <span className='m-3 text-align-center'>no data</span>
            }

            <SalaryModal modalId={"addEditSalaryModal"} employee_id={employee_id} isVisible={addModalVis} model={currentSalary}
                toggleVis={() => {
                    setAddModalVis(false);
                    setCurrentSalary(null);
                }} onSave={onSave} onUnauth={onUnAuth} />
        </div>
    )
}

export default SalaryManager