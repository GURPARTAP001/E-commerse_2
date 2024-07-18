import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../Config';
import './Auth.css';

const Login = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [successMsg, setSuccessMsg] = useState('');
    const [errorMsg, setErrorMsg] = useState('');

    const handleLogin = (e) => {
        e.preventDefault();
        auth.signInWithEmailAndPassword(email, password).then(() => {
            setSuccessMsg('Login Successful. You will now be redirected to the Home page.');
            setEmail('');
            setPassword('');
            setErrorMsg('');
            setTimeout(() => {
                setSuccessMsg('');
                navigate('/');
            }, 500);
        }).catch(error => setErrorMsg(error.message));
    };

    return (
        <div className="main_man">
        <div className="auth-container">
            <div className="auth-left">
                <h2>Welcome Back!</h2>
                <p>To keep connected with us please login with your personal info</p>
                <Link to="/signup">
                    <button className="ghost-button">Sign Up</button>
                </Link>
            </div>
            <div className="auth-right">
                <form className="auth-form" onSubmit={handleLogin}>
                    <h2>Login</h2>
                    {successMsg && <div className="success-msg">{successMsg}</div>}
                    {errorMsg && <div className="error-msg">{errorMsg}</div>}
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <button type="submit">Login</button>
                </form>
            </div>
        </div>

    </div>
    );
};

export default Login;
