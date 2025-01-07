import React, { useState } from 'react';
import axios from 'axios';

const CreateJob = ({ id }) => {
    const [jobName, setJobName] = useState('');
    const [jobRole, setJobRole] = useState('');
    const [companyId, setCompanyId] = useState(id);
    const [jobDescription, setJobDescription] = useState('');
    const [experience, setExperience] = useState('');
    const [salary, setSalary] = useState('');
    const [lastDate, setLastDate] = useState('');
    const [questions, setQuestions] = useState([{ question_text: '' }]);
    const [mandatorySkills, setMandatorySkills] = useState([]);
    const [preferredSkills, setPreferredSkills] = useState([]);
    const [newMandatorySkill, setNewMandatorySkill] = useState(''); // Separate state for mandatory skills
    const [newPreferredSkill, setNewPreferredSkill] = useState(''); // Separate state for preferred skills
    const [jobType, setJobType] = useState('');
    const [message, setMessage] = useState('');

    const handleQuestionChange = (index, value) => {
        const newQuestions = [...questions];
        newQuestions[index].question_text = value;
        setQuestions(newQuestions);
    };

    const handleAddQuestion = () => {
        setQuestions([...questions, { question_text: '' }]);
    };

    const handleRemoveQuestion = (index) => {
        const newQuestions = questions.filter((_, i) => i !== index);
        setQuestions(newQuestions);
    };

    const handleAddSkill = (mandatory) => {
        if (mandatory) {
            if (!newMandatorySkill) return;
            setMandatorySkills([...mandatorySkills, newMandatorySkill]);
            setNewMandatorySkill(''); // Clear input after adding
        } else {
            if (!newPreferredSkill) return;
            setPreferredSkills([...preferredSkills, newPreferredSkill]);
            setNewPreferredSkill(''); // Clear input after adding
        }
    };

    const handleRemoveSkill = (skill, mandatory = true) => {
        if (mandatory) {
            setMandatorySkills(mandatorySkills.filter((s) => s !== skill));
        } else {
            setPreferredSkills(preferredSkills.filter((s) => s !== skill));
        }
    };
    const handleKeyDown = (e, mandatory) => {
        if (e.key === 'Enter') {
            e.preventDefault(); // Prevent form submission
            handleAddSkill(mandatory); // Call the function to add skill
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${process.env.REACT_APP_COMPANY_URL}/create_job/`, {
                job_name: jobName,
                job_role: jobRole,
                company_id: companyId,
                job_description: jobDescription,
                experience,
                type: jobType,
                salary,
                last_date: lastDate,
                questions,
                required_skills: [
                    ...mandatorySkills.map((skill) => ({ skill_name: skill, mandatory_flag: true })),
                    ...preferredSkills.map((skill) => ({ skill_name: skill, mandatory_flag: false }))
                ],
                
            });
            setMessage('Job created successfully!');
            setJobName('');
            setJobRole('');
            setCompanyId('');
            setJobDescription('');
            setExperience('');
            setSalary('');
            setLastDate('');
            setQuestions([{ question_text: '' }]);
            setMandatorySkills([]);
            setPreferredSkills([]);
            alert("Successfully created")
        } catch (error) {
            setMessage('Failed to create job. Please try again.');
        }
    };

    return (
        <div className="container bg-white shadow col-11">

            <form onSubmit={handleSubmit} className='m-5  '>
                <div className=" mb-3">
                    <h1 className="p-3 text-center">Create Job</h1>
                    <div className="mb-3">
                        {/* <label className="form-label">Job Name</label> */}
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Job Name"
                            value={jobName}
                            onChange={(e) => setJobName(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        {/* <label className="form-label">Job Role</label> */}
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Job Role"
                            value={jobRole}
                            onChange={(e) => setJobRole(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        {/* <label className="form-label">Job Type</label> */}

                        <input
                            type="text"
                            className="form-control"
                            placeholder="Job Type"
                            value={jobType}
                            onChange={(e) => setJobType(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        {/* <label className="form-label">Job Description</label> */}
                        <textarea
                            className="form-control"
                            placeholder="Job Description"
                            value={jobDescription}
                            onChange={(e) => setJobDescription(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        {/* <label className="form-label">Experience</label> */}
                        <input
                            type="number"
                            className="form-control"
                            placeholder="Years of Experience"
                            value={experience}
                            onChange={(e) => setExperience(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        {/* <label className="form-label">Salary</label> */}
                        <input
                            type="number"
                            className="form-control"
                            placeholder="Salary"
                            value={salary}
                            onChange={(e) => setSalary(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        {/* <label className="form-label">Last Date to Apply</label> */}
                        <input
                            type="date"
                            className="form-control"
                            value={lastDate}
                            onChange={(e) => setLastDate(e.target.value)}
                            required
                        />
                    </div>

                    {/* Questions Section */}
                    <div className='d-flex flex-row justify-content-around gap-5'>
                        <h3>Questions</h3>
                        <button
                            type="button"
                            className="btn btn-link mb-3"
                            onClick={handleAddQuestion}
                        >
                            Add +
                        </button>
                    </div>
                    {questions.map((question, index) => (
                        <div key={index} className="mb-3">
                            {/* <label className="form-label">{`Question ${index + 1}`}</label> */}
                            <div className="input-group">
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder={`Question ${index + 1}`}
                                    value={question.question_text}
                                    onChange={(e) => handleQuestionChange(index, e.target.value)}
                                    required
                                />
                                <button
                                    type="button"
                                    className="btn btn-danger"
                                    onClick={() => handleRemoveQuestion(index)}
                                >
                                    Remove
                                </button>
                            </div>
                        </div>
                    ))}

                    {/* Skills Section */}
                    <div className="mb-3">
                        {/* <label className="form-label">Add Skills</label> */}

                        {/* Input for Mandatory Skills */}
                        <div className="input-group mb-2">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Add a mandatory skill"
                                value={newMandatorySkill} // Use separate state
                                onChange={(e) => setNewMandatorySkill(e.target.value)}
                                onKeyDown={(e) => handleKeyDown(e, true)} // Add the handler
                            />
                            <button
                                type="button"
                                className="btn btn-dark "
                                onClick={() => handleAddSkill(true)}
                            >
                                Add Mandatory Skill
                            </button>
                        </div>

                        {/* Input for Preferred Skills */}
                        <div className="input-group mb-2">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Add a preferred skill"
                                value={newPreferredSkill} // Use separate state
                                onChange={(e) => setNewPreferredSkill(e.target.value)}
                                onKeyDown={(e) => handleKeyDown(e, true)} // Add the handler
                            />
                            <button
                                type="button"
                                className="btn btn-dark"
                                onClick={() => handleAddSkill(false)}
                            >
                                Add Preferred Skill
                            </button>
                        </div>
                    </div>

                    {/* Display Mandatory Skills */}
                    {mandatorySkills && mandatorySkills.length > 0 &&(<div className="mb-3">
                        <h5>Mandatory Skills</h5>
                        {mandatorySkills.map((skill, index) => (
                            <div key={index} className="badge bg-secondary m-1">
                                {skill} <span onClick={() => handleRemoveSkill(skill, true)}>&times;</span>
                            </div>
                        ))}
                    </div>)}


                    {/* Display Preferred Skills */}
                    {preferredSkills && preferredSkills.length > 0 && (
                        <div className="mb-3">
                            <h5>Preferred Skills</h5>
                            {preferredSkills.map((skill, index) => (
                                <div key={index} className="badge bg-secondary m-1">
                                    {skill} <span onClick={() => handleRemoveSkill(skill, false)}>&times;</span>
                                </div>
                            ))}
                        </div>
                    )}



                    <button type="submit" className="btn btn-dark w-100 rounded-0 mb-5">Create Job</button>
                </div>
            </form>
            {message && <p className="mt-4 mb-3 alert alert-info">{message}</p>}
        </div>
    );
};

export default CreateJob;
