import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = ({ onLogin }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('student'); // Default role is 'student'
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();

        const url = role === 'student'
            ? `${process.env.REACT_APP_API_URL}/login/`
            : `${process.env.REACT_APP_COMPANY_URL}/login_company/`;
        console.log(url)
        console.log("REACT_APP_COMPANY_URL:", process.env.REACT_APP_COMPANY_URL);
        axios.post(url, { email, password })
            .then(response => {
              
                onLogin(response.data.user.id, role); // Pass both email and role here

                // Redirect the user based on their role
                if (role === 'student') {
                    navigate('/job-list'); // Navigate to Job List if student
                } else {
                    navigate(`/job-listbycname/${response.data.user.id}`); // Navigate to job list by company ID if employer
                }
            })
            .catch(err => {
                setError('Invalid credentials');
                console.error('Login error:', err);
            });
    };

    const toggleRole = () => {
        // Switch between 'student' and 'employer'
        setRole((prevRole) => (prevRole === 'student' ? 'employer' : 'student'));
        setEmail(''); // Clear email on role switch
        setPassword(''); // Clear password on role switch
        setError(''); // Clear error message on role switch
    };

    return (
        <div className=" col-6 mt-5 bg-white">
            {/* <div className="row "> */}
                <div className="">
                    <div className="p-5 justify-content-center align-items-center">
                        <div className="card-body">
                            <h2 className="card-title text-center mb-4">{role === 'student' ? 'Student' : 'Employer'}'s Login</h2>
                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label htmlFor="email" className="form-label">Email:</label>
                                    <input
                                        type="email"
                                        className="form-control"
                                        id="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="password" className="form-label">Password:</label>
                                    <input
                                        type="password"
                                        className="form-control"
                                        id="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                </div>

                                <div className="text-center mb-3">
                                    <button
                                        type="button"
                                        className="btn btn-link "
                                        onClick={toggleRole}
                                    >
                                        Login as {role === 'student' ? 'Employer' : 'Student'}
                                    </button>
                                </div>

                                {error && <p className="text-danger">{error}</p>}
                                <div className="d-grid">
                                    <button type="submit" className="btn btn-dark
                                    
                                    ">Login</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            {/* </div> */}
        </div>
    );
};

export default Login;
