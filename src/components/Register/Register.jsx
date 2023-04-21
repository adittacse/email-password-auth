import React, {useState} from 'react';
import { getAuth, createUserWithEmailAndPassword, sendEmailVerification, updateProfile } from "firebase/auth";
import app from "../../firebase/firbase.config.js";
import {Link} from "react-router-dom";

const Register = () => {
    const auth = getAuth(app);
    
    const [registerError, setRegisterError] = useState("");
    const [success, setSuccess] = useState("");
    const [email, setEmail] = useState("");
    const handleEmailChange = (event) => {
        // setEmail(event.target.value);
    }
    
    const sendVerificationEmail = (user) => {
        sendEmailVerification(user)
            .then(result => {
                console.log(result)
                alert("Please verify your email address")
            })
            .catch(error => {
                console.error(error)
            })
    }
    
    const updateUserData = (user, name) => {
        updateProfile(user, {
            displayName: name,
        })
            .then( () => {
                console.log("User name updated");
            })
            .catch(error => {
                console.error(error);
            })
    }
    
    const handlePasswordBlur = (event) => {
        // console.log(event.target.value);
    }
    
    const handleSubmit = (event) => {
        // 1. prevent page refresh
        event.preventDefault();
        setSuccess("");
        setRegisterError("");
        // 2. collect form data
        const name = event.target.name.value;
        const email = event.target.email.value;
        const password = event.target.password.value;
        console.log(name, email, password);
        
        //validate password
        if(!/(?=.*[A-Z])/.test(password)) {
            setRegisterError("Please add at least one uppercase");
            return;
        } else if (!/(?=.*[0-9].*[0-9])/.test(password)) {
            setRegisterError("Please add at least two numbers");
            return;
        } else if (!/(?=.*[!@#$&*])/.test(password)) {
            setRegisterError("Please add a special character in your password");
            return;
        } else if (password.length < 6) {
            setRegisterError("Please add at least 6 characters in your password!");
            return;
        }
        // 3. create user in firebase
        createUserWithEmailAndPassword(auth, email, password)
            .then(result => {
                const loggedUser = result.user;
                console.log(loggedUser);
                setRegisterError("");
                event.target.reset();
                setSuccess("Account Registered Successfully");
                sendVerificationEmail(loggedUser);
                updateUserData(loggedUser, name);
            })
            .catch(error => {
                console.error(error.message);
                setRegisterError(error.message);
            })
    }
    
    return (
        <div className="w-25 mx-auto mt-5 justify-content-center align-items-center">
            <h4>Register</h4>
            <form onSubmit={handleSubmit}>
                <div className="form group mb-3">
                    <input className="form-control w-100 rounded ps-2" type="text" name="name" id="name" placeholder="Your Name" required/>
                </div>
                <div className="form group mb-3">
                    <input className="form-control w-100 rounded ps-2" onChange={handleEmailChange} type="email" name="email" id="email" placeholder="Your Email" required/>
                </div>
                <div className="form-group mb-3">
                    <input className="form-control w-100 rounded ps-2" onBlur={handlePasswordBlur} type="password" name="password" id="password" placeholder="Your Password" required/>
                </div>
                <input className="btn btn-primary" type="submit" value="Register"/>
            </form>
            <p><small>Already have an account? Please <Link to="/login">Login</Link></small></p>
            <p className="text-danger">{registerError}</p>
            <p className="text-success">{success}</p>
        </div>
    );
};

export default Register;