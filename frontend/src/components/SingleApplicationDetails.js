// import axios from 'axios';
// import React, { useEffect, useState } from 'react';
// import { useParams } from 'react-router-dom';

// export default function SingleApplicationDetails() {
//     const { appId } = useParams();
//     const [application, setApplication] = useState(null);
//     const [profile, setProfile] = useState(null);
//     const [error, setError] = useState(null);

//     useEffect(() => {
//         const fetchApplication = async () => {
//             try {
//                 const response = await axios.get(`${process.env.REACT_APP_COMPANY_URL}\/applications/${appId}/`);
//                 const applicationData = response.data;

//                 const response2 = await axios.get(`${process.env.REACT_APP_COMPANY_URL}/profile/${applicationData.student_id}/`);
//                 const profileData = response2.data;

//                 setApplication(applicationData);
//                 setProfile(profileData);
//                 console.log(profileData)
//             } catch (err) {
//                 setError('Error while getting application or profile data');
//             }
//         };

//         fetchApplication();
//     }, [appId]);

//     const handleStatus = async (status) => {
//         try {
//             const response = await axios.patch(`${process.env.REACT_APP_COMPANY_URL}\/applications/${appId}/update_status/`, { status });
//             console.log('Status update response:', response.data);
//             setApplication((prev) => ({ ...prev, status })); // Update local application status
//         } catch (err) {
//             setError('Error updating application status.');
//         }
//     };

//     if (error) {
//         return <div className="alert alert-danger" role="alert">{error}</div>;
//     }

//     if (!application || !profile) {
//         return <div className="text-center mt-5">Loading application details...</div>;
//     }

//     return (
//         <div className="container mt-5">
//             <h2 className="text-center mb-4">Application and Profile Details</h2>
//             <div className="card mb-4">
//                 <div className="card-body">
//                     <h5 className="card-title">Application ID: {application.id}</h5>
//                     <p><strong>Status:</strong> {application.status}</p>
//                     <p><strong>Job ID:</strong> {application.job_id}</p>
//                     <div className="d-flex">
//                         <button className="btn btn-success me-2" onClick={() => handleStatus("accepted")}>Accept</button>
//                         <button className="btn btn-danger" onClick={() => handleStatus("rejected")}>Reject</button>
//                     </div>
//                 </div>
//             </div>

//             {/* Personal Information */}
//             <div className="card mb-4">
//                 <div className="card-body">
//                     <h4>Personal Information</h4>
//                     <p><strong>Name:</strong> {profile.personal_info.first_name} {profile.personal_info.middle_name} {profile.personal_info.last_name}</p>
//                     <p><strong>Email:</strong> {profile.personal_info.email}</p>
//                     <p><strong>Gender:</strong> {profile.personal_info.gender}</p>
//                     <p><strong>Mobile:</strong> {profile.personal_info.mobile}</p>
//                 </div>
//             </div>

//             {/* Address */}
//             {profile.address && (
//                 <div className="card mb-4">
//                     <div className="card-body">
//                         <h4>Address</h4>
//                         <p><strong>Address:</strong> {profile.address.address_line_1}, {profile.address.city}, {profile.address.state} - {profile.address.pincode}</p>
//                     </div>
//                 </div>
//             )}

//             {/* Education */}
//             {profile.education.length > 0 && (
//                 <div className="card mb-4">
//                     <div className="card-body">
//                         <h4>Education</h4>
//                         {profile.education.map((edu, index) => (
//                             <div key={index} className="mb-3">
//                                 <p><strong>Institute:</strong> {edu.institute_name}</p>
//                                 <p><strong>Duration:</strong> {edu.duration_from} - {edu.current ? "Present" : edu.duration_to}</p>
//                                 <p><strong>Marks/Grade:</strong> {edu.marks_or_grade}</p>
//                             </div>
//                         ))}
//                     </div>
//                 </div>
//             )}

//             {/* Experiences */}
//             {profile.experiences.length > 0 && (
//                 <div className="card mb-4">
//                     <div className="card-body">
//                         <h4>Experiences</h4>
//                         {profile.experiences.map((exp, index) => (
//                             <div key={index} className="mb-3">
//                                 <p><strong>Role:</strong> {exp.role_title}</p>
//                                 <p><strong>Company:</strong> {exp.employer}</p>
//                                 <p><strong>Location:</strong> {exp.location}</p>
//                                 <p><strong>Duration:</strong> {exp.duration_from} - {exp.current ? "Present" : exp.duration_to}</p>
//                                 <p><strong>Description:</strong> {exp.description}</p>
//                                 <p><strong>Skills:</strong> {exp.skills}</p>
//                             </div>
//                         ))}
//                     </div>
//                 </div>
//             )}

//             {/* Certificates */}
//             {profile.certificates.length > 0 && (
//                 <div className="card mb-4">
//                     <div className="card-body">
//                         <h4>Certificates</h4>
//                         {profile.certificates.map((cert, index) => (
//                             <div key={index} className="mb-3">
//                                 <p><strong>Title:</strong> {cert.title}</p>
//                                 <p><strong>Description:</strong> {cert.description}</p>
//                                 <p><strong>File Link:</strong> <a href={cert.file_link} target="_blank" rel="noopener noreferrer">View Certificate</a></p>
//                             </div>
//                         ))}
//                     </div>
//                 </div>
//             )}

//             {/* Projects */}
//             {profile.projects.length > 0 && (
//                 <div className="card mb-4">
//                     <div className="card-body">
//                         <h4>Projects</h4>
//                         {profile.projects.map((project, index) => (
//                             <div key={index} className="mb-3">
//                                 <p><strong>Title:</strong> {project.title}</p>
//                                 <p><strong>Duration:</strong> {project.duration_from} - {project.current ? "Present" : project.duration_to}</p>
//                                 <p><strong>Description:</strong> {project.description}</p>
//                                 <p><strong>Skills:</strong> {project.skills}</p>
//                                 <p><strong>Project Link:</strong> <a href={project.link} target="_blank" rel="noopener noreferrer">View Project</a></p>
//                             </div>
//                         ))}
//                     </div>
//                 </div>
//             )}

//             <div className="card mb-4">
//                 <div className="card-body">
//                     <h4>Answers</h4>
//                     {application.answers.map((app, index) => (
//                         <div key={index} className="mb-3">
//                             <p>{app.question.question_text}</p>
//                             <p>{app.answer_text}</p>
//                         </div>
//                     ))}
//                 </div>
//             </div>
//         </div>
//     );
// }
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
const ResumeCard = ({ resume }) => {
    // console.log(resume)

    return (
        <div className="bg-white p-3 mb-4 shadow-sm  text-center">
            <div className="card-body">
                <h4>Resume</h4>
                {resume ? (
                    <p>
                        <a href={`${process.env.REACT_APP_BACKEND}${resume.data.file}`} target="_blank" rel="noopener noreferrer">
                            View Resume
                        </a>
                    </p>
                ) : (
                    <p>No resume available.</p>
                )}
            </div>
        </div>
    );
};


const DetailCard = ({ title, data }) => {
    // console.log(data)
    if (!data || data.length === 0) {
        return (
            <div className="bg-white p-3 mb-4 shadow-sm ">
                <div className="card-body">
                    <h4>{title}</h4>
                    <p>No {title.toLowerCase()} available.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white p-3 mb-4 shadow-sm ">
            <div className="card-body">
                <h4>{title}</h4>
                {data.map((item, index) => (
                    <div key={index} className="mb-3 text-capitalize">
                        {Object.entries(item).map(([field, value]) => (
                            !field.includes("id") && (
                                <p key={field}>
                                    {field === "skill_name" ? (
                                        <span>{value || 'N/A'}</span>
                                    ) : (
                                        <>
                                            <strong>{field.replace(/_/g, ' ')}:</strong> {value || 'N/A'}
                                        </>
                                    )}
                                </p>
                            )
                        ))}
                        {index < data.length - 1 && <hr />}
                    </div>
                ))}
            </div>
        </div>
    );
};

const PersonalInfoCard = ({ personalInfo }) => {
    // Extract the address from personalInfo
    const { address, ...restOfPersonalInfo } = personalInfo;


    // Combine rest of personalInfo with address key-value pairs
    const updatedPersonalInfo = {
        ...restOfPersonalInfo,
        ...address[0] // Spread the address properties into the updatedPersonalInfo
    };


    return (
        <DetailCard
            title="Personal Information"
            data={[updatedPersonalInfo]} // Pass the updated personal info including address properties
        />
    );
};

export default function SingleApplicationDetails() {
    const { appId } = useParams();
    const [application, setApplication] = useState(null);
    const [profile, setProfile] = useState(null);
    const [error, setError] = useState(null);
    const [resume, setResume] = useState(true);

    useEffect(() => {
        const fetchApplication = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_COMPANY_URL}/applications/${appId}/`);
                const applicationData = response.data;

                const response2 = await axios.get(`${process.env.REACT_APP_API_URL}/profile/${applicationData.student_id}/`);
                const profileData = response2.data;
                const responseResume = await axios.get(`${process.env.REACT_APP_API_URL}/resume/${applicationData.student_id}/`);
                setResume(responseResume);

                setApplication(applicationData);
                setProfile(profileData);
            } catch (err) {
                setError('Error while getting application or profile data');
            }
        };

        fetchApplication();
    }, [appId]);

    const handleStatus = async (status) => {
        try {
            console.log(status);
            await axios.patch(`${process.env.REACT_APP_COMPANY_URL}/applications/${appId}/update_status/`, { status });
            setApplication((prev) => ({ ...prev, status }));
        } catch (err) {
            setError('Error updating application status.');
        }
    };

    if (error) {
        return <div className="alert alert-danger text-center" role="alert">{error}</div>;
    }

    if (!application || !profile) {
        return <div className="text-center mt-5">Loading application details...</div>;
    }

    // Filter out non-essential sections and split them into two columns
    const sections = Object.keys(profile).filter(
        (section) => section !== 'personal_info' && section !== 'resume'
    );

    // Divide sections equally between two columns
    const midIndex = Math.ceil(sections.length / 2);
    const column1Sections = sections.slice(0, midIndex);
    const column2Sections = sections.slice(midIndex);

    return (
        <div className="container mt-5">
            <h2 className="text-center mb-4">Application and Profile Details</h2>
            <div className="mb-4">
                <div className="card-body">
                    <div className="d-flex justify-content-between mb-4">
                        <button className="btn btn-success me-2 w-50" onClick={() => handleStatus("accepted")}>Accept</button>
                        <button className="btn btn-danger w-50" onClick={() => handleStatus("rejected")}>Reject</button>
                    </div>
                    <div className="d-flex justify-content-between">
                        <h5 className="card-title">Application ID: {application.id}</h5>
                        <p><strong>Job ID:</strong> {application.job_id}</p>
                    </div>
                    <p>
                        <strong>Status:</strong>
                        <span className={`badge ${application.status === 'accepted' ? 'bg-success' : 'bg-danger'}`}>
                            {application.status}
                        </span>
                    </p>
                </div>
            </div>




            <PersonalInfoCard personalInfo={profile.personal_info} />
            <div>
                {resume && (
                    <div>

                        <ResumeCard resume={resume} />
                    </div>
                )}
            </div>



            {/* Display sections in two columns */}
            <div className="row">
                <div className="col-md-6">
                    {column1Sections.map((section) => (
                        <DetailCard
                            key={section}
                            title={section.charAt(0).toUpperCase() + section.slice(1)}
                            data={Array.isArray(profile[section]) ? profile[section] : [profile[section]]}
                        />
                    ))}
                </div>
                <div className="col-md-6">
                    {column2Sections.map((section) => (
                        <DetailCard
                            key={section}
                            title={section.charAt(0).toUpperCase() + section.slice(1)}
                            data={Array.isArray(profile[section]) ? profile[section] : [profile[section]]}
                        />
                    ))}
                </div>
            </div>


            <div className="d-flex justify-content-between mb-5">
                <button className="btn btn-success me-2 w-50" onClick={() => handleStatus("accepted")}>Accept</button>
                <button className="btn btn-danger w-50" onClick={() => handleStatus("rejected")}>Reject</button>
            </div>
        </div>
    );
}
