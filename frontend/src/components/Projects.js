import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Projects = ({ projects: initialProjects, email }) => {
    const [projects, setProjects] = useState(initialProjects);
    const [showNewProjectForm, setShowNewProjectForm] = useState(false);
    const [newProject, setNewProject] = useState({
        title: '',
        description: '',
        link: '',
        duration_from_year: '',
        duration_from_month: '',
        duration_to_year: '',
        duration_to_month: '',
        skills: ''
    });
    const [editProject, setEditProject] = useState(null);

    useEffect(() => {
        setProjects(initialProjects);
    }, [initialProjects]);

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        if (editProject) {
            setEditProject({ ...editProject, [name]: value });
        } else {
            setNewProject({ ...newProject, [name]: value });
        }
    };

    const handleAddProject = async () => {
        try {
            const response = await axios.post(`${process.env.REACT_APP_COMPANY_URL}/project/manage/${email}/`, newProject);
            setProjects([...projects, { ...newProject, id: response.data.id }]);
            setNewProject({
                title: '',
                description: '',
                link: '',
                duration_from_year: '',
                duration_from_month: '',
                duration_to_year: '',
                duration_to_month: '',
                skills: ''
            });
            setShowNewProjectForm(false);
        } catch (error) {
            console.error('Error adding project:', error);
        }
    };

    const handleEditProject = (project) => {
        setEditProject(project);
        setShowNewProjectForm(false); // Hide the add project form if open
    };

    const handleUpdateProject = async () => {
        try {
            await axios.put(`${process.env.REACT_APP_COMPANY_URL}/project/manage/${email}/`, {
                ...editProject,
                id: editProject.id
            });
            const updatedProjects = projects.map(proj =>
                proj.id === editProject.id ? editProject : proj
            );
            setProjects(updatedProjects);
            setEditProject(null);
        } catch (error) {
            console.error('Error updating project:', error);
        }
    };

    const handleDeleteProject = async (id) => {
        try {
            await axios.delete(`${process.env.REACT_APP_COMPANY_URL}/project/manage/${email}/`, { data: { id } });
            setProjects(projects.filter(proj => proj.id !== id));
        } catch (error) {
            console.error('Error deleting project:', error);
        }
    };

    return (
        <div>
            <h2>Projects for {email}</h2>
            <button onClick={() => setShowNewProjectForm(!showNewProjectForm)}>
                {showNewProjectForm ? 'Hide New Project Form' : 'Add New Project'}
            </button>
            {showNewProjectForm && (
                <div>
                    <input type="text" name="title" placeholder="Project Title" value={newProject.title} onChange={handleInputChange} />
                    <input type="text" name="description" placeholder="Description" value={newProject.description} onChange={handleInputChange} />
                    <input type="text" name="link" placeholder="Project Link" value={newProject.link} onChange={handleInputChange} />
                    <div>
                        <label>Duration From:</label>
                        <input type="number" name="duration_from_year" placeholder="Year" value={newProject.duration_from_year} onChange={handleInputChange} min="2000" max={new Date().getFullYear()} />
                        <input type="number" name="duration_from_month" placeholder="Month" value={newProject.duration_from_month} onChange={handleInputChange} min="1" max="12" />
                    </div>
                    <div>
                        <label>Duration To:</label>
                        <input type="number" name="duration_to_year" placeholder="Year" value={newProject.duration_to_year} onChange={handleInputChange} min="2000" max={new Date().getFullYear()} />
                        <input type="number" name="duration_to_month" placeholder="Month" value={newProject.duration_to_month} onChange={handleInputChange} min="1" max="12" />
                    </div>
                    <input type="text" name="skills" placeholder="Skills" value={newProject.skills} onChange={handleInputChange} />
                    <button onClick={handleAddProject}>Add Project</button>
                </div>
            )}

            <h3>Existing Projects</h3>
            <ul>
                {projects.map((project) => (
                    <li key={project.id}>
                        <span>{project.title} - {project.description}</span>
                        <button onClick={() => handleEditProject(project)}>Edit</button>
                        <button onClick={() => handleDeleteProject(project.id)}>Delete</button>
                    </li>
                ))}
            </ul>

            {editProject && (
                <div>
                    <h3>Edit Project</h3>
                    <input type="text" name="title" placeholder="Project Title" value={editProject.title} onChange={handleInputChange} />
                    <input type="text" name="description" placeholder="Description" value={editProject.description} onChange={handleInputChange} />
                    <input type="text" name="link" placeholder="Project Link" value={editProject.link} onChange={handleInputChange} />
                    <div>
                        <label>Duration From:</label>
                        <input type="number" name="duration_from_year" placeholder="Year" value={editProject.duration_from_year} onChange={handleInputChange} min="2000" max={new Date().getFullYear()} />
                        <input type="number" name="duration_from_month" placeholder="Month" value={editProject.duration_from_month} onChange={handleInputChange} min="1" max="12" />
                    </div>
                    <div>
                        <label>Duration To:</label>
                        <input type="number" name="duration_to_year" placeholder="Year" value={editProject.duration_to_year} onChange={handleInputChange} min="2000" max={new Date().getFullYear()} />
                        <input type="number" name="duration_to_month" placeholder="Month" value={editProject.duration_to_month} onChange={handleInputChange} min="1" max="12" />
                    </div>
                    <input type="text" name="skills" placeholder="Skills" value={editProject.skills} onChange={handleInputChange} />
                    <button onClick={handleUpdateProject}>Update Project</button>
                    <button onClick={() => setEditProject(null)}>Cancel</button>
                </div>
            )}
        </div>
    );
};

export default Projects;
