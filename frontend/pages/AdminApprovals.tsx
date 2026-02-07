
import React, { useEffect, useState } from 'react';
import { AuthService } from '../services/api'; // Ensure this service has getPendingAdmins and approveAdmin
import { Check, X, ShieldAlert, User } from 'lucide-react';

interface PendingAdmin {
    _id: string;
    name: string;
    email: string;
    phoneNumber: string;
    createdAt: string;
}

export const AdminApprovals: React.FC = () => {
    const [pendingAdmins, setPendingAdmins] = useState<PendingAdmin[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [successMsg, setSuccessMsg] = useState<string | null>(null);

    useEffect(() => {
        fetchPendingAdmins();
    }, []);

    const fetchPendingAdmins = async () => {
        try {
            setLoading(true);
            const res = await AuthService.getPendingAdmins();
            if (res.success && res.admins) {
                setPendingAdmins(res.admins);
            } else {
                setError("Failed to fetch pending requests");
            }
        } catch (err: any) {
            setError(err.message || "Error fetching admins");
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (id: string, name: string) => {
        try {
            const res = await AuthService.approveAdmin(id);
            if (res.success) {
                setSuccessMsg(`Approved admin access for ${name}`);
                setPendingAdmins(prev => prev.filter(admin => admin._id !== id));
                setTimeout(() => setSuccessMsg(null), 3000); // Clear message
            } else {
                alert(res.message || "Approval failed");
            }
        } catch (err) {
            alert("Approval failed");
        }
    };

    // Reject is basically ignoring them or we could delete the user (not implemented yet)

    if (loading) return <div className="p-10 text-center">Loading pending approvals...</div>;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <ShieldAlert className="w-6 h-6 mr-2 text-blue-900" /> Admin Access Requests
            </h1>

            {error && <div className="text-red-500 mb-4">{error}</div>}
            {successMsg && <div className="mb-4 bg-green-100 text-green-800 p-3 rounded flex items-center"><Check className="h-4 w-4 mr-2" /> {successMsg}</div>}

            <div className="bg-white shadow overflow-hidden sm:rounded-md">
                {pendingAdmins.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">
                        No pending admin requests.
                    </div>
                ) : (
                    <ul className="divide-y divide-gray-200">
                        {pendingAdmins.map((admin) => (
                            <li key={admin._id} className="px-4 py-4 sm:px-6 hover:bg-gray-50 transition selection:bg-blue-100">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <div className="bg-gray-200 p-2 rounded-full mr-4">
                                            <User className="h-6 w-6 text-gray-600" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-blue-900">{admin.name}</p>
                                            <div className="text-sm text-gray-500 flex flex-col sm:flex-row sm:gap-4">
                                                <span>{admin.email}</span>
                                                <span className="hidden sm:inline">|</span>
                                                <span>{admin.phoneNumber}</span>
                                            </div>
                                            <p className="text-xs text-gray-400 mt-1">
                                                Requested on {new Date(admin.createdAt).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex space-x-2">
                                        <button
                                            onClick={() => handleApprove(admin._id, admin.name)}
                                            className="inline-flex items-center px-3 py-1.5 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                                        >
                                            <Check className="h-4 w-4 mr-1" /> Approve
                                        </button>
                                        {/* <button className="inline-flex items-center px-3 py-1.5 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                                            <X className="h-4 w-4 mr-1"/> Reject
                                        </button> */}
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
