
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { JobService } from '../services/api';
import { Job } from '../types';
import { Briefcase, Users, Calendar, Edit2, Trash2 } from 'lucide-react';

export const CompanyDashboard: React.FC = () => {
    const navigate = useNavigate();
    const [jobs, setJobs] = useState<Job[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const res = await JobService.getCompanyJobs();
                if (res.success && res.jobs) {
                    setJobs(res.jobs);
                }
            } catch (error) {
                console.error("Failed to fetch jobs", error);
            } finally {
                setLoading(false);
            }
        };
        fetchJobs();
    }, []);

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Company Dashboard</h1>
                    <p className="mt-1 text-sm text-gray-500">Manage your job postings and applicants</p>
                </div>
            </div>

            <div className="bg-white shadow overflow-hidden sm:rounded-md">
                <ul className="divide-y divide-gray-200">
                    {jobs.length === 0 ? (
                        <li className="px-6 py-12 text-center text-gray-500">
                            No jobs posted yet. Use the "Post Job" link in the navigation menu to get started.
                        </li>
                    ) : (
                        jobs.map((job) => (
                            <li key={job._id}>
                                <div className="px-4 py-4 sm:px-6">
                                    <div className="flex items-center justify-between">
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-blue-600 truncate">{job.title}</p>
                                            <div className="flex mt-2">
                                                <div className="flex items-center text-sm text-gray-500 mr-6">
                                                    <Briefcase className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                                                    <p>{job.role || 'Full-time'}</p>
                                                </div>
                                                <div className="flex items-center text-sm text-gray-500 mr-6">
                                                    <Calendar className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                                                    <p>Posted on {new Date(job.createdAt).toLocaleDateString()}</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <div className="text-sm text-gray-500 mr-4">
                                                <span className="font-medium text-gray-900">{job.positionsAvailable}</span> Positions
                                            </div>
                                            <button
                                                onClick={() => navigate(`/jobs/${job._id}/applicants`)}
                                                className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                                            >
                                                <Users className="-ml-1 mr-1.5 h-4 w-4 text-gray-400" />
                                                View Applicants
                                            </button>
                                            <button
                                                onClick={() => navigate(`/post-job?jobId=${job._id}`)}
                                                className="inline-flex items-center px-3 py-1.5 border border-indigo-200 shadow-sm text-xs font-medium rounded text-indigo-700 bg-indigo-50 hover:bg-indigo-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                                            >
                                                <Edit2 className="-ml-1 mr-1.5 h-3.5 w-3.5" />
                                                Edit
                                            </button>
                                            <button
                                                onClick={async () => {
                                                    if (window.confirm('Are you sure you want to delete this job? This will also delete all associated applications.')) {
                                                        try {
                                                            const res = await JobService.deleteJob(job._id);
                                                            if (res.success) {
                                                                setJobs(jobs.filter(j => j._id !== job._id));
                                                            } else {
                                                                alert('Failed to delete job');
                                                            }
                                                        } catch (e) { console.error(e); alert('Error deleting job'); }
                                                    }
                                                }}
                                                className="inline-flex items-center px-3 py-1.5 border border-red-200 shadow-sm text-xs font-medium rounded text-red-700 bg-red-50 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
                                            >
                                                <Trash2 className="-ml-1 mr-1.5 h-3.5 w-3.5" />
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </li>
                        ))
                    )}
                </ul>
            </div>
        </div >
    );
};
