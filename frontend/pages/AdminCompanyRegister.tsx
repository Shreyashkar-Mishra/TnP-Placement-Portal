
import React, { useState } from 'react';
import { CompanyService } from '../services/api';
import { Loader2, CheckCircle, AlertCircle, Building } from 'lucide-react';

export const AdminCompanyRegister: React.FC = () => {
    const [formData, setFormData] = useState({
        companyName: '',
        email: ''
    });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(null);

        try {
            const res = await CompanyService.register(formData);
            if (res.success) {
                setSuccess(`Company "${formData.companyName}" registered successfully! They can now log in using ${formData.email}.`);
                setFormData({ companyName: '', email: '' });
            } else {
                setError(res.message || 'Failed to register company.');
            }
        } catch (err: any) {
            setError(err.message || 'An error occurred.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-xl">
            <div className="flex items-center justify-center mb-6">
                <div className="bg-blue-100 p-3 rounded-full">
                    <Building className="h-8 w-8 text-blue-600" />
                </div>
            </div>
            <h2 className="text-2xl font-bold text-center text-gray-900 mb-8">Register Partner Company</h2>

            {success && (
                <div className="mb-4 bg-green-50 border-l-4 border-green-500 p-4 flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                    <p className="text-sm text-green-700">{success}</p>
                </div>
            )}

            {error && (
                <div className="mb-4 bg-red-50 border-l-4 border-red-500 p-4 flex items-start">
                    <AlertCircle className="h-5 w-5 text-red-500 mr-2 mt-0.5" />
                    <p className="text-sm text-red-700">{error}</p>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label htmlFor="companyName" className="block text-sm font-medium text-gray-700">Company Name</label>
                    <input
                        type="text"
                        name="companyName"
                        id="companyName"
                        required
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        value={formData.companyName}
                        onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                    />
                </div>

                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">Official Email Authorization</label>
                    <input
                        type="email"
                        name="email"
                        id="email"
                        required
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                    <p className="mt-1 text-xs text-gray-500">The company representative will use this email to create their account.</p>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-900 hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-900 disabled:opacity-50"
                >
                    {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Register Company'}
                </button>
            </form>
        </div>
    );
};
