import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { AuthService } from '../services/api';
import { UserRole } from '../types';
import { Save, User as UserIcon, BookOpen, FileText } from 'lucide-react';

export const StudentProfile: React.FC = () => {
    const { user, role, login } = useAuth();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phoneNumber: '',
        bio: '',
        prn: '',
        skills: '',
        tenthPercent: '',
        twelfthPercent: '',
        bachelorsPercent: '',
        mastersPercent: '',
        passingYear: '',
        branch: 'B.Tech',
        file: null as File | null
    });
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || '',
                email: user.email || '',
                phoneNumber: user.phoneNumber || '',
                bio: user.profile?.bio || '',
                prn: user.profile?.prn || '',
                skills: user.profile?.skills?.join(', ') || '',
                tenthPercent: user.profile?.education?.tenthPercent?.toString() || '',
                twelfthPercent: user.profile?.education?.twelfthPercent?.toString() || '',
                bachelorsPercent: user.profile?.education?.bachelorsPercent?.toString() || '',
                mastersPercent: user.profile?.education?.mastersPercent?.toString() || '',
                passingYear: user.profile?.education?.passingYear?.toString() || '',
                branch: user.profile?.education?.branch || 'B.Tech',
                file: null
            });
        }
    }, [user]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        if (e.target.type === 'file') {
            const fileInput = e.target as HTMLInputElement;
            if (fileInput.files && fileInput.files[0]) {
                setFormData({ ...formData, file: fileInput.files[0] });
            }
        } else {
            setFormData({ ...formData, [e.target.name]: e.target.value });
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        if (!formData.prn || String(formData.prn).trim() === "") {
            setMessage({ type: 'error', text: 'PRN is compulsory.' });
            setLoading(false);
            return;
        }

        const data = new FormData();
        data.append('name', formData.name);
        data.append('email', formData.email);
        data.append('phoneNumber', formData.phoneNumber);

        const profileObj = {
            bio: formData.bio,
            prn: formData.prn,
            skills: formData.skills.split(',').map(s => s.trim()).filter(s => s),
            education: {
                tenthPercent: formData.tenthPercent ? parseFloat(formData.tenthPercent as string) : null,
                twelfthPercent: formData.twelfthPercent ? parseFloat(formData.twelfthPercent as string) : null,
                bachelorsPercent: formData.bachelorsPercent ? parseFloat(formData.bachelorsPercent as string) : null,
                mastersPercent: formData.mastersPercent ? parseFloat(formData.mastersPercent as string) : null,
                passingYear: formData.passingYear ? parseInt(formData.passingYear as string) : null,
                branch: formData.branch
            }
        };

        data.append('profile', JSON.stringify(profileObj));

        if (formData.file) {
            data.append('file', formData.file);
        }

        try {
            const res = await AuthService.updateProfile(data);
            if (res.success) {
                setMessage({ type: 'success', text: 'Profile updated successfully!' });
                if (res.user) {
                    login(res.user);
                }
                setIsEditing(false); // Switch back to view mode
            } else {
                setMessage({ type: 'error', text: res.message || 'Failed to update profile' });
            }
        } catch (error: any) {
            setMessage({ type: 'error', text: error.message || 'An error occurred.' });
        } finally {
            setLoading(false);
        }
    };

    if (role !== UserRole.Student) return <div className="p-8">Access Denied</div>;

    if (!isEditing) {
        return (
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-20">
                <div className="flex justify-between items-center mb-8 border-b-2 border-yellow-500 pb-2">
                    <h2 className="text-3xl font-serif font-bold text-blue-900">My Profile</h2>
                    <button
                        onClick={() => setIsEditing(true)}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-900 hover:bg-blue-800 focus:outline-none"
                    >
                        Edit Profile
                    </button>
                </div>

                <div className="space-y-8">
                    {/* Personal Info View */}
                    <div className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-200">
                        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                            <h3 className="text-lg font-medium text-blue-900 flex items-center">
                                <UserIcon className="h-5 w-5 mr-2" /> Personal Information
                            </h3>
                        </div>
                        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-4">
                            <div><span className="block text-sm font-medium text-gray-500">Full Name</span><span className="text-gray-900 font-semibold">{user?.name}</span></div>
                            <div><span className="block text-sm font-medium text-gray-500">Email</span><span className="text-gray-900">{user?.email}</span></div>
                            <div><span className="block text-sm font-medium text-gray-500">Phone</span><span className="text-gray-900">{user?.phoneNumber}</span></div>
                            <div><span className="block text-sm font-medium text-gray-500">PRN</span><span className="text-gray-900">{user?.profile?.prn || 'Not Set'}</span></div>
                            <div className="col-span-1 md:col-span-2"><span className="block text-sm font-medium text-gray-500">Bio</span><span className="text-gray-900">{user?.profile?.bio || 'No bio added.'}</span></div>
                        </div>
                    </div>

                    {/* Education View */}
                    <div className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-200">
                        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                            <h3 className="text-lg font-medium text-blue-900 flex items-center">
                                <BookOpen className="h-5 w-5 mr-2" /> Education Details
                            </h3>
                        </div>
                        <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-y-6 gap-x-4">
                            <div><span className="block text-sm font-medium text-gray-500">Branch</span><span className="text-gray-900">{user?.profile?.education?.branch || 'N/A'}</span></div>
                            <div><span className="block text-sm font-medium text-gray-500">Passing Year</span><span className="text-gray-900">{user?.profile?.education?.passingYear || 'N/A'}</span></div>
                            <div><span className="block text-sm font-medium text-gray-500">10th %</span><span className="text-gray-900">{user?.profile?.education?.tenthPercent || 'N/A'}%</span></div>
                            <div><span className="block text-sm font-medium text-gray-500">12th %</span><span className="text-gray-900">{user?.profile?.education?.twelfthPercent || 'N/A'}%</span></div>
                            <div><span className="block text-sm font-medium text-gray-500">Bachelor's %</span><span className="text-gray-900">{user?.profile?.education?.bachelorsPercent || 'N/A'}%</span></div>
                            <div><span className="block text-sm font-medium text-gray-500">Master's %</span><span className="text-gray-900">{user?.profile?.education?.mastersPercent || 'N/A'}%</span></div>
                        </div>
                    </div>

                    {/* Skills-Resume View */}
                    <div className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-200">
                        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                            <h3 className="text-lg font-medium text-blue-900 flex items-center">
                                <FileText className="h-5 w-5 mr-2" /> Skills & Resume
                            </h3>
                        </div>
                        <div className="p-6">
                            <div className="mb-6">
                                <span className="block text-sm font-medium text-gray-500 mb-2">Skills</span>
                                <div className="flex flex-wrap gap-2">
                                    {user?.profile?.skills?.length ? user.profile.skills.map((skill, idx) => (
                                        <span key={idx} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                            {skill}
                                        </span>
                                    )) : <span className="text-gray-500 italic">No skills added.</span>}
                                </div>
                            </div>
                            <div>
                                <span className="block text-sm font-medium text-gray-500 mb-2">Resume</span>
                                {user?.profile?.resumeOriginalName ? (
                                    <div className="flex items-center p-3 bg-gray-50 rounded-md border border-gray-200">
                                        <FileText className="h-8 w-8 text-red-500 mr-3" />
                                        <span className="text-gray-700 font-medium">{user.profile.resumeOriginalName}</span>
                                    </div>
                                ) : (
                                    <span className="text-gray-500 italic">No resume uploaded.</span>
                                )}
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        );
    }

    // Edit Form
    return (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-20">
            <div className="flex justify-between items-center mb-8 border-b-2 border-yellow-500 pb-2">
                <h2 className="text-3xl font-serif font-bold text-blue-900">Edit Profile</h2>
                <button
                    onClick={() => setIsEditing(false)}
                    className="text-gray-600 hover:text-gray-900 underline text-sm"
                >
                    Cancel
                </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
                {message && (
                    <div className={`p-4 rounded-md border-l-4 shadow-sm ${message.type === 'success' ? 'bg-green-50 border-green-500 text-green-700' : 'bg-red-50 border-red-500 text-red-700'}`}>
                        {message.text}
                    </div>
                )}

                {/* Personal Information */}
                <div className="bg-white shadow-md rounded-lg border border-gray-200 overflow-hidden">
                    <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                        <h3 className="text-lg font-medium text-blue-900 flex items-center">
                            <UserIcon className="h-5 w-5 mr-2" />
                            Personal Information
                        </h3>
                    </div>
                    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Full Name</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-colors"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-colors"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Phone Number</label>
                            <input
                                type="text"
                                name="phoneNumber"
                                value={formData.phoneNumber}
                                onChange={handleChange}
                                className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-colors"
                                required
                            />
                        </div>
                        <div className="col-span-1 md:col-span-2">
                            <label className="block text-sm font-semibold text-gray-700 mb-1">
                                PRN (Permanent Registration Number) <span className="text-red-500">*</span>
                            </label>
                            <div className="relative rounded-md shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <BookOpen className="h-4 w-4 text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    name="prn"
                                    value={formData.prn}
                                    onChange={handleChange}
                                    placeholder="Enter your college PRN"
                                    className="block w-full pl-10 px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-colors"
                                    required
                                />
                            </div>
                        </div>
                        <div className="col-span-1 md:col-span-2">
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Bio</label>
                            <textarea
                                name="bio"
                                rows={3}
                                value={formData.bio}
                                onChange={handleChange}
                                className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-colors"
                                placeholder="Briefly describe yourself..."
                            />
                        </div>
                    </div>
                </div>

                {/* Educational Details */}
                <div className="bg-white shadow-md rounded-lg border border-gray-200 overflow-hidden">
                    <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                        <h3 className="text-lg font-medium text-blue-900 flex items-center">
                            <BookOpen className="h-5 w-5 mr-2" />
                            Educational Details
                        </h3>
                    </div>
                    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">10th Percentage</label>
                            <input type="number" name="tenthPercent" value={formData.tenthPercent} onChange={handleChange} className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 sm:text-sm" placeholder="e.g. 85.5" step="0.01" />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">12th Percentage</label>
                            <input type="number" name="twelfthPercent" value={formData.twelfthPercent} onChange={handleChange} className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 sm:text-sm" placeholder="e.g. 80.0" step="0.01" />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Bachelor's Percentage (Avg)</label>
                            <input type="number" name="bachelorsPercent" value={formData.bachelorsPercent} onChange={handleChange} className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 sm:text-sm" placeholder="e.g. 70.0" step="0.01" />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Master's Percentage (if applicable)</label>
                            <input type="number" name="mastersPercent" value={formData.mastersPercent} onChange={handleChange} className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 sm:text-sm" placeholder="e.g. 75.0" step="0.01" />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Passing Year</label>
                            <input type="number" name="passingYear" value={formData.passingYear} onChange={handleChange} className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 sm:text-sm" placeholder="e.g. 2025" />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Branch</label>
                            <select
                                name="branch"
                                value={formData.branch}
                                onChange={handleChange}
                                className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-colors"
                            >
                                <option value="B.Tech">B.Tech</option>
                                <option value="MCA">MCA</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Skills & Resume */}
                <div className="bg-white shadow-md rounded-lg border border-gray-200 overflow-hidden">
                    <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                        <h3 className="text-lg font-medium text-blue-900 flex items-center">
                            <FileText className="h-5 w-5 mr-2" />
                            Skills & Resume
                        </h3>
                    </div>
                    <div className="p-6 space-y-6">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Skills</label>
                            <input
                                type="text"
                                name="skills"
                                value={formData.skills}
                                onChange={handleChange}
                                className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-colors"
                                placeholder="Java, Python, React (comma separated)"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Resume</label>
                            <div className="flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md hover:bg-gray-50 transition-colors cursor-pointer group">
                                <div className="space-y-1 text-center">
                                    <FileText className="mx-auto h-12 w-12 text-gray-400 group-hover:text-blue-500 transition-colors" />
                                    <div className="flex text-sm text-gray-600 justify-center">
                                        <label htmlFor="resume-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                                            <span>Upload a file</span>
                                            <input id="resume-upload" name="file" type="file" className="sr-only" accept=".pdf,.doc,.docx" onChange={handleChange} />
                                        </label>
                                        <p className="pl-1">or drag and drop</p>
                                    </div>
                                    <p className="text-xs text-gray-500">PDF, DOC up to 5MB</p>
                                    {formData.file && <p className="text-sm text-green-600 mt-2 font-medium">Selected: {(formData.file as File).name}</p>}
                                    {user?.profile?.resumeOriginalName && !formData.file && <p className="text-sm text-gray-500 mt-2">Current Resume: <span className="font-medium text-gray-900">{user.profile.resumeOriginalName}</span></p>}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end pt-4 space-x-4">
                    <button
                        type="button"
                        onClick={() => setIsEditing(false)}
                        className="inline-flex items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-900 hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-900 disabled:opacity-50 transition-all transform hover:scale-105"
                    >
                        <Save className="h-5 w-5 mr-2" />
                        {loading ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            </form>
        </div>
    );
};
