import React, { useEffect, useState } from 'react';
import { AuthService } from '../services/api';
import { Users, Search, CheckCircle, AlertCircle, Shield } from 'lucide-react';

interface Student {
    _id: string;
    name: string;
    email: string;
    phoneNumber: string;
    college: string;
    roles: string[];
    profile: {
        education?: {
            branch?: string;
            passingYear?: number;
        }
    };
}

const AdminStudents: React.FC = () => {
    const [students, setStudents] = useState<Student[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    useEffect(() => {
        fetchStudents();
    }, []);

    const fetchStudents = async () => {
        setLoading(true);
        try {
            const res = await AuthService.getAllStudents();
            if (res.success && res.students) {
                setStudents(res.students);
            } else {
                setMessage({ type: 'error', text: 'Failed to fetch students' });
            }
        } catch (error) {
            console.error(error);
            setMessage({ type: 'error', text: 'An error occurred' });
        } finally {
            setLoading(false);
        }
    };

    const handlePromote = async (userId: string) => {
        if (!window.confirm("Are you sure you want to promote this student to Admin? They will be able to post jobs.")) return;

        try {
            const res = await AuthService.updateUserRole(userId, 'admin');
            if (res.success) {
                setMessage({ type: 'success', text: 'User promoted to Admin successfully' });
                // Refresh list locally
                setStudents(prev => prev.map(s => s._id === userId ? { ...s, roles: [...s.roles, 'admin'] } : s));
            } else {
                setMessage({ type: 'error', text: res.message || 'Failed to promote' });
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'An error occurred' });
        }
    };

    const filteredStudents = students.filter(student =>
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.college?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-serif font-bold text-blue-900 mb-2">Manage Students</h1>
                    <p className="text-gray-500 text-sm">View all registered students and manage their roles.</p>
                </div>
                <div className="relative mt-4 md:mt-0 w-full md:w-64">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                        type="text"
                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-sm leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-900 focus:border-blue-900 sm:text-sm h-10"
                        placeholder="Search students..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {message && (
                <div className={`mb-6 p-4 rounded-sm border-l-4 ${message.type === 'success' ? 'bg-green-50 border-green-500 text-green-700' : 'bg-red-50 border-red-500 text-red-700'}`}>
                    {message.text}
                    <button onClick={() => setMessage(null)} className="float-right text-sm underline">Dismiss</button>
                </div>
            )}

            {loading ? (
                <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900 mx-auto"></div>
                    <p className="mt-4 text-gray-500">Loading students...</p>
                </div>
            ) : (
                <div className="bg-white shadow border-b border-gray-200 sm:rounded-lg overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Academic Info</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Roles</th>
                                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredStudents.length > 0 ? (
                                filteredStudents.map((student) => (
                                    <tr key={student._id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-800 font-bold">
                                                    {student.name.charAt(0).toUpperCase()}
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-gray-900">{student.name}</div>
                                                    <div className="text-sm text-gray-500">Joined: {new Date().getFullYear()}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">{student.email}</div>
                                            <div className="text-sm text-gray-500">{student.phoneNumber}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">{student.college}</div>
                                            <div className="text-sm text-gray-500">{student.profile?.education?.branch || 'N/A'}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {student.roles.map(role => (
                                                <span key={role} className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full mr-1 ${role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-green-100 text-green-800'
                                                    }`}>
                                                    {role.charAt(0).toUpperCase() + role.slice(1)}
                                                </span>
                                            ))}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            {student.roles.includes('admin') ? (
                                                <span className="text-gray-400 cursor-not-allowed inline-flex items-center">
                                                    <CheckCircle className="h-4 w-4 mr-1" /> Admin
                                                </span>
                                            ) : (
                                                <button
                                                    onClick={() => handlePromote(student._id)}
                                                    className="text-blue-600 hover:text-blue-900 inline-flex items-center border border-blue-600 px-3 py-1 rounded-sm hover:bg-blue-50 transition-colors"
                                                >
                                                    <Shield className="h-4 w-4 mr-1" /> Promote
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                                        No students found matching your search.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default AdminStudents;
