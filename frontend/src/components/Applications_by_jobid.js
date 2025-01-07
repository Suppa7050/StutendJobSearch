// src/components/ApplicationsList.js

import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Applications_by_jobid = ({ jobId }) => {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchApplications = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}\/jobs/${jobId}/applications/`);
               
                setApplications(response.data);
            } catch (error) {
                setError('Failed to fetch applications.');
            } finally {
                setLoading(false);
            }
        };

        if (jobId) {
            fetchApplications();
        }
    }, [jobId]);

    if (loading) return <p>Loading applications...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div>
            <h2>Applications for Job ID: {jobId}</h2>
            {applications.length > 0 ? (
                <ul>
                    {applications.map(application => (
                        <li key={application.id}>
                            <p><strong>Application ID:</strong> {application.id}</p>
                            <p><strong>Student ID:</strong> {application.student_id}</p>
                            <p><strong>Job ID:</strong> {application.job_id}</p>
                            <h4>Answers:</h4>
                            <ul>
                                {application.answers && application.answers.map(answer => (
                                    <li key={answer.id}>
                                        <p><strong>Question ID:</strong> {answer.question_id}</p>
                                        <p><strong>Answer Text:</strong> {answer.answer_text}</p>
                                    </li>
                                ))}
                            </ul>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No applications found for this job.</p>
            )}
        </div>
    );
};

export default Applications_by_jobid;
