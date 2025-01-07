import React, { useEffect, useState } from 'react';
import ManageRecords from './ManageRecords';
import Address from './Address';
import ManageResume from './ManageResume';

const UserProfile = ({ id }) => {
    const [userData, setUserData] = useState({
        personal_info: {},
        certificates: [],
        experiences: [],
        projects: [],
        education: [],
        skills: [],
        resumes: []
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_API_URL}/profile/${id}/`);
                const data = await response.json();
               
                setUserData({
                    personal_info: data.personal_info,
                    certificates: data.certificates,
                    experiences: data.experiences,
                    projects: data.projects,
                    education: data.education,
                    skills: data.skills,
                    resumes: data.resumes
                });
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        fetchData();
    }, [id]);

    const handleSubmit = (event) => {
        event.preventDefault();
    };

    // Certificate Fields
const certificateFields = [
    { name: 'title', type: 'text', placeholder: 'Certificate Title', required: true },
    { name: 'issuing_organization', type: 'text', placeholder: 'Issuing Organization', required: true },
    { name: 'description', type: 'textarea', placeholder: 'Description', required: false },
    { name: 'file_link', type: 'url', placeholder: 'File Link', required: false }
];

// Education Fields
const educationFields = [
    { name: 'institute_name', type: 'text', placeholder: 'Institute Name', required: true },
    { name: 'degree_name', type: 'text', placeholder: 'Degree', required: true },
    { name: 'specialization', type: 'text', placeholder: 'Specialization', required: true },
    { name: 'duration_from', type: 'date', placeholder: 'Start Date', required: false },
    { name: 'duration_to', type: 'date', placeholder: 'End Date', required: false },
    // { name: 'current', type: 'checkbox', placeholder: 'Currently Enrolled', required: false },
    { name: 'marks_or_grade', type: 'text', placeholder: 'Marks/Grade', required: false }
];

// Experience Fields
const experienceFields = [
    { name: 'employer', type: 'text', placeholder: 'Employer', required: true },
    { name: 'location', type: 'text', placeholder: 'Location', required: false },
    { name: 'role_title', type: 'text', placeholder: 'Role Title', required: true },
    { name: 'duration_from', type: 'date', placeholder: 'Start Date', required: false },
    { name: 'duration_to', type: 'date', placeholder: 'End Date', required: false },
    // { name: 'current', type: 'checkbox', placeholder: 'Currently Employed', required: false },
    { name: 'description', type: 'textarea', placeholder: 'Description', required: false },
    { name: 'skills', type: 'text', placeholder: 'Skills Used', required: false }
];

// Project Fields
const projectFields = [
    { name: 'title', type: 'text', placeholder: 'Project Title', required: true },
    { name: 'duration_from', type: 'date', placeholder: 'Start Date', required: false },
    { name: 'duration_to', type: 'date', placeholder: 'End Date', required: false },
    // { name: 'current', type: 'checkbox', placeholder: 'Ongoing Project', required: false },
    { name: 'description', type: 'textarea', placeholder: 'Description', required: false },
    { name: 'skills', type: 'text', placeholder: 'Skills Used', required: false },
    { name: 'link', type: 'url', placeholder: 'Project Link', required: false }
];

// Skill Fields
const skillFields = [
    { name: 'skill_name', type: 'text', placeholder: 'Skill', required: true }
];


    return (
        <div className='d-flex justify-content-center flex-row'>
            <div>
            <p className='text-muted text-center fs-1 fst-italic'>Hello {userData.personal_info.first_name}!</p>
            <Address id={id} personalInfo={userData.personal_info} />
            <form onSubmit={handleSubmit} className='d-grid col-12 '>

                <ManageResume userId={id} />

                <ManageRecords
                    recordType="Certificate"
                    initialRecords={userData.certificates}
                    id={id}
                    apiEndpoint={`${process.env.REACT_APP_API_URL}/certificate/manage/${id}`}
                    fields={certificateFields}
                />

                <ManageRecords
                    recordType="Education"
                    initialRecords={userData.education}
                    id={id}
                    apiEndpoint={`${process.env.REACT_APP_API_URL}/education/manage/${id}`}
                    fields={educationFields}
                />
               

                <ManageRecords
                    recordType="Experience"
                    initialRecords={userData.experiences}
                    id={id}
                    apiEndpoint={`${process.env.REACT_APP_API_URL}/experience/manage/${id}`}
                    fields={experienceFields}
                />

                <ManageRecords
                    recordType="Project"
                    initialRecords={userData.projects}
                    id={id}
                    apiEndpoint={`${process.env.REACT_APP_API_URL}/project/manage/${id}`}
                    fields={projectFields}
                />

                <ManageRecords
                    recordType="Skill"
                    initialRecords={userData.skills}
                    id={id}
                    apiEndpoint={`${process.env.REACT_APP_API_URL}/skills/manage/${id}`} 
                    fields={skillFields}
                />
            </form>
            </div>
        </div>
    );
};

export default UserProfile;
