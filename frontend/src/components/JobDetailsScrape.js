import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const JobDetailsScrape = () => {
    const { jobUrl } = useParams();
    const navigate = useNavigate();

    const [jobDetails, setJobDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [resumeScore, setResumeScore] = useState(null);
    const [resumeFile, setResumeFile] = useState(null); // For file upload
    const [studentId, setStudentId] = useState(localStorage.getItem('student_id'));
    const [showFileUpload, setShowFileUpload] = useState(false); // Control file upload visibility

    useEffect(() => {
        const fetchJobDetails = async () => {
            try {
                setLoading(true);
                const encodedJobUrl = encodeURIComponent(jobUrl);
                const response = await axios.get(`${process.env.REACT_APP_COMPANY_URL}/jobs/${encodedJobUrl}/`);
                setJobDetails(response.data.job_component_html);
            } catch (err) {
                setError("Error fetching scraped job details");
            } finally {
                setLoading(false);
            }
        };

        if (jobUrl) {
            fetchJobDetails();
        }
    }, [jobUrl]);

    const handleCheckResumeScoreWithJD = async () => {
        try {
            const formData = new FormData();
            formData.append('student_id', studentId);

            if (resumeFile) {
                formData.append('file', resumeFile);
            }

            if (jobDetails && jobDetails["Job Description"]) {
                formData.append('job_description', jobDetails["Job Description"]);
            } else {
                alert("Job description is not available for scoring.");
                return;
            }

            const response = await axios.post(`${process.env.REACT_APP_API_URL}/resume/match_jd/`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            setResumeScore(response.data.match_percentage);
            alert(`Resume match score: ${response.data.match_percentage}%`);
            setShowFileUpload(false);
        } catch (err) {
            if (err.response && err.response.data.error === 'No resume file uploaded.') {
                setShowFileUpload(true);
                alert("No resume found. Please choose a file to upload.");
            } else {
                alert("Error calculating resume score.");
            }
        }
    };

    if (loading) {
        return (
            <div className="text-center mt-4">
                <div className="spinner-border" role="status">
                    <span className="sr-only">Loading...</span>
                </div>
            </div>
        );
    }

    if (error) {
        return <div className="alert alert-danger text-center mt-4">{error}</div>;
    }

    if (!jobDetails) {
        return <div className="alert alert-warning text-center mt-4">No job details available</div>;
    }

    const applyLink = jobDetails["Apply Link"]?.trim() === "Not available" ? jobUrl : jobDetails["Apply Link"] || jobUrl;

    return (
        <div className="container mt-5">
            <div className="shadow p-4 bg-white rounded">
                <h2 className="mb-4">{jobDetails["Job Title"]}</h2>
                <p><strong>Company:</strong> {jobDetails.Company}</p>
                <p><strong>Location:</strong> {jobDetails.Location}</p>
                <p><strong>Job Type:</strong> {jobDetails["Job Type"]}</p>
                <p>
                    
                    {jobDetails["Job Requirements"]?.match(/Salary range: ([\d,K\s]+)/)?.[1] && <div><strong>Salary:</strong> ₹
                        jobDetails["Job Requirements"]?.match(/Salary range: ([\d,K\s]+)/)?.[1]
                    </div>
                    }
                </p>
                <p><strong>Job Description:</strong></p>
                <p>{jobDetails["Job Description"]}</p>
                <a
                    href={applyLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-primary mt-3"
                >
                    Apply Now
                </a>
                <div className="mt-4">
                    <input
                        type="file"
                        onChange={(e) => setResumeFile(e.target.files[0])}
                        style={{ display: showFileUpload ? "block" : "none" }}
                    />
                    <button onClick={handleCheckResumeScoreWithJD} className="btn btn-secondary mt-3">
                        Check Resume Match Score
                    </button>
                </div>
                {resumeScore !== null && (
                    <div className="alert alert-info mt-3">
                        Resume Match Score: {resumeScore}%
                    </div>
                )}
            </div>
        </div>
    );
};

export default JobDetailsScrape;
