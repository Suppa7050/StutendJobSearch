import React, { useEffect, useState } from 'react';
import axios from 'axios';
import JobCard from './JobCard';
import FilterNav from './FilterNav';

const JobList = ({ isSidebarOpen }) => {
    const [jobs, setJobs] = useState([]);
    const [appliedJobs, setAppliedJobs] = useState([]);
    const [filteredJobs, setFilteredJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    const [selectedRoles, setSelectedRoles] = useState([]);
    const [selectedCompanies, setSelectedCompanies] = useState([]);
    const [salaryRange, setSalaryRange] = useState({ min: 0, max: 0 });
    const [searchTerm, setSearchTerm] = useState('');

    const studentId = localStorage.getItem('student_id');
    const roleOptions = [...new Set(jobs.map(job => job.job_name).filter(role => role && role !== 'N/A'))];
    const companyOptions = [...new Set(jobs.map(job => job.company?.name).filter(company => company && company !== 'N/A'))];
    

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const jobResponse = await axios.get(`http://localhost:8000/company/jobs/`);
                console.log(jobResponse.data)
                setJobs(jobResponse.data);
                setFilteredJobs(jobResponse.data);

                if (studentId) {
                    const applicationIdsResponse = await axios.get(`http://localhost:8000/company/applications/student/${studentId}/`);
                    const applicationIds = applicationIdsResponse.data.application_ids;

                    const appliedJobIds = await Promise.all(
                        applicationIds.map(async (appId) => {
                            const appResponse = await axios.get(`http://localhost:8000/company/applications/${appId}/`);
                            return appResponse.data.job_id;
                        })
                    );

                    setAppliedJobs(appliedJobIds);
                }
            } catch (err) {
                setError('Error fetching jobs');
            } finally {
                setLoading(false);
            }
        };

        fetchJobs();
    }, [studentId]);

    const handleRoleChange = (role) => {
        setSelectedRoles(prev =>
            prev.includes(role) ? prev.filter(r => r !== role) : [...prev, role]
        );
    };

    const handleCompanyChange = (company) => {
        setSelectedCompanies(prev =>
            prev.includes(company) ? prev.filter(c => c !== company) : [...prev, company]
        );
    };

    const handleSalaryChange = (min, max) => {
        setSalaryRange({ min, max });
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const applyFilters = () => {
        let updatedJobs = jobs;

        // Apply role filter
        if (selectedRoles.length > 0) {
            updatedJobs = updatedJobs.filter(job => selectedRoles.includes(job.job_name));
        }

        // Apply company filter
        if (selectedCompanies.length > 0) {
            updatedJobs = updatedJobs.filter(job => selectedCompanies.includes(job.company?.name));
        }

        // Apply salary filter
        if (salaryRange.min || salaryRange.max) {
            updatedJobs = updatedJobs.filter(job => {
                return job.salary >= salaryRange.min && (salaryRange.max === 0 || job.salary <= salaryRange.max);
            });
        }

        // Apply search term filter
        if (searchTerm) {
            const searchLower = searchTerm.toLowerCase();
            updatedJobs = updatedJobs.filter(job =>
                (job.job_name?.toLowerCase() || '').includes(searchLower) ||
                (job.company?.name?.toLowerCase() || '').includes(searchLower) ||
                (job.title?.toLowerCase() || '').includes(searchLower) ||
                (job.description?.toLowerCase() || '').includes(searchLower) ||
                (job.skills?.toLowerCase() || '').includes(searchLower) ||
                (job.location?.toLowerCase() || '').includes(searchLower)
            );
        }

        setFilteredJobs(updatedJobs);
    };

    useEffect(() => {
        applyFilters();
    }, [selectedRoles, selectedCompanies, salaryRange, searchTerm, jobs]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div className="alert alert-danger">{error}</div>;

    return (
        <div className="container mt-5">
            <div className="row justify-content-center ">
                <div className=' col-md-9 d-flex justify-content-between  align-items-center  my-5 smaller'>
                    <div class="h-100">
                        <div class="d-flex justify-content-center h-100">
                            <div class="searchbar shadow">
                                <input
                                    class="search_input"
                                    type="text"
                                    placeholder="Search..."
                                    value={searchTerm}
                                    onChange={handleSearchChange}
                                />
                                <a href="#" class="search_icon"><i class="fas fa-search"></i></a>
                            </div>
                        </div>
                    </div>
                    <div><button className='border-0 fs-3 btn-dark1 shadow rounded-50' onClick={() => setIsFilterOpen(true)}><i className='fas fa-filter p-4'></i></button></div>

                </div>
            </div>

            {filteredJobs.length > 0 ? (
                <div className="row justify-content-center">
                    {filteredJobs.map((job, index) => (
                        <JobCard
                            key={job.id !== 'N/A' ? job.id : `job-${index}`} // Use job.id if it's not "N/A"; otherwise, use a unique fallback
                            job={job}
                            isApplied={appliedJobs.includes(job.id)}
                            onApplyClick={() => console.log(`Applying for job ${job.id}`)}
                            isSidebarOpen={isSidebarOpen}
                        />
                    ))}
                </div>
            ) : (
                <p>No jobs found.</p>
            )}

            <FilterNav
                isOpen={isFilterOpen}
                onClose={() => setIsFilterOpen(false)}
                roleOptions={roleOptions}
                companyOptions={companyOptions}
                selectedRoles={selectedRoles}
                selectedCompanies={selectedCompanies}
                salaryRange={salaryRange}
                onRoleChange={handleRoleChange}
                onCompanyChange={handleCompanyChange}
                onSalaryChange={handleSalaryChange}
            />
        </div>
    );
};

export default JobList;
