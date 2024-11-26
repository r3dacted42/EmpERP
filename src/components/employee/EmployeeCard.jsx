import { useEffect, useState } from 'react'
import './EmployeeCard.css'
import IconButton from '../general/IconButton';
import useWindowDimensions from '../../hooks/useWindowDimensions';
import { useNavigate } from 'react-router-dom';

function EmployeeCard({ _model, onEdit, onDelete }) {
    const navigate = useNavigate();
    const [model, setModel] = useState(_model);
    const windowDimensions = useWindowDimensions();
    const [showButtonTitle, setShowButtonTitle] = useState(true);

    useEffect(() => {
        setShowButtonTitle(windowDimensions.width > 500);
    }, [windowDimensions]);

    useEffect(() => {
        setModel(_model);
        const newUrl = `${_model.photo_url}?ver=${new Date().getTime()}`;
        console.log(`setting photo url to ${newUrl}`);
        document.getElementById(`${model.employee_id}photo`).src = newUrl;
    }, [_model]);

    return (
        <div className='employee-card'>
            <img src={model.photo_url} id={`${model.employee_id}photo`} onError={(e) => {
                e.target.onerror = null;
                e.target.src = `${process.env.PUBLIC_URL}/images/profile.png`;
            }} alt={model.employee_id + "'s photo"}></img>
            <div className='emp-intro'>
                <h4 className='text-align-center'>{model.full_name}</h4>
                <div>{model.title}</div>
                <div className='flex-grow-1'></div>
                <span className='button-bar'>
                    <IconButton icon={'info'} title={showButtonTitle ? 'view' : null}
                        onClick={() => navigate(`/${model.employee_id}`)} />
                    <IconButton icon={'edit'} title={showButtonTitle ? 'edit' : null}
                        onClick={() => onEdit()} />
                    <IconButton icon={'delete'} title={showButtonTitle ? 'delete' : null}
                        onClick={() => onDelete()} />
                </span>
            </div>
        </div>
    )
}

export default EmployeeCard