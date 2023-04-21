import React, {useRef, useState} from 'react';
import {getAuth, signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
import app from "../../firebase/firbase.config.js";
import {Link} from "react-router-dom";

const auth = getAuth(app);

const Login = () => {
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const emailRef = useRef();
    
    const handleLogin = event => {
        event.preventDefault();
        setSuccess("");
        setError("");
        const form = event.target;
        const email = form.email.value;
        const password = form.password.value;
        console.log(email, password);
        
        // validation
        setError("");
        if (!/(?=.*[A-Z])/.test(password)) {
            setError("Please add at least one uppercase in your password");
            return;
        } else if (!/(?=.*[!@#$&*])/.test(password)) {
            setError("Please add a special character in your password");
            return;
        } else if (password.length < 6) {
            setError("Password must be 6 characters long");
            return;
        }
        
        signInWithEmailAndPassword(auth, email, password)
            .then( result => {
                const loggedUser = result.user;
                console.log(loggedUser);
                if (!loggedUser.emailVerified) {
                
                }
                setSuccess("User logged in successfully");
                setError("");
            })
            .catch (error => {
                setError(error.message);
            })
    }
    
    const handleResetPassword = () => {
        const email = emailRef.current.value;
        if (!email) {
            alert("Please enter your email address to reset password");
        }
        sendPasswordResetEmail(auth, email)
            .then( () => {
                alert("Please check your email!");
            })
            .catch(error => {
                console.error(error.message);
            })
    }
    
    return (
        <div className="w-25 mx-auto mt-5">
            <h4>Please Login</h4>
            <form onSubmit={handleLogin}>
                <div className="form-group mb-3">
                    <input type="text" name="email" ref={emailRef} className="form-control" id="username" placeholder="Your Email" required />
                </div>
                <div className="form-group mb-3">
                    <input type="password" name="password" className="form-control" id="password" placeholder="Your Password" required />
                </div>
                <button type="submit" className="btn btn-primary">Submit</button>
            </form>
            <p><small>Forgot Password? Please <button onClick={handleResetPassword} className="btn btn-link">Reset Password</button></small></p>
            <p><small>New to this website? Please <Link to="/register">Register</Link></small></p>
            <p className="text-danger">{error}</p>
            <p className="text-success">{success}</p>
        </div>
    );
};

export default Login;