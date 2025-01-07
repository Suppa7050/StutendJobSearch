import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Certificates = ({ certificates: initialCertificates, email }) => {
    const [certificates, setCertificates] = useState(initialCertificates);
    const [showNewCertificateForm, setShowNewCertificateForm] = useState(false);
    const [newCertificate, setNewCertificate] = useState({ title: '', description: '', file_link: '' });
    const [editCertificate, setEditCertificate] = useState(null);

    useEffect(() => {
        setCertificates(initialCertificates);
    }, [initialCertificates]);

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        if (editCertificate) {
            setEditCertificate({ ...editCertificate, [name]: value });
        } else {
            setNewCertificate({ ...newCertificate, [name]: value });
        }
    };

    const handleAddCertificate = async () => {
        try {
            const response = await axios.post(`${process.env.REACT_APP_COMPANY_URL}/certificate/manage/${email}/`, newCertificate);
            setCertificates([...certificates, { ...newCertificate, id: response.data.id }]);
            setNewCertificate({ title: '', description: '', file_link: '' });
            setShowNewCertificateForm(false);
        } catch (error) {
            console.error('Error adding certificate:', error);
        }
    };

    const handleEditCertificate = (certificate) => {
        setEditCertificate(certificate);
        setShowNewCertificateForm(false); // Hide the add certificate form if open
    };

    const handleUpdateCertificate = async () => {
        try {
            await axios.put(`${process.env.REACT_APP_COMPANY_URL}/certificate/manage/${email}/`, {
                ...editCertificate,
                id: editCertificate.id
            });
            const updatedCertificates = certificates.map(cert =>
                cert.id === editCertificate.id ? editCertificate : cert
            );
            setCertificates(updatedCertificates);
            setEditCertificate(null);
        } catch (error) {
            console.error('Error updating certificate:', error);
        }
    };

    const handleDeleteCertificate = async (id) => {
        try {
            await axios.delete(`${process.env.REACT_APP_COMPANY_URL}/certificate/manage/${email}/`, { data: { id } });
            setCertificates(certificates.filter(cert => cert.id !== id));
        } catch (error) {
            console.error('Error deleting certificate:', error);
        }
    };

    return (
        <div>
            <h2>Certificates for {email}</h2>
            <button onClick={() => setShowNewCertificateForm(!showNewCertificateForm)}>
                {showNewCertificateForm ? 'Hide New Certificate Form' : 'Add New Certificate'}
            </button>
            {showNewCertificateForm && (
                <div>
                    <input type="text" name="title" placeholder="Certificate Title" value={newCertificate.title} onChange={handleInputChange} />
                    <input type="text" name="description" placeholder="Description" value={newCertificate.description} onChange={handleInputChange} />
                    <input type="text" name="file_link" placeholder="File Link" value={newCertificate.file_link} onChange={handleInputChange} />
                    <button onClick={handleAddCertificate}>Add Certificate</button>
                </div>
            )}

            <h3>Existing Certificates</h3>
            <ul>
                {certificates.map((certificate) => (
                    <li key={certificate.id}>
                        <span>{certificate.title} - {certificate.description}</span>
                        <button onClick={() => handleEditCertificate(certificate)}>Edit</button>
                        <button onClick={() => handleDeleteCertificate(certificate.id)}>Delete</button>
                    </li>
                ))}
            </ul>

            {editCertificate && (
                <div>
                    <h3>Edit Certificate</h3>
                    <input type="text" name="title" placeholder="Certificate Title" value={editCertificate.title} onChange={handleInputChange} />
                    <input type="text" name="description" placeholder="Description" value={editCertificate.description} onChange={handleInputChange} />
                    <input type="text" name="file_link" placeholder="File Link" value={editCertificate.file_link} onChange={handleInputChange} />
                    <button onClick={handleUpdateCertificate}>Update Certificate</button>
                    <button onClick={() => setEditCertificate(null)}>Cancel</button>
                </div>
            )}
        </div>
    );
};

export default Certificates;
