
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { AuthService } from '../services/api';
import { UserRole } from '../types';
import { AlertCircle, Lock, Mail, Loader2, User, ShieldCheck, GraduationCap } from 'lucide-react';

export const Login: React.FC = () => {
  const [activeTab, setActiveTab] = useState<UserRole>(UserRole.Student);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // NOTE: Make sure your backend login controller returns the user object!
      const response = await AuthService.login(formData.email, formData.password, activeTab);

      console.log("Login Response:", response);

      if (response.success) {
        // If backend sends user in response (Recommended)
        if (response.user) {
          login(response.user);
          if (response.user.roles.includes('company')) {
            navigate('/company/dashboard');
          } else {
            navigate('/dashboard');
          }
        }
        // Fallback: If backend only sends success:true but no user object,
        // we might manually reconstruct it or fetch profile. 
        // Ideally, update backend to send `user`.
        else {
          // Temporary fallback for testing if backend isn't updated yet
          login({
            _id: 'temp_id',
            name: 'User',
            email: formData.email,
            phoneNumber: '',
            roles: [activeTab]
          });
          if (activeTab === UserRole.Company) {
            navigate('/company/dashboard');
          } else {
            navigate('/dashboard');
          }
        }
      } else {
        setError(response.message || 'Login failed. Please check your credentials.');
      }
    } catch (err) {
      setError('An unexpected error occurred. Is the backend server running?');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Image */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-blue-900">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1562774053-701939374585?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80"
            alt="College Campus"
            className="w-full h-full object-cover opacity-30"
          />
        </div>
        <div className="relative z-10 w-full flex flex-col justify-center px-12 text-white">
          <GraduationCap className="h-16 w-16 mb-6 text-yellow-500" />
          <h1 className="text-4xl font-serif font-bold mb-4">Welcome to the PCCoE Placement Portal</h1>
          <p className="text-lg text-blue-100 leading-relaxed">
            The official centralized platform for campus recruitment activities. Students and recruiters can manage their processes efficiently and securely.
          </p>
          <div className="mt-12 pt-12 border-t border-blue-700">
            <p className="text-sm text-blue-300">
              Need assistance? Contact the TPO cell at <br />
              <span className="font-semibold text-white">tpo@pccoepune.org</span>
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-20 xl:px-24 bg-gray-50">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          <div className="text-center lg:text-left mb-10">
            <h2 className="mt-6 text-3xl font-serif font-bold text-gray-900">
              Sign In
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Access your institutional dashboard
            </p>
          </div>

          <div className="bg-white py-8 px-4 shadow-lg sm:rounded-lg sm:px-10 border-t-4 border-blue-900">
            {/* Role Tabs */}
            <div className="flex mb-6 bg-gray-100 p-1 rounded-md">
              <button
                onClick={() => { setActiveTab(UserRole.Student); setError(null); }}
                className={`flex-1 py-2 text-sm font-medium rounded-md flex items-center justify-center transition-all ${activeTab === UserRole.Student
                  ? 'bg-white text-blue-900 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
                  }`}
              >
                <User className="w-4 h-4 mr-2" />
                Student
              </button>
              <button
                onClick={() => { setActiveTab(UserRole.Admin); setError(null); }}
                className={`flex-1 py-2 text-sm font-medium rounded-md flex items-center justify-center transition-all ${activeTab === UserRole.Admin
                  ? 'bg-white text-blue-900 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
                  }`}
              >
                <ShieldCheck className="w-4 h-4 mr-2" />
                Admin
              </button>
              <button
                onClick={() => { setActiveTab(UserRole.Company); setError(null); }}
                className={`flex-1 py-2 text-sm font-medium rounded-md flex items-center justify-center transition-all ${activeTab === UserRole.Company
                  ? 'bg-white text-blue-900 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
                  }`}
              >
                <div className='flex items-center'>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-building-2 mr-2"><path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z" /><path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2" /><path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2" /><path d="M10 6h4" /><path d="M10 10h4" /><path d="M10 14h4" /><path d="M10 18h4" /></svg>
                  Company
                </div>
              </button>
            </div>

            {error && (
              <div className="mb-4 bg-red-50 border-l-4 border-red-500 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <AlertCircle className="h-5 w-5 text-red-500" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                </div>
              </div>
            )}

            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  {activeTab === UserRole.Student ? 'Institute Email ID' : 'Administrative Email'}
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="focus:ring-blue-900 focus:border-blue-900 block w-full pl-10 sm:text-sm border-gray-300 rounded-md h-10 border"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    className="focus:ring-blue-900 focus:border-blue-900 block w-full pl-10 sm:text-sm border-gray-300 rounded-md h-10 border"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-blue-900 focus:ring-blue-900 border-gray-300 rounded"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                    Remember me
                  </label>
                </div>

                <div className="text-sm">
                  <Link to="/forgot-password" className="font-medium text-blue-900 hover:text-blue-800 underline">
                    Forgot password?
                  </Link>
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-sm shadow-sm text-sm font-medium text-white bg-blue-900 hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-900 disabled:opacity-50 transition-colors uppercase tracking-wide"
                >
                  {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Secure Login'}
                </button>
              </div>
            </form>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">
                    New to the portal?
                  </span>
                </div>
              </div>

              <div className="mt-6">
                <Link
                  to="/register"
                  className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-sm shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  Create an account
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
