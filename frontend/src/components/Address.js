import React, { useState, useEffect } from 'react';
import axios from 'axios';

const EditableFieldSection = ({ title, fields, values, onChange, isEditing, onSave, onCancel, onEdit, errors }) => (
    <div className="bg-white p-4 mb-4 shadow">
        <h3 className='text-center  text-uppercase text-muted'>{title}</h3>
        <div className="row">
            {fields.map((field) => (
                <div className="col-md-6 mb-3" key={field}>
                    <label className="form-label text-capitalize">{field.replace('_', ' ')}</label>
                    <input
                        type="text"
                        className={`form-control ${errors[field] ? 'is-invalid' : ''}`}
                        name={field}
                        value={values[field] || ''}
                        onChange={onChange}
                        disabled={!isEditing && field !== 'email'} // Disable unless editing, except for email
                    />
                    {errors[field] && <div className="invalid-feedback">{errors[field]}</div>}
                </div>
            ))}
        </div>
        {isEditing ? (
            <div className='d-flex flex-row justify-content-center gap-5' >
                <div className='row'>
                <button className="btn btn-primary me-2" onClick={onSave}>
                    Save
                </button>
                </div>
                <div className='row'>
                <button className="btn btn-secondary" onClick={onCancel}>
                    Cancel Edit
                </button>
                </div>
            </div>
        ) : (
            <div className='d-flex flex-row justify-content-center ' >
            <button className="btn btn-warning" onClick={onEdit}>
                Edit {title}
            </button>
            </div>
        )}
    </div>
);

const Address = ({ personalInfo, id }) => {
    const [address, setAddress] = useState({
        address_line_1: '',
        city: '',
        state: '',
        pincode: '',
    });

    const [personalDetails, setPersonalDetails] = useState({
        first_name: '',
        last_name: '',
        middle_name: '',
        mobile: '',
        gender: '',
        email: '',
    });

    // States to hold original values for reset
    const [originalAddress, setOriginalAddress] = useState({});
    const [originalPersonalDetails, setOriginalPersonalDetails] = useState({});

    const [errors, setErrors] = useState({});
    const [isEditingAddress, setIsEditingAddress] = useState(false);
    const [isEditingPersonal, setIsEditingPersonal] = useState(false);

    useEffect(() => {
        if (personalInfo.address && personalInfo.address.length > 0) {
            const initialAddress = personalInfo.address[0];
            setAddress(initialAddress);
            setOriginalAddress(initialAddress); // Store original address
        }

        // Update personalDetails whenever personalInfo changes
        const initialPersonalDetails = {
            first_name: personalInfo.first_name || '',
            last_name: personalInfo.last_name || '',
            middle_name: personalInfo.middle_name || '',
            mobile: personalInfo.mobile || '',
            gender: personalInfo.gender || '',
            email: personalInfo.email || '',
        };
        setPersonalDetails(initialPersonalDetails);
        setOriginalPersonalDetails(initialPersonalDetails); // Store original personal details
    }, [personalInfo]);

    const handlePersonalChange = (event) => {
        const { name, value } = event.target;
        let errorMessage = '';

        // Validation for name fields: only alphabets and spaces
        if ((name === 'first_name' || name === 'last_name' || name === 'middle_name') && /[0-9]/.test(value)) {
            errorMessage = 'Numbers are not allowed in names';
        }

        // Update personal details directly
        setPersonalDetails((prevDetails) => ({
            ...prevDetails,
            [name]: value,
        }));

        // Validation for mobile: only numbers and must be exactly 10 digits
        if (name === 'mobile') {
            if (value.length > 10 || !/^[0-9]*$/.test(value)) {
                errorMessage = 'Only numeric characters are allowed';
            } else if (value.length === 10 && !/^[0-9]{10}$/.test(value)) {
                errorMessage = 'Mobile number must be exactly 10 digits';
            }
        }

        setErrors((prevErrors) => ({
            ...prevErrors,
            [name]: errorMessage,
        }));
    };

    const handleAddressChange = (event) => {
        const { name, value } = event.target;
        setAddress((prevAddress) => ({
            ...prevAddress,
            [name]: value,
        }));

        // Validation for pincode: must be 6 digits and numeric
        if (name === 'pincode') {
            if (!/^[0-9]{6}$/.test(value)) {
                setErrors((prevErrors) => ({
                    ...prevErrors,
                    pincode: 'Pincode must be exactly 6 digits and numeric',
                }));
            } else {
                setErrors((prevErrors) => ({
                    ...prevErrors,
                    pincode: '',
                }));
            }
        }
    };

    const updateAddress = async () => {
        // Check for pincode errors before saving
        if (!errors.pincode) {
            try {
                await axios.post(`${process.env.REACT_APP_API_URL}/address/manage/${id}/`, address);
               
                setIsEditingAddress(false);
            } catch (error) {
                console.error('Error saving address data:', error);
            }
        }
    };

    const updatePersonalDetails = async () => {
        // Check for errors before saving
        const mobileError = (personalDetails.mobile.length !== 10) ? 'Mobile number must be exactly 10 digits' : '';
        setErrors((prevErrors) => ({
            ...prevErrors,
            mobile: mobileError,
        }));

        const nameErrors = {};
        ['first_name', 'last_name', 'middle_name'].forEach((nameField) => {
            if (/[0-9]/.test(personalDetails[nameField])) {
                nameErrors[nameField] = 'Numbers are not allowed in names';
            }
        });

        // Combine errors
        const combinedErrors = { ...nameErrors, mobile: mobileError };
        setErrors((prevErrors) => ({
            ...prevErrors,
            ...combinedErrors,
        }));

        // Check for any errors before sending request
        if (!Object.values(combinedErrors).some((error) => error)) {
            try {
                await axios.put(`${process.env.REACT_APP_API_URL}/profile/${id}/`, personalDetails);
               
                setIsEditingPersonal(false);
            } catch (error) {
                console.error('Error updating personal details:', error);
            }
        }
    };

    const handleEditCancel = (type) => {
        if (type === 'address') {
            setAddress(originalAddress); // Reset to original address state
            setIsEditingAddress(false);
        } else if (type === 'personal') {
            setPersonalDetails(originalPersonalDetails); // Reset to original personal details state
            setIsEditingPersonal(false);
        }
    };

    return (
        <div className="container my-4">
            {/* Personal Information Section */}
            <EditableFieldSection
                title="Personal Information"
                fields={['first_name', 'last_name', 'middle_name', 'mobile', 'gender', 'email']}
                values={personalDetails}
                onChange={handlePersonalChange}
                isEditing={isEditingPersonal}
                onSave={updatePersonalDetails}
                onCancel={() => handleEditCancel('personal')}
                onEdit={() => setIsEditingPersonal(true)}
                errors={errors}
            />

            {/* Address Section */}
            <EditableFieldSection
                title="Address"
                fields={['address_line_1', 'city', 'state', 'pincode']}
                values={address}
                onChange={handleAddressChange}
                isEditing={isEditingAddress}
                onSave={updateAddress}
                onCancel={() => handleEditCancel('address')}
                onEdit={() => setIsEditingAddress(true)}
                errors={errors} // Pass validation errors for address fields
            />
        </div>
    );
};

export default Address;
