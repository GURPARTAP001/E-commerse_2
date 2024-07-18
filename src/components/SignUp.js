import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth, fs } from '../Config';
import './Auth.css';

const SignUp = () => {
    const navigate = useNavigate();
    const [fullName, setFullname] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [successMsg, setSuccessMsg] = useState('');
    const [errorMsg, setErrorMsg] = useState('');

    const handleSignup = (e) => {
        e.preventDefault();
        auth.createUserWithEmailAndPassword(email, password).then((credentials) => {
            fs.collection('users').doc(credentials.user.uid).set({
                FullName: fullName,
                Email: email,
                Password: password
            }).then(() => {
                setSuccessMsg('Signup Successful. You will now be redirected to the login page.');
                setFullname('');
                setEmail('');
                setPassword('');
                setErrorMsg('');
                setTimeout(() => {
                    setSuccessMsg('');
                    navigate('/login');
                }, 500);
            }).catch(error => setErrorMsg(error.message));
        }).catch(error => setErrorMsg(error.message));
    };

    return (
        <div className="main_man">
        <div className="auth-container">
            <div className="auth-left">
                <h2>Hello, Friend!</h2>
                <p>Enter your personal details and start your journey with us</p>
                <Link to="/login">
                    <button className="ghost-button">Login</button>
                </Link>
            </div>
            <div className="auth-right">
                <form className="auth-form" onSubmit={handleSignup}>
                    <h2>Sign Up</h2>
                    {successMsg && <div className="success-msg">{successMsg}</div>}
                    {errorMsg && <div className="error-msg">{errorMsg}</div>}
                    <input
                        type="text"
                        placeholder="Full Name"
                        value={fullName}
                        onChange={(e) => setFullname(e.target.value)}
                        required
                    />
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
                    <button type="submit">Sign Up</button>
                </form>
            </div>
        </div>
        </div>
    );
};

export default SignUp;
