import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ApplicationService } from '../services/api';
import { Application } from '../types';

export const JobApplicants: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [applicants, setApplicants] = useState<Application[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (id) {
            fetchApplicants(id);
        }
    }, [id]);

    const fetchApplicants = async (jobId: string) => {
        setLoading(true);
        const res = await ApplicationService.getApplicants(jobId);
        if (res.success && res.applicants) {
            setApplicants(res.applicants);
        }
        setLoading(false);
    };

    const handleStatusUpdate = async (applicationId: string, newStatus: string) => {
        const res = await ApplicationService.updateStatus(applicationId, newStatus);
        if (res.success) {
            setApplicants(prev => prev.map(app =>
                app._id === applicationId ? { ...app, status: newStatus as any } : app
            ));
        }
    };

    if (loading) return <div className="p-8 text-center">Loading applicants...</div>;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Applicants</h2>
                <button
                    onClick={() => id && ApplicationService.downloadExcel(id)}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none"
                >
                    Download Excel
                </button>
            </div>

            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                {applicants.length === 0 ? (
                    <div className="p-6 text-gray-500">No applicants yet.</div>
                ) : (
                    <ul className="divide-y divide-gray-200">
                        {applicants.map((application) => (
                            <li key={application._id} className="p-6 hover:bg-gray-50">
                                <div className="flex items-center justify-between">
                                    <div className="flex-1">
                                        <h3 className="text-lg font-medium text-gray-900">{application.applicant.name}</h3>
                                        <div className="mt-1 text-sm text-gray-500 space-y-1">
                                            <p>{application.applicant.email}</p>
                                            <p>{application.applicant.phoneNumber}</p>
                                        </div>
                                    </div>

                                    <div className="flex flex-col items-end space-y-2">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium uppercase
                                ${application.status === 'accepted' ? 'bg-green-100 text-green-800' :
                                                application.status === 'selected' ? 'bg-blue-100 text-blue-800' :
                                                    application.status === 'rejected' ? 'bg-red-100 text-red-800' :
                                                        'bg-yellow-100 text-yellow-800'
                                            }`}>
                                            {application.status}
                                        </span>

                                        <div className="flex space-x-2 mt-2">
                                            <button
                                                onClick={() => handleStatusUpdate(application._id, 'accepted')}
                                                className="text-xs bg-green-50 text-green-700 px-2 py-1 rounded border border-green-200 hover:bg-green-100"
                                            >
                                                Approve
                                            </button>
                                            <button
                                                onClick={() => handleStatusUpdate(application._id, 'selected')}
                                                className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded border border-blue-200 hover:bg-blue-100"
                                            >
                                                Select
                                            </button>
                                            <button
                                                onClick={() => handleStatusUpdate(application._id, 'rejected')}
                                                className="text-xs bg-red-50 text-red-700 px-2 py-1 rounded border border-red-200 hover:bg-red-100"
                                            >
                                                Reject
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};