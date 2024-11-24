import React, { useEffect } from 'react'
import './Modal.css'
import IconButton from './IconButton'

function Modal({ id, title, children, showClose, toggleVis, dismissOnBarrier = true, buttons, isVisible = false }) {
    const barrierId = id + "Barrier";
    
    useEffect(() => {
        // add listeners
        if (isVisible && dismissOnBarrier) {
            const barrier = document.getElementById(barrierId);
            const barrierListener = (e) => { toggleVis() };
            barrier.addEventListener('pointerdown', barrierListener);
            return (() => {
                barrier.removeEventListener('pointerdown', barrierListener);
            })
        }
    }, [isVisible]);

    if (isVisible) {
        return (
            <div id={barrierId} className='barrier'>
                <div id={id} className='my-modal'>
                    {children}
                </div>
            </div>
        );
    }
    return <></>;
}

export default Modal