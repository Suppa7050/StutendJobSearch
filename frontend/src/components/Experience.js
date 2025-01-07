import React, { useState ,useEffect} from 'react';
import axios from 'axios';

const Experience = ({ email, experiences: initialExperiences }) => {
   
    const [experiences, setExperiences] = useState(initialExperiences);
    const [newExperience, setNewExperience] = useState({
        employer: '',
        location: '',
        role_title: '',
        duration_from_year: '',
        duration_from_month: '',
        duration_to_year: '',
        duration_to_month: '',
        description: '',
        skills: ''
    });
    useEffect(() => {
        // console.log('Initial experiences:', initialExperiences);
        if (initialExperiences) {
            setExperiences(initialExperiences); // Set experiences if initialExperiences is provided
        }
    }, [initialExperiences]);

    const [editExperience, setEditExperience] = useState(null);
    const [showNewExperienceForm, setShowNewExperienceForm] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (editExperience) {
            setEditExperience({ ...editExperience, [name]: value });
        } else {
            setNewExperience({ ...newExperience, [name]: value });
        }
    };

    const handleAddExperience = async () => {
        try {
            const response = await axios.post(`${process.env.REACT_APP_COMPANY_URL}/experience/manage/${email}/`, newExperience);
            setExperiences([...experiences, { ...newExperience, id: response.data.id }]);
            setNewExperience({
                employer: '',
                location: '',
                role_title: '',
                duration_from_year: '',
                duration_from_month: '',
                duration_to_year: '',
                duration_to_month: '',
                description: '',
                skills: ''
            });
            setShowNewExperienceForm(false);
        } catch (error) {
            console.error('Error adding experience:', error);
        }
    };

    const handleUpdateExperience = async () => {
        try {
            await axios.put(`${process.env.REACT_APP_COMPANY_URL}/experience/manage/${email}/`, {
                ...editExperience,
                id: editExperience.id
            });
            const updatedExperiences = experiences.map((exp) =>
                exp.id === editExperience.id ? editExperience : exp
            );
            setExperiences(updatedExperiences);
            setEditExperience(null);
        } catch (error) {
            console.error('Error updating experience:', error);
        }
    };

    const handleDeleteExperience = async (id) => {
        try {
            await axios.delete(`${process.env.REACT_APP_COMPANY_URL}/experience/manage/${email}/`, { data: { id } });
            setExperiences(experiences.filter((exp) => exp.id !== id));
        } catch (error) {
            console.error('Error deleting experience:', error);
        }
    };

    return (
        
        <div>

            <h2>Experience Management</h2>
            <button onClick={() => setShowNewExperienceForm(!showNewExperienceForm)}>
                {showNewExperienceForm ? 'Hide New Experience Form' : 'Add New Experience'}
            </button>
            {showNewExperienceForm && (
                <div>
                    <input type="text" name="employer" placeholder="Employer" value={newExperience.employer} onChange={handleInputChange} />
                    <input type="text" name="location" placeholder="Location" value={newExperience.location} onChange={handleInputChange} />
                    <input type="text" name="role_title" placeholder="Role Title" value={newExperience.role_title} onChange={handleInputChange} />
                    <input type="number" name="duration_from_year" placeholder="From Year" value={newExperience.duration_from_year} onChange={handleInputChange} />
                    <input type="number" name="duration_from_month" placeholder="From Month" value={newExperience.duration_from_month} onChange={handleInputChange} />
                    <input type="number" name="duration_to_year" placeholder="To Year" value={newExperience.duration_to_year} onChange={handleInputChange} />
                    <input type="number" name="duration_to_month" placeholder="To Month" value={newExperience.duration_to_month} onChange={handleInputChange} />
                    <textarea name="description" placeholder="Description" value={newExperience.description} onChange={handleInputChange}></textarea>
                    <input type="text" name="skills" placeholder="Skills" value={newExperience.skills} onChange={handleInputChange} />
                    <button onClick={handleAddExperience}>Add Experience</button>
                </div>
            )}

            <h3>Existing Experiences</h3>
            <ul>
                {experiences.map((experience) => (
                    <li key={experience.id}>
                        <span>{experience.role_title} at {experience.employer}</span>
                        <button onClick={() => setEditExperience(experience)}>Edit</button>
                        <button onClick={() => handleDeleteExperience(experience.id)}>Delete</button>
                    </li>
                ))}
            </ul>

            {editExperience && (
                <div>
                    <h3>Edit Experience</h3>
                    <input type="text" name="employer" placeholder="Employer" value={editExperience.employer} onChange={handleInputChange} />
                    <input type="text" name="location" placeholder="Location" value={editExperience.location} onChange={handleInputChange} />
                    <input type="text" name="role_title" placeholder="Role Title" value={editExperience.role_title} onChange={handleInputChange} />
                    <input type="number" name="duration_from_year" placeholder="From Year" value={editExperience.duration_from_year} onChange={handleInputChange} />
                    <input type="number" name="duration_from_month" placeholder="From Month" value={editExperience.duration_from_month} onChange={handleInputChange} />
                    <input type="number" name="duration_to_year" placeholder="To Year" value={editExperience.duration_to_year} onChange={handleInputChange} />
                    <input type="number" name="duration_to_month" placeholder="To Month" value={editExperience.duration_to_month} onChange={handleInputChange} />
                    <textarea name="description" placeholder="Description" value={editExperience.description} onChange={handleInputChange}></textarea>
                    <input type="text" name="skills" placeholder="Skills" value={editExperience.skills} onChange={handleInputChange} />
                    <button onClick={handleUpdateExperience}>Update Experience</button>
                    <button onClick={() => setEditExperience(null)}>Cancel</button>
                </div>
            )}
        </div>
    );
};

export default Experience;
