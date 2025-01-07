import React, { useState, useEffect } from 'react';
import JobList from './JobList';
import Login from './Login';
import Register from './Register';
// import './Home.css'; // Assuming custom styles are in Home.css
import loginImage from '../images/Login.svg'; // Adjust the path based on where you place the file
import loginImage1 from '../images/Loginblack.svg'
import reg1 from '../images/reg1.svg'; // Adjust the path based on where you place the file
import reg2 from '../images/reg2.svg'
export const Home = ({ setUseId, setUserRole }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isRegistering, setIsRegistering] = useState(false);

    useEffect(() => {
        const studentId = localStorage.getItem('student_id');
        const employerId = localStorage.getItem('employer_id');
        setIsLoggedIn(!!studentId || !!employerId);
    }, []);

    return (
        <div className="container position-relative">
            {!isLoggedIn && (
                <div className="d-grid " style={{ height:"100%" }}>


                    {/* Opaque Layer with Transition */}
                    <div
                        className={`opaque-layer w-50 ${isRegistering ? 'translate-x' : ''
                            } d-flex  justify-content-end text-white flex-column my-2`}
                        style={{
                            backgroundImage: `url(${isRegistering ? reg2 : loginImage})`,
                            backgroundSize: 'cover', // Optionally add this for better display
                            backgroundPosition: 'center' // Optionally add this for better positioning
                        }}
                        onClick={() => setIsRegistering(!isRegistering)}
                    >




                        {/* <div className="circle  d-flex align-items-center justify-content-center h-25 p-3"> */}
                        <button
                            className="btn text-dark"
                            onClick={() => setIsRegistering(!isRegistering)}
                        >
                            {isRegistering ? (
                                <>
                                   
                                    Go to Register
                                    <i className="ms-3 fas fa-arrow-right"></i> {/* Arrow points left */}
                                </>
                            ) : (
                                <>
                                <i className="ms-3 fas fa-arrow-left"></i>
                                    Go to Login
                                     {/* Arrow points right */}
                                </>
                            )}
                        </button>

                        {/* </div> */}

                    </div>

                    <div className=" d-flex align-items-center justify-content-center  my-2 bg-white">

                        <Login
                            onLogin={(email, role) => {
                              
                                setUseId(email);  // This should now correctly reference the function
                                setUserRole(role);
                                localStorage.setItem(role === 'student' ? 'student_id' : 'employer_id', email);
                            }}
                        />
                        <Register />
                    </div>
                </div>
            )}
        </div>
    );
};

export default Home;
