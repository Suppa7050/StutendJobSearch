import React, { useState } from 'react';

const UserProfile = ({ email }) => {
    const [name, setName] = useState({ firstName: '', lastName: '', middleName: '' });
    const [projects, setProjects] = useState([
        { title: '', durationFrom: { year: '', month: '' }, durationTo: { year: '', month: '' }, description: '', skills: '', link: '' }
    ]);
    const [education, setEducation] = useState([
        { institute: '', durationFrom: { year: '', month: '' }, durationTo: { year: '', month: '' }, marks: '' }
    ]);
    const [address, setAddress] = useState({ country: '', state: '', city: '', pincode: '', addressLine1: '' });
    const [certificates, setCertificates] = useState([{ title: '', description: '', fileLink: '' }]);
    const [experience, setExperience] = useState([
        { employer: '', location: '', roleTitle: '', duration: '', description: '', skills: '' }
    ]);
    
    // State variables for edit mode
    const [isEditingProjects, setIsEditingProjects] = useState(false);
    const [isEditingEducation, setIsEditingEducation] = useState(false);
    const [isEditingAddress, setIsEditingAddress] = useState(false);
    const [isEditingCertificates, setIsEditingCertificates] = useState(false);
    const [isEditingExperience, setIsEditingExperience] = useState(false);

    const handleNameChange = (event) => {
        const { name, value } = event.target;
        setName({ ...name, [name]: value });
    };

    const handleProjectChange = (index, event) => {
        const { name, value } = event.target;
        const newProjects = [...projects];
        if (name.startsWith('durationFrom') || name.startsWith('durationTo')) {
            const key = name.split('.')[1]; // 'month' or 'year'
            newProjects[index][name.split('.')[0]][key] = value;
        } else {
            newProjects[index][name] = value;
        }
        setProjects(newProjects);
    };

    const handleEducationChange = (index, event) => {
        const { name, value } = event.target;
        const newEducation = [...education];
        if (name.startsWith('durationFrom') || name.startsWith('durationTo')) {
            const key = name.split('.')[1]; // 'month' or 'year'
            newEducation[index][name.split('.')[0]][key] = value;
        } else {
            newEducation[index][name] = value;
        }
        setEducation(newEducation);
    };

    const handleAddressChange = (event) => {
        const { name, value } = event.target;
        setAddress({ ...address, [name]: value });
    };

    const handleCertificateChange = (index, event) => {
        const { name, value } = event.target;
        const newCertificates = [...certificates];
        newCertificates[index][name] = value;
        setCertificates(newCertificates);
    };

    const handleExperienceChange = (index, event) => {
        const { name, value } = event.target;
        const newExperience = [...experience];
        newExperience[index][name] = value;
        setExperience(newExperience);
    };

    const addProject = () => {
        setProjects([...projects, { title: '', durationFrom: { year: '', month: '' }, durationTo: { year: '', month: '' }, description: '', skills: '', link: '' }]);
    };

    const addEducation = () => {
        setEducation([...education, { institute: '', durationFrom: { year: '', month: '' }, durationTo: { year: '', month: '' }, marks: '' }]);
    };

    const addCertificate = () => {
        setCertificates([...certificates, { title: '', description: '', fileLink: '' }]);
    };

    const addExperience = () => {
        setExperience([...experience, { employer: '', location: '', roleTitle: '', duration: '', description: '', skills: '' }]);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        // Handle form submission (e.g., send data to the server)
       
    };

    const saveData = (section) => {
        // Here you would typically send a request to your backend API
        // console.log(`Saving ${section}:`, { 
        //     projects, 
        //     education, 
        //     address, 
        //     certificates, 
        //     experience 
        // });
        // Set the edit mode to false after saving
        if (section === 'projects') setIsEditingProjects(false);
        else if (section === 'education') setIsEditingEducation(false);
        else if (section === 'address') setIsEditingAddress(false);
        else if (section === 'certificates') setIsEditingCertificates(false);
        else if (section === 'experience') setIsEditingExperience(false);
    };

    return (
        <div>
            <h1>User Profile for {email}</h1>
            <form onSubmit={handleSubmit}>
                <h2>Name</h2>
                <input
                    type="text"
                    name="firstName"
                    placeholder="First Name"
                    value={name.firstName}
                    onChange={handleNameChange}
                />
                <input
                    type="text"
                    name="middleName"
                    placeholder="Middle Name"
                    value={name.middleName}
                    onChange={handleNameChange}
                />
                <input
                    type="text"
                    name="lastName"
                    placeholder="Last Name"
                    value={name.lastName}
                    onChange={handleNameChange}
                />

                <h2>Projects</h2>
                {projects.map((project, index) => (
                    <div key={index}>
                        <input
                            type="text"
                            name="title"
                            placeholder="Project Title"
                            value={project.title}
                            onChange={(e) => handleProjectChange(index, e)}
                            disabled={!isEditingProjects} // Disable input if not editing
                        />
                        <div>
                            <label>Duration From:</label>
                            <input
                                type="number"
                                name="durationFrom.year"
                                placeholder="Year (YYYY)"
                                value={project.durationFrom.year}
                                onChange={(e) => handleProjectChange(index, e)}
                                disabled={!isEditingProjects} // Disable input if not editing
                                min="2000" 
                                max={new Date().getFullYear()}
                            />
                            <input
                                type="number"
                                name="durationFrom.month"
                                placeholder="Month (1-12)"
                                value={project.durationFrom.month}
                                onChange={(e) => handleProjectChange(index, e)}
                                disabled={!isEditingProjects} // Disable input if not editing
                                min="1"
                                max="12"
                            />
                        </div>
                        <div>
                            <label>Duration To:</label>
                            <input
                                type="number"
                                name="durationTo.year"
                                placeholder="Year (YYYY)"
                                value={project.durationTo.year}
                                onChange={(e) => handleProjectChange(index, e)}
                                disabled={!isEditingProjects} // Disable input if not editing
                                min="2000" 
                                max={new Date().getFullYear()}
                            />
                            <input
                                type="number"
                                name="durationTo.month"
                                placeholder="Month (1-12)"
                                value={project.durationTo.month}
                                onChange={(e) => handleProjectChange(index, e)}
                                disabled={!isEditingProjects} // Disable input if not editing
                                min="1"
                                max="12"
                            />
                        </div>
                        <input
                            type="text"
                            name="description"
                            placeholder="Description"
                            value={project.description}
                            onChange={(e) => handleProjectChange(index, e)}
                            disabled={!isEditingProjects} // Disable input if not editing
                        />
                        <input
                            type="text"
                            name="skills"
                            placeholder="Skills"
                            value={project.skills}
                            onChange={(e) => handleProjectChange(index, e)}
                            disabled={!isEditingProjects} // Disable input if not editing
                        />
                        <input
                            type="text"
                            name="link"
                            placeholder="Project Link"
                            value={project.link}
                            onChange={(e) => handleProjectChange(index, e)}
                            disabled={!isEditingProjects} // Disable input if not editing
                        />
                    </div>
                ))}
                <button type="button" onClick={addProject}>Add Project</button>
                <button type="button" onClick={() => saveData('projects')}>Save Projects</button>
                <button type="button" onClick={() => setIsEditingProjects(!isEditingProjects)}>
                    {isEditingProjects ? 'Cancel Edit' : 'Edit Projects'}
                </button>

                <h2>Education</h2>
                {education.map((edu, index) => (
                    <div key={index}>
                        <input
                            type="text"
                            name="institute"
                            placeholder="Institute"
                            value={edu.institute}
                            onChange={(e) => handleEducationChange(index, e)}
                            disabled={!isEditingEducation}
                        />
                        <div>
                            <label>Duration From:</label>
                            <input
                                type="number"
                                name="durationFrom.year"
                                placeholder="Year (YYYY)"
                                value={edu.durationFrom.year}
                                onChange={(e) => handleEducationChange(index, e)}
                                disabled={!isEditingEducation}
                                min="2000"
                                max={new Date().getFullYear()}
                            />
                            <input
                                type="number"
                                name="durationFrom.month"
                                placeholder="Month (1-12)"
                                value={edu.durationFrom.month}
                                onChange={(e) => handleEducationChange(index, e)}
                                disabled={!isEditingEducation}
                                min="1"
                                max="12"
                            />
                        </div>
                        <div>
                            <label>Duration To:</label>
                            <input
                                type="number"
                                name="durationTo.year"
                                placeholder="Year (YYYY)"
                                value={edu.durationTo.year}
                                onChange={(e) => handleEducationChange(index, e)}
                                disabled={!isEditingEducation}
                                min="2000"
                                max={new Date().getFullYear()}
                            />
                            <input
                                type="number"
                                name="durationTo.month"
                                placeholder="Month (1-12)"
                                value={edu.durationTo.month}
                                onChange={(e) => handleEducationChange(index, e)}
                                disabled={!isEditingEducation}
                                min="1"
                                max="12"
                            />
                        </div>
                        <input
                            type="text"
                            name="marks"
                            placeholder="Marks"
                            value={edu.marks}
                            onChange={(e) => handleEducationChange(index, e)}
                            disabled={!isEditingEducation}
                        />
                    </div>
                ))}
                <button type="button" onClick={addEducation}>Add Education</button>
                <button type="button" onClick={() => saveData('education')}>Save Education</button>
                <button type="button" onClick={() => setIsEditingEducation(!isEditingEducation)}>
                    {isEditingEducation ? 'Cancel Edit' : 'Edit Education'}
                </button>

                <h2>Address</h2>
                <input
                    type="text"
                    name="country"
                    placeholder="Country"
                    value={address.country}
                    onChange={handleAddressChange}
                    disabled={!isEditingAddress}
                />
                <input
                    type="text"
                    name="state"
                    placeholder="State"
                    value={address.state}
                    onChange={handleAddressChange}
                    disabled={!isEditingAddress}
                />
                <input
                    type="text"
                    name="city"
                    placeholder="City"
                    value={address.city}
                    onChange={handleAddressChange}
                    disabled={!isEditingAddress}
                />
                <input
                    type="text"
                    name="pincode"
                    placeholder="Pincode"
                    value={address.pincode}
                    onChange={handleAddressChange}
                    disabled={!isEditingAddress}
                />
                <input
                    type="text"
                    name="addressLine1"
                    placeholder="Address Line 1"
                    value={address.addressLine1}
                    onChange={handleAddressChange}
                    disabled={!isEditingAddress}
                />
                <button type="button" onClick={() => saveData('address')}>Save Address</button>
                <button type="button" onClick={() => setIsEditingAddress(!isEditingAddress)}>
                    {isEditingAddress ? 'Cancel Edit' : 'Edit Address'}
                </button>

                <h2>Certificates</h2>
                {certificates.map((certificate, index) => (
                    <div key={index}>
                        <input
                            type="text"
                            name="title"
                            placeholder="Certificate Title"
                            value={certificate.title}
                            onChange={(e) => handleCertificateChange(index, e)}
                            disabled={!isEditingCertificates}
                        />
                        <input
                            type="text"
                            name="description"
                            placeholder="Description"
                            value={certificate.description}
                            onChange={(e) => handleCertificateChange(index, e)}
                            disabled={!isEditingCertificates}
                        />
                        <input
                            type="text"
                            name="fileLink"
                            placeholder="File Link"
                            value={certificate.fileLink}
                            onChange={(e) => handleCertificateChange(index, e)}
                            disabled={!isEditingCertificates}
                        />
                    </div>
                ))}
                <button type="button" onClick={addCertificate}>Add Certificate</button>
                <button type="button" onClick={() => saveData('certificates')}>Save Certificates</button>
                <button type="button" onClick={() => setIsEditingCertificates(!isEditingCertificates)}>
                    {isEditingCertificates ? 'Cancel Edit' : 'Edit Certificates'}
                </button>

                <h2>Experience</h2>
                {experience.map((exp, index) => (
                    <div key={index}>
                        <input
                            type="text"
                            name="employer"
                            placeholder="Employer"
                            value={exp.employer}
                            onChange={(e) => handleExperienceChange(index, e)}
                            disabled={!isEditingExperience}
                        />
                        <input
                            type="text"
                            name="location"
                            placeholder="Location"
                            value={exp.location}
                            onChange={(e) => handleExperienceChange(index, e)}
                            disabled={!isEditingExperience}
                        />
                        <input
                            type="text"
                            name="roleTitle"
                            placeholder="Role Title"
                            value={exp.roleTitle}
                            onChange={(e) => handleExperienceChange(index, e)}
                            disabled={!isEditingExperience}
                        />
                        <input
                            type="text"
                            name="duration"
                            placeholder="Duration"
                            value={exp.duration}
                            onChange={(e) => handleExperienceChange(index, e)}
                            disabled={!isEditingExperience}
                        />
                        <input
                            type="text"
                            name="description"
                            placeholder="Description"
                            value={exp.description}
                            onChange={(e) => handleExperienceChange(index, e)}
                            disabled={!isEditingExperience}
                        />
                        <input
                            type="text"
                            name="skills"
                            placeholder="Skills"
                            value={exp.skills}
                            onChange={(e) => handleExperienceChange(index, e)}
                            disabled={!isEditingExperience}
                        />
                    </div>
                ))}
                <button type="button" onClick={addExperience}>Add Experience</button>
                <button type="button" onClick={() => saveData('experience')}>Save Experience</button>
                <button type="button" onClick={() => setIsEditingExperience(!isEditingExperience)}>
                    {isEditingExperience ? 'Cancel Edit' : 'Edit Experience'}
                </button>

                <button type="submit">Submit</button>
            </form>
        </div>
    );
};

export default UserProfile;
