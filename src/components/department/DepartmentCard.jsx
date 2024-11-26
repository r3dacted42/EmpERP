import { useEffect, useState } from 'react'
import './DepartmentCard.css'
import IconButton from '../general/IconButton';
import useWindowDimensions from '../../hooks/useWindowDimensions';
import { useNavigate } from 'react-router-dom';

function DepartmentCard({ _model, onEdit, onDelete }) {
    const navigate = useNavigate();
    const [model, setModel] = useState(_model);
    const windowDimensions = useWindowDimensions();
    const [showButtonTitle, setShowButtonTitle] = useState(true);

    useEffect(() => {
        setShowButtonTitle(windowDimensions.width > 500);
    }, [windowDimensions]);

    useEffect(() => {
        setModel(_model);
    }, [_model]);

    return (
        <div className='department-card'>
            <h4 className='text-align-center'>{model.name}</h4>
            <span className='button-bar'>
                <div>capacity: {model.strength} / {model.capacity}</div>
                <IconButton icon={'info'} title={showButtonTitle ? 'view' : null}
                    onClick={() => navigate(`/departments/${model.department_id}`)} />
                <IconButton icon={'edit'} title={showButtonTitle ? 'edit' : null}
                    onClick={() => onEdit()} />
                <IconButton icon={'delete'} title={showButtonTitle ? 'delete' : null}
                    onClick={() => onDelete()} />
            </span>
        </div>
    )
}

export default DepartmentCard