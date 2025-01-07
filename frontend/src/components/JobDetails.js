import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Login from './Login';
import { useParams } from 'react-router-dom';

const JobDetails = () => {
    const { jobId } = useParams();
    const [job, setJob] = useState({});
    const [appliedJobs, setAppliedJobs] = useState([]); // Array to hold job IDs of applied jobs
    const [selectedJobId, setSelectedJobId] = useState(null);
    const [answers, setAnswers] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('student_id'));
    const [studentId, setStudentId] = useState(localStorage.getItem('student_id'));
    const [showLogin, setShowLogin] = useState(!isLoggedIn);
    const [resumeScore, setResumeScore] = useState(null);
    const [resumeFile, setResumeFile] = useState(null);
    const [showFileUpload, setShowFileUpload] = useState(false);
    useEffect(() => {
        const fetchAppliedJobs = async () => {
            try {
                if (studentId) {
                    // Get application IDs for the student
                    const applicationIdsResponse = await axios.get(`${process.env.REACT_APP_COMPANY_URL}\/applications/student/${studentId}/`);
                    const applicationIds = applicationIdsResponse.data.application_ids;
    
                    // Fetch job IDs for each application
                    const appliedJobIds = await Promise.all(
                        applicationIds.map(async (appId) => {
                            const appResponse = await axios.get(`${process.env.REACT_APP_COMPANY_URL}\/applications/${appId}/`);
                            return appResponse.data.job_id; // Extract job_id directly
                        })
                    );
    
                    console.log(appliedJobIds);
                    setAppliedJobs(appliedJobIds);
                }
                // const appliedResponse = await axios.get(`${process.env.REACT_APP_COMPANY_URL}\/applications/student/${studentId}/`);
                // console.log("Applied Jobs IDs:", appliedResponse.data.application_ids);
                // setAppliedJobs(appliedResponse.data.application_ids); // Store job IDs directly
            } catch (err) {
                setError('Error fetching applied jobs');
            }
        };

        if (studentId) fetchAppliedJobs();
    }, [studentId]);

    useEffect(() => {
        const fetchJob = async () => {
            try {
                const jobDetails = await axios.get(`${process.env.REACT_APP_COMPANY_URL}\/jobs/${jobId}/`);
               console.log(jobDetails.data)
                setJob(jobDetails.data);
            } catch (err) {
                setError('Error fetching job details');
            } finally {
                setLoading(false);
            }
        };

        fetchJob();
    }, [jobId]);

    const handleApply = (jobId) => {
        setSelectedJobId(selectedJobId === jobId ? null : jobId);
    };

    const handleAnswerChange = (questionId, answerText) => {
        setAnswers((prevAnswers) => ({ ...prevAnswers, [questionId]: answerText }));
    };
    const handleCheckResumeScore = async () => {
        try {
            const formData = new FormData();
            formData.append('student_id', studentId);

            if (resumeFile) {
                formData.append('file', resumeFile);  // Append file to FormData
            }
           
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/resume/match/${jobId}/`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            setResumeScore(response.data.match_percentage);
            alert(`Resume match score: ${response.data.match_percentage}%`);
            setShowFileUpload(false);
        } catch (err) {
            if (err.response && err.response.data.error === 'No resume file uploaded.') {
                setShowFileUpload(true); // Show file upload if no resume found
                alert("No resume found. Please choose a file to upload.");
            } else {
                alert("Error calculating resume score");
            }
        }
    };
    const handleSubmitApplication = async (jobId) => {
        // Check if all answer fields are filled
        const allAnswersFilled = Object.values(answers).every(answer => answer.trim() !== '');
        
        if (!allAnswersFilled) {
            setError('Please fill in all required answer fields.'); // Set error message
            return; // Prevent submission if fields are empty
        }

        const formattedAnswers = Object.keys(answers).map((questionId) => ({
            question_id: questionId,
            answer_text: answers[questionId],
        }));

        try {
          
            await axios.post(`${process.env.REACT_APP_COMPANY_URL}\/create_application/`, {
                student_id: studentId,
                job_id: jobId,
                answers: formattedAnswers,
            });
            alert(`Successfully applied for job: ${jobId}`);
            setAppliedJobs((prev) => [...prev, jobId]); // Update applied jobs list with new application
            setSelectedJobId(null);
            setAnswers({});
            setError(null); // Clear any previous error
        } catch (error) {
            // Check if the error response includes information about missing mandatory skills
            if (error.response && error.response.data && error.response.data.error) {
                const missingSkillsMessage = error.response.data.error;
                setError(missingSkillsMessage); // Set error state to display it in the component
            } else {
                setError(`Error applying for job: ${jobId}`); // General error message
            }
        }
    };

    const handleLogin = (email, studentId) => {
        localStorage.setItem('student_id', studentId);
        setIsLoggedIn(true);
        setStudentId(studentId);
        setShowLogin(false);
    };

    if (loading) return <div className="text-center mt-4"><div className="spinner-border" role="status"><span className="sr-only">Loading...</span></div></div>;

    // Convert jobId from useParams to number to ensure exact match
    const currentJobId = Number(jobId);
   
    const isApplied = appliedJobs.includes(currentJobId);

    return (
        <div className="container mt-5">

            {showLogin && (
                <div className="mb-4">
                    <h4>Please Login to Apply for Jobs</h4>
                    <Login onLogin={handleLogin} />
                </div>
            )}

            <div className='d-flex justify-content-between '>
                <button
                    onClick={() => handleCheckResumeScore(job.id)}
                    className="btn btn-dark mb-3"
                >
                    Check Resume Score
                </button>
                <div>
                    {resumeScore && (
                        <>
                            <strong>Resume Score :<span className='alert alert-dark w-25 rounded-5'>{resumeScore}</span></strong>
                            
                        </>)

                    }
                </div>
            </div>
            <div className="shadow p-4 bg-white">
                <div className="card-body">
                    <h3 className="card-title">
                        {job.job_name}
                    </h3>
                    <h5 className="card-subtitle mb-2 text-muted mb-5">
                        {job.company_details?.name}
                    </h5>
                    <div className='ms-2'>
                        <p className="card-text"><strong>Location:</strong> {job.company_details?.location}</p>
                        <p className="card-text"><strong>Experience:</strong> {job.experience} years</p>
                        <p className="card-text"><strong>Job Type:</strong> {job.type}</p>
                        <p className="card-text"><strong>Salary:</strong> ₹{job.salary}Lpa</p>
                        <p className="card-text mb-5"><strong>Last Date to Apply:</strong> {job.last_date}</p>
                    </div>
                    <p><strong>Job Description</strong></p>
                    <p className="card-text mb-5">{job.job_description}</p>

                    {/* Required Skills */}
                    <h5>Required Skills</h5>
                    {/* Mandatory Skills */}
                    <h6>Mandatory Skills</h6>
                    <div className="d-flex flex-wrap mb-3">
                        {job.required_skills?.filter(skill => skill.mandatory_flag).map((skill, index) => (
                            <p key={index} className="alert alert-dark d-inline-block me-2 height mb-2 w-auto">
                                {skill.skill_name}
                            </p>
                        ))}
                    </div>


                    {/* Preferred Skills */}
                    <h6>Preferred Skills</h6>
                    <div className="d-flex flex-wrap mb-3">
                        {job.required_skills?.filter(skill => !skill.mandatory_flag).map((skill, index) => (
                            <p key={index} className="alert alert-success d-inline-block me-2 mb-2 w-auto">
                                {skill.skill_name}
                            </p>
                        ))}
                    </div>


                    {/* Apply Button */}
                    {isApplied ? (
                        <button className="btn btn-secondary mb-3  w-50" disabled>Applied</button>
                    ) : (
                        <button
                            onClick={() => handleApply(currentJobId)}
                            className="btn btn-dark mb-3 w-50"
                        >
                            APPLY
                        </button>
                    )}

                    {/* Show questions and input fields */}
                    {selectedJobId === currentJobId && isLoggedIn && job.questions.length>0 && !isApplied && (
                        <div>

                            <h5>Answer the following questions:</h5>
                            <ul className="list-group border-0  mb-3">
                                {job.questions.map((question) => (
                                    <li key={question.id} className="list-group-item bg-body-tertiary">
                                        <p>{question.question_text}</p>
                                        <input
                                            type="text"
                                            placeholder="Your answer"
                                            value={answers[question.id] || ''}
                                            onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                                            className="form-control mb-2 border-0"
                                            required
                                        />
                                    </li>
                                ))}
                            </ul>
                            <button
                                onClick={() => handleSubmitApplication(currentJobId)}
                                className="btn btn-success"
                            >
                                Submit Application
                            </button>
                            {/* Display error message below the button */}
                            {error && <div className="alert alert-danger mt-3">{error}</div>}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default JobDetails;
