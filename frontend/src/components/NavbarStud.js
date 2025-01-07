import { NavLink } from "react-router-dom";

const NavbarStud = ({ userEmail, handleLogout, isSidebarOpen }) => {
    return (
        <div className={`sidebar p-0 m-0 ${isSidebarOpen ? 'collapsed' : ''}`}>
            <div className="sidebar-content">
                <NavLink
                    className="nav-link  border-top fs-4 d-flex justify-content-center "
                    to="/profile"
                    activeClassName="active "
                >
                    {isSidebarOpen ? <i className="fas fa-user p-4 "></i> : "Profile"}
                </NavLink>

                <NavLink
                    className="nav-link  fs-4 d-flex justify-content-center"
                    to="/job-list"
                    activeClassName="active "
                    end
                >
                    {isSidebarOpen ? <i className="fas fa-home p-4 rounded-5"></i> : "Home"}
                </NavLink>

                <NavLink
                    className="nav-link  fs-4 d-flex justify-content-center"
                    to="/applied"
                    activeClassName="active "
                >
                    {isSidebarOpen ? <i className="fas fa-file-alt p-4"></i> : "Applied Jobs"}
                </NavLink>
            </div>
            <button className="nav-link btn p-3  bg-dark c-cust text-white rounded-0 fs-4 " onClick={handleLogout}>
                {isSidebarOpen ? <i className="fas fa-sign-out-alt  c-cust p-3"></i> : "Logout"}
            </button>
        </div>
    );
};

export default NavbarStud;
