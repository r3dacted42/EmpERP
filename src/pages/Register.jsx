import React, { useState, useEffect } from 'react'
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import TextInput from '../components/TextInput';
import IconButton from '../components/IconButton';

function Register() {
    const [cookies, setCookies, removeCookies] = useCookies(['username', 'token']);
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });
    const navigate = useNavigate();
    const [timeoutId, setTimeoutId] = useState(null);
    const [unameStatus, setUnameStatus] = useState(null);

    useEffect(() => {
        if (cookies.token && cookies.username) {
            let data = jwtDecode(cookies.token)
            let expTime = data.exp * 1000;
            if (Date.now() < expTime) navigate("/");
        }
    }, []);

    function onRegisterSubmit(e) {
        if (e) e.preventDefault();
        if (!unameStatus) {
            alert("please choose a username that's available");
            return;
        }
        fetch("http://localhost:8080/api/v1/auth/register", {
            method: "POST",
            body: JSON.stringify(formData),
            headers: {
                "Content-Type": "application/json; charset=UTF-8"
            }
        })
            .then((res) => {
                if (!res) return;
                if (res.status === 200) {
                    // success
                    res.json()
                        .then((res) => {
                            setCookies('username', res.username, { path: '/' })
                            setCookies('token', res.token, { path: '/' })
                            navigate("/");
                        })
                } else {
                    res.text()
                        .then((msg) => {
                            alert(msg);
                        })
                }
            });
    }

    async function checkUsernameAvailable(uname) {
        if (uname === '') return false;
        let res = await fetch(`http://localhost:8080/api/v1/auth/username-available?username=${uname}`);
        if (res.status === 200) {
            let txt = await res.text();
            if (txt === 'true') {
                setUnameStatus(true);
                return true;
            } else {
                setUnameStatus(false);
                return false;
            }
        }
        return false;
    }

    const handleChange = (e) => {
        const key = e.target.name;
        const val = e.target.value.trim();
        setFormData({
            ...formData,
            [key]: val
        });
        setUnameStatus(null);
        if (e.target.name === 'username') {
            clearTimeout(timeoutId);
            setTimeoutId(setTimeout(() => checkUsernameAvailable(val), 1000));
        }
    }

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            onRegisterSubmit();
        }
    }

    return (
        <div className='login-page'>
            <div className='login-card'>
                <h2>register</h2>
                <form onSubmit={onRegisterSubmit}>
                    <TextInput icon={'alternate_email'} placeholder={'username'} id={'username'} name={'username'}
                        minLength={8} maxLength={255} iconEnd={(unameStatus == null ? 'pending' : (unameStatus ? 'check_circle' : 'cancel'))} 
                        onChange={handleChange} iconEndColor={(unameStatus == null ? 'grey' : (unameStatus ? 'green' : 'red'))}
                        iconEndHover={(unameStatus == null ? 'enter a username to check availability' 
                        : (unameStatus ? 'username available' : 'username taken'))} required />
                    <span id='available'></span>
                    <TextInput icon={'password'} placeholder={'password'} id={'password'} name={'password'} type={'password'}
                        minLength={8} maxLength={255} onChange={handleChange} onKeyDown={handleKeyDown} required />
                    <span className='d-flex justify-content-center gap-2'>
                        <IconButton icon={'arrow_back'} title={null} onClick={() => navigate("/login")} />
                        <IconButton icon={'person_add'} title='register' type='submit' />
                    </span>
                </form>
            </div>
        </div>
    )
}

export default Register