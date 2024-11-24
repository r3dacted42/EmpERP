import React, { useState, useEffect } from 'react'
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import TextInput from '../components/general/TextInput';
import IconButton from '../components/general/IconButton';

function Login() {
    const [cookies, setCookies, removeCookies] = useCookies(['username', 'token']);
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });
    const navigate = useNavigate();

    useEffect(() => {
        if (cookies.token && cookies.username) {
            let data = jwtDecode(cookies.token)
            let expTime = data.exp * 1000;
            if (Date.now() < expTime) navigate("/");
        }
    }, []);

    function onLoginSubmit(e) {
        if (e) e.preventDefault();
        fetch("http://localhost:8080/api/v1/auth/login", {
            method: "POST",
            body: JSON.stringify(formData),
            headers: {
                "Content-Type": "application/json; charset=UTF-8"
            }
        })
            .then((res) => {
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

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    }

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            onLoginSubmit();
        }
    }

    return (
        <div className='login-page'>
            <div className='login-card'>
                <h2>login</h2>
                <form onSubmit={onLoginSubmit}>
                    <TextInput icon={'alternate_email'} placeholder={'username'} id={'username'} name={'username'}
                        minLength={8} maxLength={255} onChange={handleChange} />
                    <TextInput icon={'password'} placeholder={'password'} id={'password'} name={'password'} type={'password'}
                        minLength={8} maxLength={255} onChange={handleChange} onKeyDown={handleKeyDown} />
                    <span className='d-flex justify-content-center gap-2'>
                        <IconButton icon={'login'} title='login' type='submit' />
                        <IconButton icon={'person_add'} title={null} onClick={() => navigate("/register")} />
                    </span>
                </form>
            </div>
        </div>
    )
}

export default Login