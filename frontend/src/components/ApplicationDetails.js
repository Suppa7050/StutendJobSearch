import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const ApplicationDetails = () => {
    const { jobId } = useParams();
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [sortCriteria, setSortCriteria] = useState('application_id'); // Default sorting by application ID
    const [sortOrder, setSortOrder] = useState('asc'); // Default sorting order
    const [resume, setResume] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchApplicationDetails = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_COMPANY_URL}/jobs/${jobId}/applications/`);
                const applicationsData = await Promise.all(
                    response.data.map(async (application) => {
                        const studentProfile = await axios.get(`${process.env.REACT_APP_API_URL}/profile/${application.student_id}/`);
                        const responseResume = await axios.get(`${process.env.REACT_APP_API_URL}/resume/${application.student_id}/`);

                        return { ...application, studentProfile: studentProfile.data, resume: responseResume.data };
                        // return { ...application, studentProfile: studentProfile.data };
                    })
                );

                setApplications(applicationsData);
            } catch (err) {
                setError("Error fetching application details.");
            } finally {
                setLoading(false);
            }
        };

        fetchApplicationDetails();
    }, [jobId]);

    const handleEachApplication = (application_id) => {
        navigate(`/company/jobs/${application_id}`);
    };

    const handleStatus = async (application_id, status) => {
        try {
            console.log(status);
            await axios.patch(`${process.env.REACT_APP_COMPANY_URL}/applications/${application_id}/update_status/`, { status });
            setApplications((prevApplications) =>
                prevApplications.map((application) =>
                    application.id === application_id ? { ...application, status } : application
                )
            );
        } catch (err) {
            setError("Error updating application status.");
        }
    };

    const handleSortChange = (event) => {
        setSortCriteria(event.target.value);
    };

    const handleOrderChange = (event) => {
        setSortOrder(event.target.value);
    };

    const sortedApplications = [...applications].sort((a, b) => {
        let comparison = 0;

        switch (sortCriteria) {
            case 'application_id':
                comparison = a.id - b.id;
                break;
            case 'student_name':
                const nameA = `${a.studentProfile.personal_info.first_name} ${a.studentProfile.personal_info.last_name}`.toLowerCase();
                const nameB = `${b.studentProfile.personal_info.first_name} ${b.studentProfile.personal_info.last_name}`.toLowerCase();
                comparison = nameA.localeCompare(nameB);
                break;
            case 'status':
                comparison = a.status.localeCompare(b.status);
                break;
            case 'num_certificates':
                comparison = b.studentProfile.certificates.length - a.studentProfile.certificates.length;
                break;
            case 'num_projects':
                comparison = b.studentProfile.projects.length - a.studentProfile.projects.length;
                break;
            case 'num_experiences':
                comparison = b.studentProfile.experiences.length - a.studentProfile.experiences.length;
                break;
            default:
                comparison = 0;
        }

        return sortOrder === 'asc' ? comparison : -comparison;
    });

    if (loading) return <p>Loading application details...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className="container">
            <h2 className="my-3">Application Details</h2>
            <div className="mb-3 d-flex justify-content-end">
                <label htmlFor="sort" className="me-2">Sort by:</label>
                <select id="sort" value={sortCriteria} onChange={handleSortChange}>
                    <option value="application_id">Application ID <i className="fas fa-sort"></i></option>
                    <option value="student_name">Student Name <i className="fas fa-sort-alpha-up"></i></option>
                    <option value="status">Status <i className="fas fa-sort"></i></option>
                    <option value="num_certificates">Number of Certificates <i className="fas fa-sort-numeric-up"></i></option>
                    <option value="num_projects">Number of Projects <i className="fas fa-sort-numeric-up"></i></option>
                    <option value="num_experiences">Number of Experiences <i className="fas fa-sort-numeric-up"></i></option>
                </select>
                <label htmlFor="order" className="ms-3 me-2">Order:</label>
                <select id="order" value={sortOrder} onChange={handleOrderChange}>
                    <option value="asc">Ascending</option>
                    <option value="desc">Descending</option>
                </select>
            </div>

            {sortedApplications.map((application) => {
                const { personal_info, certificates, projects, experiences, skills } = application.studentProfile;

                // Extract metadata
                const studentName = `${personal_info.first_name} ${personal_info.middle_name || ''} ${personal_info.last_name}`.trim();
                const email = personal_info.email;
                const mobile = personal_info.mobile;
                const numCertificates = certificates.length;
                const numProjects = projects.length;
                const numExperience = experiences.length;
                console.log(application.resume)
                console.log("REACT_APP_API_URL:", process.env.REACT_APP_BACKEND);
                // console.log("REACT_APP_API_URL:", process.env.REACT_APP_API_URL);
                return (
                    <div key={application.id} className="mb-3 border-0 p-3 bg-white shadow">
                        <div className="row">
                            {/* Left Section - Responsive Columns */}
                            <div className="col-12 col-md-7">
                                <div className='d-flex justify-content-between'>
                                    <p className='fst-italic fw-bolder fs-5 text-truncate'><u>{email}</u></p>
                                    <p className='fs-5 text-truncate'>{studentName}</p>
                                </div>
                                <div className='d-flex justify-content-between'>
                                    {numExperience > 0 ? (
                                        <div>
                                            {experiences.map(exp => (
                                                <p className="fw-bold" key={exp.id}>Worked At: {exp.employer}</p>
                                            ))}
                                        </div>
                                    ) : (
                                        <p>No experience found.</p>
                                    )}
                                    {skills && skills.length > 0 ? (
                                        <div className="mt-2">
                                            <p>{skills.slice(0, 3).map(skill => skill.skill_name).join(', ')}{skills.length > 3 && `, ...`}</p>
                                        </div>
                                    ) : (
                                        <p>No skills found.</p>
                                    )}
                                </div>
                                <div className='d-flex justify-content-between'>
                                    <p className='fw-medium'>{numCertificates} Certificates</p>
                                    <p>{numProjects} Projects</p>
                                </div>
                                <p>{mobile ? mobile : 'No mobile number found.'}</p>
                            </div>

                            {/* Right Section - Responsive Columns */}
                            <div className="col-12 col-md-5 d-flex flex-column justify-content-start">
                                <div className="d-flex flex-column justify-content-between mb-3">
                                    {application.resume ? (
                                        <p className='text-center'>

                                            <a href={`${process.env.REACT_APP_BACKEND}${application.resume.file}`} target="_blank" rel="noopener noreferrer">
                                                View Resume 
                                            </a>

                                        </p>

                                    ) : (
                                        <p className='text-center mb-5'>No resume found.</p>
                                    )}
                                    <div className="d-flex justify-content-between ">
                                        <button className="btn btn-success me-2 w-100 mb-3" onClick={() => handleStatus(application.id, "accepted")}>
                                            Accept
                                        </button>
                                        <button className="btn btn-danger w-100 mb-3" onClick={() => handleStatus(application.id, "rejected")}>
                                            Reject
                                        </button>
                                    </div>
                                </div>
                                <button className="btn btn-dark mb-2 w-100" onClick={() => handleEachApplication(application.id)}>
                                    View Application
                                </button>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default ApplicationDetails;
