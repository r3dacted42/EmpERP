import React, { useEffect, useState } from 'react'
import Modal from '../general/Modal'
import TextInput from '../general/TextInput'
import IconButton from '../general/IconButton';
import useFetchAuth from '../../hooks/useFetchAuth';

function EmployeeModal({ id, model, isVisible, toggleVis, onSave, onUnauth }) {
    const fetchAuth = useFetchAuth();
    const [formData, setFormData] = useState({
        employee_id: '',
        first_name: '',
        last_name: '',
        email: '',
        title: '',
        department_id: ''
    });
    const [timeoutId, setTimeoutId] = useState(null);
    const [empidStatus, setEmpidStatus] = useState(null);
    const [serverMsg, setServerMsg] = useState('');

    useEffect(() => {
        if (model) {
            setFormData({
                employee_id: model.employee_id,
                first_name: model.first_name,
                last_name: model.last_name,
                email: model.email,
                title: model.title,
                department_id: model.department_id
            })
            setEmpidStatus(true);
        }
    }, [model]);

    function onSubmit(e) {
        if (e) e.preventDefault();
        if (!empidStatus) return;
        const newFormData = {};
        for (let k in formData) newFormData[k] = formData[k].trim();
        setFormData(newFormData); 
        if (model) {
            fetchAuth(`/employees/${model.id}`, 'patch', formData)
                .then((res) => {
                    if (res == null) {
                        onUnauth();
                        return;
                    }
                    if (res.status === 200) {
                        onSave(formData, true);
                        toggleVis();
                    }
                })
        } else {
            fetchAuth("/employees", 'post', formData)
                .then((res) => {
                    if (res == null) {
                        onUnauth();
                        return;
                    }
                    if (res.status === 201) {
                        onSave(formData, false);
                        toggleVis();
                    } else {
                        res.text().then((j) => {
                            setServerMsg(j);
                        })
                    }
                })
        }
    }

    async function checkEmployeeIdAvailable(empid) {
        if (empid === '') return false;
        if (model && empid === model.employee_id) {
            setEmpidStatus(true);
            return true;
        }
        const reqUrl = `/employees/id-available?id=${empid}`;
        let res = await fetchAuth(reqUrl, 'get', null, null);
        if (res == null) {
            onUnauth();
            return;
        }
        if (res.status === 200) {
            let txt = await res.text();
            if (txt === 'true') {
                setEmpidStatus(true);
                return true;
            } else {
                setEmpidStatus(false);
                return false;
            }
        }
        return false;
    }

    const handleChange = (e) => {
        const key = e.target.name;
        const val = e.target.value;
        setFormData({
            ...formData,
            [key]: val
        });
        if (e.target.name === 'employee_id') {
            setEmpidStatus(null);
            clearTimeout(timeoutId);
            setTimeoutId(setTimeout(() => checkEmployeeIdAvailable(val), 1000));
        }
    }

    return (
        <Modal id={id} isVisible={isVisible} dismissOnBarrier={true} toggleVis={toggleVis}>
            <h2>{model ? 'edit' : 'add'} employee</h2>
            <form onSubmit={onSubmit}>
                <TextInput placeholder={'employee id'} id={'employee_id'} name={'employee_id'}
                    minLength={3} maxLength={255} onChange={handleChange} value={formData.employee_id}
                    iconEnd={(empidStatus == null ? 'pending' : (empidStatus ? 'check_circle' : 'cancel'))}
                    iconEndColor={(empidStatus == null ? 'grey' : (empidStatus ? 'green' : 'red'))}
                    iconEndHover={(empidStatus == null ? 'enter a username to check availability'
                        : (empidStatus ? 'username available' : 'username taken'))} required />
                <TextInput placeholder={'first name'} id={'first_name'} name={'first_name'}
                    minLength={1} maxLength={255} onChange={handleChange} value={formData.first_name} required />
                <TextInput placeholder={'last name'} id={'last_name'} name={'last_name'}
                    maxLength={255} onChange={handleChange} value={formData.last_name} />
                <TextInput placeholder={'title'} id={'title'} name={'title'}
                    minLength={3} maxLength={255} onChange={handleChange} value={formData.title} required />
                <TextInput type='email' placeholder={'email'} id={'email'} name={'email'}
                    onChange={handleChange} value={formData.email} required />
                <TextInput placeholder={'department id'} id={'department_id'} name={'department_id'}
                    onChange={handleChange} value={formData.department_id} />
                <span className='d-flex justify-content-center gap-2'>
                    <IconButton icon={'save'} title='save' type='submit' />
                    <IconButton icon={'cancel'} title={'cancel'} onClick={toggleVis} />
                </span>
                <span id='server-said'>{serverMsg}</span>
            </form>
        </Modal>
    )
}

export default EmployeeModal