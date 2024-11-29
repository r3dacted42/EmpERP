import React, { useEffect, useState } from 'react'
import Modal from '../general/Modal'
import TextInput from '../general/TextInput'
import IconButton from '../general/IconButton';
import useFetchAuth from '../../hooks/useFetchAuth';
import DepartmentSelect from '../department/DepartmentSelect';
import ImagePicker from '../general/ImagePicker';

function EmployeeModal({ id, model, isVisible, toggleVis, onSave, onUnauth }) {
    const fetchAuth = useFetchAuth();
    const emptyFormData = {
        employee_id: '',
        first_name: '',
        last_name: '',
        email: '',
        title: '',
        department_id: ''
    };
    const [formData, setFormData] = useState(emptyFormData);
    const [timeoutId, setTimeoutId] = useState(null);
    const [empidStatus, setEmpidStatus] = useState(null);
    const [serverMsg, setServerMsg] = useState('');
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (model) {
            setFormData({
                employee_id: model.employee_id,
                first_name: model.first_name,
                last_name: model.last_name,
                email: model.email,
                title: model.title,
                department_id: model.department_id
            });
            setEmpidStatus(true);
        } else {
            setFormData(emptyFormData);
            setEmpidStatus(null);
        }
        setServerMsg(null);
        setSubmitting(false);
    }, [model]);

    async function onSubmit(e) {
        if (e) e.preventDefault();
        setSubmitting(true);
        setServerMsg("submitting...");
        const newFormData = Object.keys(formData).reduce((trimmed, key) => {
            const val = formData[key];
            trimmed[key] = typeof val === 'string' ? val.trim() : val;
            return trimmed;
        }, {});
        let res = null;
        if (model) {
            res = await fetchAuth(`/employees/${model.id}`, 'patch', newFormData, 'json');
            if (res == null) { onUnauth(); return; }
        } else {
            res = await fetchAuth("/employees", 'post', newFormData, 'json');
            if (res == null) { onUnauth(); return; }
        }
        let success = (res.status === 200 || res.status === 201);
        if (!success) res.text().then((j) => { setServerMsg(j); })
        else {
            // send image
            const newModel = await res.json(); // get id of updated/newly created employee
            const fdata = new FormData(e.target);
            const photo = fdata.get('photo');
            if (photo.name === '' || photo.size === 0)
                res = await fetchAuth(`/employees/${newModel.id}/photo`, 'patch');
            else
                res = await fetchAuth(`/employees/${newModel.id}/photo`, 'patch', fdata.get('photo'), 'file');
            if (res.status === 200) {
                onSave(newModel, model != null);
            } else {
                success = false;
            }
            res.text().then((j) => {
                setServerMsg(j);
            })
        }
        setSubmitting(false);
        if (success) {
            setServerMsg(null);
            setFormData(emptyFormData);
            setEmpidStatus(null);
            toggleVis();
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
        <Modal id={id} isVisible={isVisible} dismissOnBarrier={!submitting} toggleVis={toggleVis}>
            <h2>{model ? 'edit' : 'add'} employee</h2>
            <form onSubmit={onSubmit}>
                <ImagePicker inputId={'photo'} name={'photo'} currentImgPath={model ? model.photo_url : null} />
                <TextInput icon={'alternate_email'} placeholder={'employee id'} id={'employee_id'} name={'employee_id'}
                    minLength={3} maxLength={255} onChange={handleChange} value={formData.employee_id}
                    iconEnd={(empidStatus == null ? 'pending' : (empidStatus ? 'check_circle' : 'cancel'))}
                    iconEndColor={(empidStatus == null ? 'grey' : (empidStatus ? 'green' : 'red'))}
                    iconEndHover={(empidStatus == null ? 'enter a username to check availability'
                        : (empidStatus ? 'username available' : 'username taken'))} required />
                <TextInput placeholder={'first name'} id={'first_name'} name={'first_name'}
                    minLength={1} maxLength={255} onChange={handleChange} value={formData.first_name} required />
                <TextInput placeholder={'last name'} id={'last_name'} name={'last_name'}
                    maxLength={255} onChange={handleChange} value={formData.last_name} />
                <TextInput icon={'work'} placeholder={'title'} id={'title'} name={'title'}
                    minLength={3} maxLength={255} onChange={handleChange} value={formData.title} required />
                <TextInput icon={'mail'} type='email' placeholder={'email'} id={'email'} name={'email'}
                    onChange={handleChange} value={formData.email} required />
                <DepartmentSelect placeholder={'department id'} id={'department_id'} name={'department_id'}
                    onChange={handleChange} currentValue={formData.department_id} onUnauth={onUnauth} />
                <span className='d-flex justify-content-center gap-2'>
                    <IconButton icon={'save'} title='save' type='submit' disabled={submitting} />
                    <IconButton icon={'cancel'} title={'cancel'} onClick={toggleVis} disabled={submitting} />
                </span>
                <span id='server-said'>{serverMsg}</span>
            </form>
        </Modal>
    )
}

export default EmployeeModal