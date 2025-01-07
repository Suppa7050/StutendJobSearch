import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ManageResume = ({ userId }) => {
    const [resume, setResume] = useState(null);      // Stores the resume data
    const [selectedFile, setSelectedFile] = useState(null); // Stores the file chosen for upload/edit
    const [loading, setLoading] = useState(false);         // Loading state for actions
    const [error, setError] = useState(null);              // Error message state

    // Fetch the resume when the component mounts or userId changes
    useEffect(() => {
        fetchResume();
    }, [userId]);

    const fetchResume = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/resume/${userId}/`);
            setResume(response.data);
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to load resume');
        } finally {
            setLoading(false);
        }
    };

    const handleFileChange = (e) => {
        setSelectedFile(e.target.files[0]);
    };

    const handleUpload = async () => {
        if (!selectedFile) return alert('Please select a file to upload');
        
        const formData = new FormData();
        formData.append('file', selectedFile);  // Ensure the key here matches what the backend expects

        try {
            setLoading(true);
            const response = resume
                ? await axios.put(`${process.env.REACT_APP_API_URL}/resume/${userId}/`, formData)
                : await axios.post(`${process.env.REACT_APP_API_URL}/resume/${userId}/`, formData);

            console.log(response.data)
            setResume(response.data);
            setSelectedFile(null);
            alert('Resume uploaded successfully');
        } catch (err) {
            console.error("Upload error:", err.response?.data || err.message);  // Debugging line
            setError(err.response?.data?.error || 'Failed to upload resume');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!resume) return alert('No resume to delete');
        
        try {
            setLoading(true);
            await axios.delete(`${process.env.REACT_APP_API_URL}/resume/${userId}/`);
            setResume(null);
            alert('Resume deleted successfully');
        } catch (err) {
            console.error("Delete error:", err.response?.data || err.message);  // Debugging line
            setError(err.response?.data?.error || 'Failed to delete resume');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='d-flex justify-content-center align-items-center my-3 shadow bg-white p-4'>
        <div className="manage-resume  " >
            <div className='d-flex mb-3 justify-content-center text-uppercase text-muted '><h3>Manage Resume</h3></div>
            
            {loading && <p>Loading...</p>}
            {error && <p className="text-danger">{error}</p>}

            {/* Display existing resume */}
            {resume ? (
                <div className="d-flex justify-content-between">
                    <span>Resume:</span>
                    {/* Ensure resume.file is a valid URL */}
                    {/* Adjust the URL format if necessary */}
                    <a href={`http://localhost:8000${resume.file}`} target="_blank" rel="noopener noreferrer">
                        View Resume
                    </a>

                    <button className="btn btn-outline-danger fas fa-trash mx-2 border-0" onClick={handleDelete}>
                        
                    </button>
                </div>
            ) : (
                <p>No resume uploaded</p>
            )}

            {/* File input and upload/edit button */}
            <div className="mt-3 text-center">
                <input type="file" accept=".pdf" onChange={handleFileChange} />
                <button
                    className="btn btn-warning mx-2"
                    onClick={handleUpload}
                    disabled={!selectedFile || loading}
                >
                    {resume ? 'Edit Resume' : 'Upload Resume'}
                </button>
            </div>
        </div>
        </div>
    );
};

export default ManageResume;
