import React, { useEffect, useState } from 'react';
import axios from 'axios';
import JobCard from './JobCard';

const AppliedJobs = ({isSidebarOpen}) => {
    const userId = localStorage.getItem('student_id');
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchApplications = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_COMPANY_URL}/applications/student/${userId}/`);
                const applicationIds = response.data.application_ids;

                const applicationDetails = await Promise.all(
                    applicationIds.map(async (appId) => {
                        const appResponse = await axios.get(`${process.env.REACT_APP_COMPANY_URL}/applications/${appId}/`);
                        const jobResponse = await axios.get(`${process.env.REACT_APP_COMPANY_URL}/jobs/${appResponse.data.job_id}/`);
                        
                        // Format the job data to match the JobCard structure
                        const formattedJob = {
                            ...jobResponse.data,
                            id:appResponse.data.job_id,
                            company: {
                                name: jobResponse.data.company_details.name,
                                location: jobResponse.data.company_details.location,
                            }
                        };
                        
                        return { ...appResponse.data, job: formattedJob };
                    })
                );
               
                setApplications(applicationDetails);
            } catch (err) {
                setError('Error fetching applications');
            } finally {
                setLoading(false);
            }
        };

        fetchApplications();
    }, [userId]);

    if (loading) return <div>Loading applications...</div>;
    if (error) return <div className="alert alert-danger">{error}</div>;

    return (
        <div className="container mt-5">
            <h2 className="text-center mb-4">Applied Jobs</h2>
            {applications.length > 0 ? (
                <div className="row justify-content-center">
                    {applications.map((application) => (
                        <JobCard
                            key={application.id}
                            job={application.job}
                            isApplied={true}
                            isSidebarOpen={isSidebarOpen}
                            status={application.status}
                        />
                    ))}
                </div>
            ) : (
                <div>No applications found.</div>
            )}
        </div>
    );
};

export default AppliedJobs;
