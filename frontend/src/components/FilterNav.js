import React from 'react';

const FilterNav = ({
    isOpen,
    onClose,
    roleOptions,
    companyOptions,
    selectedRoles,
    selectedCompanies,
    salaryRange,
    onRoleChange,
    onCompanyChange,
    onSalaryChange
}) => {
    return (
        <div className={`filterNav ${isOpen ? 'open' : ''}`} id="filterNav">
            <button  className="closebtn"onClick={onClose}>&times;</button>
            
            <div className="mb-3">
                <h5>Job Role</h5>
                {roleOptions.length > 0 ? roleOptions.map(role => (
                    <div className='d-flex1 mx-5' key={role}>
                        <input
                            type="checkbox"
                            checked={selectedRoles.includes(role)}
                            onChange={() => onRoleChange(role)}
                        />
                        <label className='ms-3 text'>{role}</label>
                    </div>
                )) : <p>No roles available</p>}
            </div>
            
            <div className="mb-3">
                <h5>Company</h5>
                {companyOptions.length > 0 ? companyOptions.map(company => (
                    <div className='d-flex1 mx-5' key={company}>
                        <input
                            type="checkbox"
                            checked={selectedCompanies.includes(company)}
                            onChange={() => onCompanyChange(company)}
                        />
                        <label className='ms-3 text'> {company}</label>
                    </div>
                )) : <p>No companies available</p>}
            </div>
            <h5>Salary Range</h5>
            <div className="mb-3 ms-5">
                
                <input
                    type="number"
                    placeholder="Min Salary"
                    value={salaryRange.min || ''}
                    onChange={(e) => onSalaryChange(Number(e.target.value), salaryRange.max)}
                />
                <input
                    type="number"
                    placeholder="Max Salary"
                    value={salaryRange.max || ''}
                    onChange={(e) => onSalaryChange(salaryRange.min, Number(e.target.value))}
                />
            </div>
        </div>
    );
};

export default FilterNav;
