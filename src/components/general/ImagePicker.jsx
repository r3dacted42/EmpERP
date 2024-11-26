import { useState, useRef, useEffect } from 'react';
import './ImagePicker.css';
import IconButton from './IconButton';

function ImagePicker({ inputId, currentImgPath, ...inputProps }) {
    const defaultImgPath = `${process.env.PUBLIC_URL}/images/profile.png`;
    const [imgUrl, setImageUrl] = useState(currentImgPath ?? defaultImgPath);

    useEffect(() => {
        if (currentImgPath == null || currentImgPath === '')
            setImageUrl(defaultImgPath)
    }, [currentImgPath]);

    function handleImageChange(e) {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onload = () => {
            setImageUrl(reader.result);
        };
        reader.readAsDataURL(file);
    };

    function openSelector(e) {
        e.stopPropagation();
        document.getElementById(inputId).click();
    }

    function clearImage(e) {
        e.stopPropagation();
        setImageUrl(defaultImgPath);
        document.getElementById(inputId).value = null;
    }

    return (
        <div className='image-picker'>
            <img src={imgUrl} alt='selected/existing image' onError={(e) => {
                e.target.src = `${process.env.PUBLIC_URL}/images/profile.png`;
            }}></img>
            <input className='d-none' id={inputId} type='file' onChange={handleImageChange} {...inputProps}></input>
            <div className='button-bar'>
                <IconButton type='button' icon={'photo_library'} title='select' onClick={openSelector} />
                <IconButton type='button' icon={'clear'} title='clear' onClick={clearImage} />
            </div>
        </div>
    )
}

export default ImagePicker