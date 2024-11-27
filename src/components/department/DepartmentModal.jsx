import React, { useEffect, useState } from 'react'
import Modal from '../general/Modal'
import TextInput from '../general/TextInput'
import IconButton from '../general/IconButton';
import useFetchAuth from '../../hooks/useFetchAuth';

function DepartmentModal({ id, model, isVisible, toggleVis, onSave, onUnauth }) {
    const fetchAuth = useFetchAuth();
    const emptyFormData = {
        name: '',
        capacity: '',
    };
    const [formData, setFormData] = useState(emptyFormData);
    const [serverMsg, setServerMsg] = useState('');
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (model) {
            setFormData({
                name: model.name,
                capacity: model.capacity
            });
        } else {
            setFormData(emptyFormData);
        }
        setServerMsg(null);
        setSubmitting(false);
    }, [model]);

    async function onSubmit(e) {
        if (e) e.preventDefault();
        setSubmitting(true);
        setServerMsg("submitting...");
        const newFormData = {
            name: formData.name.trim(),
            capacity: formData.capacity
        };
        let res = null;
        if (model) {
            res = await fetchAuth(`/departments/${model.department_id}`, 'patch', newFormData, 'json');
            if (res == null) { onUnauth(); return; }
        } else {
            res = await fetchAuth("/departments", 'post', newFormData, 'json');
            if (res == null) { onUnauth(); return; }
        }
        let success = (res.status === 200 || res.status === 201);
        if (!success) res.text().then((j) => { setServerMsg(j); })
        setSubmitting(false);
        if (success) {
            const newModel = await res.json();
            onSave(newModel, model != null);
            setServerMsg(null);
            toggleVis();
        }
    }

    const handleChange = (e) => {
        const key = e.target.name;
        const val = e.target.value;
        setFormData({
            ...formData,
            [key]: val
        });
    }

    return (
        <Modal id={id} isVisible={isVisible} dismissOnBarrier={!submitting} toggleVis={toggleVis}>
            <h2>{model ? 'edit' : 'add'} department</h2>
            <form onSubmit={onSubmit}>
                <TextInput placeholder={'name'} id={'name'} name={'name'}
                    minLength={1} maxLength={255} onChange={handleChange} value={formData.name} required />
                <TextInput icon={'group'} placeholder={'capacity'} id={'capacity'} name={'capacity'}
                    type='number' onChange={handleChange} value={formData.capacity} required />
                <span className='d-flex justify-content-center gap-2'>
                    <IconButton icon={'save'} title='save' type='submit' disabled={submitting} />
                    <IconButton icon={'cancel'} title={'cancel'} onClick={toggleVis} disabled={submitting} />
                </span>
                <span id='server-said'>{serverMsg}</span>
            </form>
        </Modal>
    )
}

export default DepartmentModal