import React, { useEffect, useState } from 'react'
import Modal from '../general/Modal'
import TextInput from '../general/TextInput'
import IconButton from '../general/IconButton';
import useFetchAuth from '../../hooks/useFetchAuth';
import DatePicker from '../general/DatePicker';

function SalaryModal({ modalId, employee_id, isVisible, toggleVis, onSave, onUnauth }) {
    const fetchAuth = useFetchAuth();
    const emptyFormData = {
        employee_id: employee_id,
        payment_date: new Date().toISOString().substring(0, 10),
        amount: '',
        description: ''
    };
    const [formData, setFormData] = useState(emptyFormData);
    const [serverMsg, setServerMsg] = useState('');
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        setFormData(emptyFormData);
        setServerMsg(null);
        setSubmitting(false);
    }, [employee_id, isVisible]);

    async function onSubmit(e) {
        if (e) e.preventDefault();
        setSubmitting(true);
        setServerMsg("submitting...");
        let res = await fetchAuth("/salaries", 'post', formData, 'json');
        if (res == null) { onUnauth(); return; }
        let success = (res.status === 200 || res.status === 201);
        if (!success) res.text().then((j) => { setServerMsg(j); })
        setSubmitting(false);
        if (success) {
            const newModel = await res.json();
            onSave(newModel);
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
        <Modal id={modalId} isVisible={isVisible} dismissOnBarrier={!submitting} toggleVis={toggleVis}>
            <h2>add salary</h2>
            <form onSubmit={onSubmit}>
                <DatePicker id={'payment_date'} name={'payment_date'} onChange={(d) => setFormData({
                    ...formData,
                    payment_date: d
                })} />
                <TextInput placeholder={'amount'} id={'amount'} name={'amount'} icon={'currency_rupee'}
                    type='number' onChange={handleChange} value={formData.amount} required />
                <TextInput placeholder={'description'} id={'description'} name={'description'} icon={'info'}
                    type='text' onChange={handleChange} value={formData.description} />
                <span className='d-flex justify-content-center gap-2'>
                    <IconButton icon={'save'} title='save' type='submit' disabled={submitting} />
                    <IconButton icon={'cancel'} title={'cancel'} onClick={toggleVis} disabled={submitting} />
                </span>
                <span id='server-said'>{serverMsg}</span>
            </form>
        </Modal>
    )
}

export default SalaryModal