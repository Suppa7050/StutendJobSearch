// NavbarBasic.js
import React from 'react';
import { Link } from 'react-router-dom';

const NavbarBasic = () => {
    return (
        <div className="App">
            <nav className="navbar navbar-expand-lg navbar-dark bg-dark p-3 fs-4">
                <div className="container-fluid">
                    <Link className="navbar-brand" to="/job-list">HOME</Link>
                    <button 
                        className="navbar-toggler" 
                        type="button" 
                        data-bs-toggle="collapse" 
                        data-bs-target="#navbarNavDropdown" 
                        aria-controls="navbarNavDropdown" 
                        aria-expanded="false" 
                        aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarNavDropdown">
                        <ul className="navbar-nav">
                            <li className="nav-item">
                                <Link className="nav-link" to="/login">Login</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/register">Register</Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        </div>
    );
};

export default NavbarBasic;
