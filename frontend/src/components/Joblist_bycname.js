// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { useParams ,useNavigate} from 'react-router-dom'; // Import useParams to get route parameters
// import JobCard from './JobCard';
// const Joblist_bycname = ({isSidebarOpen}) => {
//     const { id } = useParams(); // Get the company ID from the URL parameters
//     const [jobs, setJobs] = useState([]);
//     const [error, setError] = useState(null);

//     useEffect(() => {
//         if (id) {
//             handleSearch(); // Automatically fetch jobs when the component mounts
//         }
//     }, [id]);
//     const navigate=useNavigate();
//     const handleSearch = async () => {
//         try {
//             const response = await axios.get(`${process.env.REACT_APP_API_URL}\/${id}/jobs/`);
//             setJobs(response.data);
//             console.log(response.data)
//             setError(null); // Clear any previous errors
//         } catch (err) {
//             setError('Failed to fetch jobs. Please try again.');
//             setJobs([]); // Clear jobs if there's an error
//         }
//     };
//     const handleApplication = async (jobId) => {
//         navigate(`/company/jobs/${jobId}/applications`);
//     };

//     return (
//         <div className="container my-4">
//             <h1 className="mb-4">Job Listings for Company ID: {id}</h1>

//             {error && <p className="text-danger">{error}</p>}

//             <div className="row">
//                 {jobs.length > 0 ? (
//                     jobs.map(job => (
//                         <div key={job.job_id} className="col-md-4 mb-4">
//                             <div className="card">
//                                 <div className="card-body">
//                                     <h5 className="card-title">{job.job_name}</h5>
//                                     <p className="card-text">{job.job_description}</p>
//                                     <p className="card-text"><strong>Role:</strong> {job.job_role}</p>
//                                     <p className="card-text"><strong>Last Date:</strong> {job.last_date}</p>
//                                 </div>
//                                 <div className="card-footer">
//                                     <button onClick={()=>handleApplication(job.job_id)}>Check Applications</button>
//                                 </div>

//                             </div>
//                         </div>
//                     ))
//                 ) : (
//                     <div className="col-12">
//                         <div className="card text-center">
//                             <div className="card-body">
//                                 <h5 className="card-title">No Job Listings Available</h5>
//                             </div>
//                         </div>
//                     </div>
//                 )}
//             </div>
//         </div>
//         // <div className="container mt-5">
//         //     <h2 className="text-center mb-4">Jobs</h2>
//         //     {jobs.length > 0 ? (
//         //         <div className="row justify-content-center">
                    
//         //             {jobs.map((job) => (
//         //                 <JobCard
//         //                     key={job.id}
//         //                     job={job}
//         //                     // isApplied={appliedJobs.includes(job.id)}
//         //                     // onApplyClick={() => console.log(`Applying for job ${job.id}`)}
//         //                     isSidebarOpen={isSidebarOpen}
//         //                 />
//         //             ))}
//         //         </div>
//         //     ) : (
//         //         <p>No jobs found.</p>
//         //     )}
//         // </div>
//     );
// };

// export default Joblist_bycname;
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const Joblist_bycname = ({ isSidebarOpen }) => {
    const { id } = useParams(); // Get the company ID from the URL parameters
    const [jobs, setJobs] = useState([]);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (id) {
            handleSearch(); // Automatically fetch jobs when the component mounts
        }
    }, [id]);

    const handleSearch = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_COMPANY_URL}\/${id}/jobs/`);
            setJobs(response.data);
           
            setError(null); // Clear any previous errors
        } catch (err) {
            setError('Failed to fetch jobs. Please try again.');
            setJobs([]); // Clear jobs if there's an error
        }
    };

    const handleApplication = (jobId) => {
        navigate(`/company/jobs/${jobId}/applications`);
    };

    return (
        <div className="container my-4">
            {/* <h1 className="mb-4">Job Listings for Company ID: {id}</h1> */}

            {error && <p className="text-danger">{error}</p>}

            <div className="row d-flex justify-content-center">
                {jobs.length > 0 ? (
                    jobs.map(job => (
                        <div key={job.job_id} className={`${isSidebarOpen ? 'col-md-9' : 'col-md-5'} mb-4 ms-4 bg-white p-0`}>
                            <div className="shadow" onClick={() =>navigate(`/company/jobs/${job.job_id}/applications`)} style={{ cursor: 'pointer' }}>
                                <div className="d-flex justify-content-between border-bottom p-3">
                                    <h3 className="card-title text-capitalize text-truncate">
                                        {job.job_name}
                                    </h3>
                                    {/* <p className="card-title text-capitalize fst-italic text-muted p-0 fw-bolder ms-3">
                                        {job.company?.location || 'Location not specified'}
                                    </p> */}
                                </div>
                                <div className="card-body p-3">
                                    <div className="d-flex justify-content-between">
                                       
                                        <p className="card-text text-capitalize">{job.salary}<span> Lpa</span></p>
                                        <p className="card-text text-capitalize">{job.type}</p>
                                    </div>
                                    <p className="card-text truncate-two-lines">{job.job_description}</p>
                                    <div className="d-flex justify-content-between mb-3">
                                        <div className="d-flex flex-row">
                                            <p className="card-text text-capitalize m-0"><strong>Last Date :</strong></p>
                                            <p className="card-text text-capitalize ms-2">{job.last_date}</p>
                                        </div>
                                        <p className="card-text text-capitalize">Experience:<strong>{job.experience}</strong></p>
                                    </div>
                                </div>
                                <div className="d-flex justify-content-center">
                                    <button onClick={() => handleApplication(job.job_id)} className="btn btn-dark rounded-0 w-100">
                                        Check Applications
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="col-12">
                        <div className="card text-center">
                            <div className="card-body">
                                <h5 className="card-title">No Job Listings Available</h5>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Joblist_bycname;
