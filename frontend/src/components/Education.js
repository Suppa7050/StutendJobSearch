import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Education = ({ education: initialEducation, email }) => {
    const [education, setEducation] = useState(initialEducation || []);
    const [newEducation, setNewEducation] = useState({
        institute_name: '',
        duration_from_year: '',
        duration_from_month: '',
        duration_to_year: '',
        duration_to_month: '',
        marks_or_grade: ''
    });
    const [editEducation, setEditEducation] = useState(null);
    const [showAddEducation, setShowAddEducation] = useState(false);

    useEffect(() => {
        if (initialEducation) {
            setEducation(initialEducation);
        }
    }, [initialEducation]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (editEducation) {
            setEditEducation({ ...editEducation, [name]: value });
        } else {
            setNewEducation({ ...newEducation, [name]: value });
        }
    };

    const handleAddEducation = async () => {
        try {
            const response = await axios.post(`${process.env.REACT_APP_COMPANY_URL}/education/manage/${email}/`, newEducation);
            setEducation([...education, { ...newEducation, id: response.data.id }]);
            setNewEducation({
                institute_name: '',
                duration_from_year: '',
                duration_from_month: '',
                duration_to_year: '',
                duration_to_month: '',
                marks_or_grade: ''
            });
            setShowAddEducation(false);
        } catch (error) {
            console.error('Error adding education:', error);
        }
    };

    const handleUpdateEducation = async () => {
        try {
            await axios.put(`${process.env.REACT_APP_COMPANY_URL}/education/manage/${email}/`, {
                ...editEducation,
                id: editEducation.id
            });
            const updatedEducation = education.map((edu) =>
                edu.id === editEducation.id ? editEducation : edu
            );
            setEducation(updatedEducation);
            setEditEducation(null);
        } catch (error) {
            console.error('Error updating education:', error);
        }
    };

    const handleDeleteEducation = async (id) => {
        try {
            await axios.delete(`${process.env.REACT_APP_COMPANY_URL}/education/manage/${email}/`, { data: { id } });
            setEducation(education.filter((edu) => edu.id !== id));
        } catch (error) {
            console.error('Error deleting education:', error);
        }
    };

    return (
        <div>
            <h2>Education Management</h2>
            <button onClick={() => setShowAddEducation(!showAddEducation)}>
                {showAddEducation ? 'Hide New Education Form' : 'Add New Education'}
            </button>
            {showAddEducation && (
                <div>
                    <input type="text" name="institute_name" placeholder="Institute Name" value={newEducation.institute_name} onChange={handleInputChange} />
                    <input type="number" name="duration_from_year" placeholder="From Year" value={newEducation.duration_from_year} onChange={handleInputChange} />
                    <input type="number" name="duration_from_month" placeholder="From Month" value={newEducation.duration_from_month} onChange={handleInputChange} />
                    <input type="number" name="duration_to_year" placeholder="To Year" value={newEducation.duration_to_year} onChange={handleInputChange} />
                    <input type="number" name="duration_to_month" placeholder="To Month" value={newEducation.duration_to_month} onChange={handleInputChange} />
                    <input type="text" name="marks_or_grade" placeholder="Marks/Grade" value={newEducation.marks_or_grade} onChange={handleInputChange} />
                    <button onClick={handleAddEducation}>Add Education</button>
                </div>
            )}

            <h3>Existing Education</h3>
            <ul>
                {education.map((edu) => (
                    <li key={edu.id}>
                        <span>{edu.institute_name} ({edu.duration_from_year}-{edu.duration_to_year})</span>
                        <button onClick={() => setEditEducation(edu)}>Edit</button>
                        <button onClick={() => handleDeleteEducation(edu.id)}>Delete</button>
                    </li>
                ))}
            </ul>

            {editEducation && (
                <div>
                    <h3>Edit Education</h3>
                    <input type="text" name="institute_name" placeholder="Institute Name" value={editEducation.institute_name} onChange={handleInputChange} />
                    <input type="number" name="duration_from_year" placeholder="From Year" value={editEducation.duration_from_year} onChange={handleInputChange} />
                    <input type="number" name="duration_from_month" placeholder="From Month" value={editEducation.duration_from_month} onChange={handleInputChange} />
                    <input type="number" name="duration_to_year" placeholder="To Year" value={editEducation.duration_to_year} onChange={handleInputChange} />
                    <input type="number" name="duration_to_month" placeholder="To Month" value={editEducation.duration_to_month} onChange={handleInputChange} />
                    <input type="text" name="marks_or_grade" placeholder="Marks/Grade" value={editEducation.marks_or_grade} onChange={handleInputChange} />
                    <button onClick={handleUpdateEducation}>Update Education</button>
                    <button onClick={() => setEditEducation(null)}>Cancel</button>
                </div>
            )}
        </div>
    );
};

export default Education;
