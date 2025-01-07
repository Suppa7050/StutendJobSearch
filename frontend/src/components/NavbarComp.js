import React from 'react';
import { NavLink } from 'react-router-dom';

const NavbarComp = ({ handleLogout, isSidebarOpen }) => {
    const employerId = localStorage.getItem("employer_id");

    return (
        <div className={`sidebar p-0 m-0 ${isSidebarOpen ? 'collapsed' : ''}`}>
            <div className="sidebar-content">
                <NavLink
                    className="nav-link border-top fs-4 d-flex justify-content-center"
                    to={`/job-listbycname/${employerId}`}
                    activeClassName="active"
                >
                    {isSidebarOpen ? <i className="fas fa-home p-4"></i> : "Home"}
                </NavLink>

                <NavLink
                    className="nav-link fs-4 d-flex justify-content-center"
                    to="/create-job"
                    activeClassName="active"
                >
                    {isSidebarOpen ? <i className="fas fa-plus p-4"></i> : "Create Job"}
                </NavLink>
            </div>
            <button
                className="nav-link btn p-3 bg-dark text-white rounded-0 fs-4 w-100"
                onClick={handleLogout}
            >
                {isSidebarOpen ? <i className="fas fa-sign-out-alt p-3"></i> : "Logout"}
            </button>
        </div>
    );
};

export default NavbarComp;
