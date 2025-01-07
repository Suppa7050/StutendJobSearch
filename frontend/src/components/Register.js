import React, { useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';

const Register = () => {
    const [formData, setFormData] = useState({
        firstName: '',
        middleName: '',
        lastName: '',
        email: '',
        password: '',
        reEnterPassword: '',
        gender: '',
        mobile: ''
    });
    
    const [isEmployer, setIsEmployer] = useState(false);
    
    const [employerData, setEmployerData] = useState({
        email: '',
        password: '',
        name: '',
        location: ''
    });
    
    const navigate = useNavigate();
    
    const handleSubmit = async (event) => {
        event.preventDefault();
        const dataToSend = isEmployer ? employerData : formData;

        // Validate password match
        if (dataToSend.password !== dataToSend.reEnterPassword) {
            toast.error('Passwords do not match. Please try again.');
            return;
        }

        const url = isEmployer 
            ? `${process.env.REACT_APP_COMPANY_URL}/register_company/`
            : `${process.env.REACT_APP_API_URL}/register/`;
        console.log(url)
        try {
            const response = await axios.post(url, dataToSend);
            toast.success('Registration successful!');
            
            if (isEmployer) {
                setEmployerData({ email: '', password: '', name: '', location: '' });
            } else {
                setFormData({ firstName: '', middleName: '', lastName: '', email: '', password: '', reEnterPassword: '', gender: '', mobile: '' });
            }

            // Navigate to login page after registration
            // navigate('/login');

        } catch (error) {
            toast.error('Registration failed. ' + (error.response?.data?.error || 'Please try again.'));
            console.error('Error:', error);
        }
    };

    return (
        <div className=" form-container col-md-6 mt-5 p-5 bg-white">
            <ToastContainer />
            <h2>{isEmployer ? 'Employer' : 'Student'} Registration</h2>
            <div className="btn-group mb-4" role="group">
                <button 
                    type="button" 
                    className={`btn btn-${isEmployer ? 'secondary' : 'dark'}`} 
                    onClick={() => setIsEmployer(false)}
                >
                    Student
                </button>
                <button 
                    type="button" 
                    className={`btn btn-${isEmployer ? 'dark' : 'secondary'}`} 
                    onClick={() => setIsEmployer(true)}
                >
                    Employer
                </button>
            </div>

            <form onSubmit={handleSubmit}>
                {/* Name fields for Student */}
                {!isEmployer && (
                    <>
                        <div className="row">
                            <div className="mb-3 col-6">
                                <label htmlFor="firstName" className="form-label">First Name</label>
                                <input 
                                    type="text" 
                                    className="form-control" 
                                    id="firstName"
                                    value={formData.firstName}
                                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="mb-3 col-6">
                                <label htmlFor="middleName" className="form-label">Middle Name (Optional)</label>
                                <input 
                                    type="text" 
                                    className="form-control" 
                                    id="middleName"
                                    value={formData.middleName}
                                    onChange={(e) => setFormData({ ...formData, middleName: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="row">
                            <div className="mb-3 col-6">
                                <label htmlFor="lastName" className="form-label">Last Name</label>
                                <input 
                                    type="text" 
                                    className="form-control" 
                                    id="lastName"
                                    value={formData.lastName}
                                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="mb-3 col-6">
                                <label htmlFor="gender" className="form-label">Gender (Optional)</label>
                                <select
                                    className="form-control"
                                    id="gender"
                                    value={formData.gender}
                                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                                >
                                    <option value="">Select</option>
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>
                        </div>

                        <div className="row">
                            <div className="mb-3 col-12">
                                <label htmlFor="mobile" className="form-label">Mobile Number (Optional)</label>
                                <input 
                                    type="text" 
                                    className="form-control" 
                                    id="mobile"
                                    value={formData.mobile}
                                    onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                                />
                            </div>
                        </div>
                    </>
                )}

                {/* Email and Password fields */}
                <div className="row">
                    <div className="mb-3 col-6">
                        <label htmlFor="email" className="form-label">Email</label>
                        <input 
                            type="email" 
                            className="form-control" 
                            id="email"
                            value={isEmployer ? employerData.email : formData.email}
                            onChange={(e) => {
                                const value = e.target.value;
                                if (isEmployer) setEmployerData({ ...employerData, email: value });
                                else setFormData({ ...formData, email: value });
                            }}
                            required
                        />
                    </div>
                    <div className="mb-3 col-6">
                        <label htmlFor="password" className="form-label">Password</label>
                        <input 
                            type="password" 
                            className="form-control" 
                            id="password"
                            value={isEmployer ? employerData.password : formData.password}
                            onChange={(e) => {
                                const value = e.target.value;
                                if (isEmployer) setEmployerData({ ...employerData, password: value });
                                else setFormData({ ...formData, password: value });
                            }}
                            required
                        />
                    </div>
                </div>

                <div className="row">

                    <div className="mb-3 col-12">
                        <label htmlFor="reEnterPassword" className="form-label">Re-enter Password</label>
                        <input 
                            type="password" 
                            className="form-control" 
                            id="reEnterPassword"
                            value={isEmployer ? employerData.reEnterPassword : formData.reEnterPassword}
                            onChange={(e) => {
                                const value = e.target.value;
                                if (isEmployer) setEmployerData({ ...employerData, reEnterPassword: value });
                                else setFormData({ ...formData, reEnterPassword: value });
                            }}
                            required
                        />
                    </div>
                </div>

                {/* Employer-specific fields */}
                {isEmployer && (
                    <>
                        <div className="row">
                            <div className="mb-3 col-6">
                                <label htmlFor="name" className="form-label">Company Name</label>
                                <input 
                                    type="text" 
                                    className="form-control" 
                                    id="name"
                                    value={employerData.name}
                                    onChange={(e) => setEmployerData({ ...employerData, name: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="mb-3 col-6">
                                <label htmlFor="location" className="form-label">Location</label>
                                <input 
                                    type="text" 
                                    className="form-control" 
                                    id="location"
                                    value={employerData.location}
                                    onChange={(e) => setEmployerData({ ...employerData, location: e.target.value })}
                                    required
                                />
                            </div>
                        </div>
                    </>
                )}

                <button type="submit" className="btn btn-dark w-100">Register</button>
            </form>
        </div>
    );
};

export default Register;
