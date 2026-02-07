import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthService } from '../services/api';
import { UserRole } from '../types';
import { AlertCircle, Lock, Mail, User, Phone, Loader2, ShieldCheck, Check, GraduationCap } from 'lucide-react';

export const Register: React.FC = () => {
  const [activeTab, setActiveTab] = useState<UserRole>(UserRole.Student);
  const [otpSent, setOtpSent] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
    otp: ''
  });
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);

  const navigate = useNavigate();

  useEffect(() => {
    setError(null);
    setSuccessMsg(null);
    setOtpSent(false);
    setFormData({
      name: '',
      email: '',
      phoneNumber: '',
      password: '',
      confirmPassword: '',
      otp: ''
    });
  }, [activeTab]);

  const checkPasswordStrength = (pass: string) => {
    let score = 0;
    if (!pass) return 0;
    if (pass.length >= 8) score += 1;
    if (/[A-Z]/.test(pass)) score += 1;
    if (/[0-9]/.test(pass)) score += 1;
    if (/[^A-Za-z0-9]/.test(pass)) score += 1;
    return score;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    if (name === 'password') {
      setPasswordStrength(checkPasswordStrength(value));
    }
  };

  const validateForm = () => {
    if (activeTab === UserRole.Student) {
      // Academic portal validation
      const emailRegex = /^[^\s@]+@pccoepune\.org$/;
      if (!emailRegex.test(formData.email)) {
        return "Access Restricted: Please use your official institutional email (@pccoepune.org).";
      }
    } else {
      if (!formData.email.includes('@')) return "Invalid email address format.";
    }

    if (formData.phoneNumber.length !== 10 || !/^\d+$/.test(formData.phoneNumber)) {
      return "Phone number must be exactly 10 digits.";
    }

    if (formData.password.length < 6) {
      return "Password security: Minimum 6 characters required.";
    }

    if (formData.password !== formData.confirmPassword) {
      return "Passwords do not match.";
    }

    if (!formData.name) return "Full Name is required";
    if (!formData.otp) return "Please enter the OTP sent to your email";

    return null;
  };

  const handleSendOtp = async () => {
    setError(null);
    setSuccessMsg(null);
    if (!formData.email) {
      setError("Please enter email first");
      return;
    }
    setLoading(true);
    try {
      const res = await AuthService.sendOtp(formData.email);
      if (res.success) {
        setOtpSent(true);
        setSuccessMsg(`OTP sent to ${formData.email}. It expires in 5 minutes.`);
      } else {
        setError(res.message || "Failed to send OTP");
      }
    } catch (err) {
      setError("Error sending OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const { confirmPassword, ...registerData } = formData;
      const payload = {
        ...registerData,
        role: activeTab
      };

      const response = await AuthService.register(payload);
      if (response.success) {
        if (response.approved === false) {
          alert(response.message); // Admin approval pending
          navigate('/login');
        } else {
          alert("Registration successful, you can proceed to login");
          navigate('/login');
        }
      } else {
        setError(response.message || 'Registration failed.');
      }
    } catch (err: any) {
      const msg = err.response?.data?.message || err.response?.data?.error || 'System error during registration. Please try again later.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center mb-6">
          <div className="bg-blue-900 p-3 rounded-full shadow-lg">
            <GraduationCap className="h-10 w-10 text-white" />
          </div>
        </div>
        <h2 className="text-center text-3xl font-serif font-bold text-blue-900">
          Account Registration
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Create your profile for the Placement Cell Portal
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white shadow-xl sm:rounded-lg overflow-hidden border-t-4 border-yellow-500">

          {/* Role Tabs */}
          <div className="flex border-b border-gray-200 bg-gray-50">
            <button
              onClick={() => setActiveTab(UserRole.Student)}
              className={`flex-1 py-4 text-center text-sm font-medium transition-colors duration-200 flex items-center justify-center ${activeTab === UserRole.Student
                ? 'bg-white text-blue-900 border-b-2 border-blue-900 font-bold'
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                }`}
            >
              <User className="w-4 h-4 mr-2" />
              Student
            </button>
            <button
              onClick={() => setActiveTab(UserRole.Admin)}
              className={`flex-1 py-4 text-center text-sm font-medium transition-colors duration-200 flex items-center justify-center ${activeTab === UserRole.Admin
                ? 'bg-white text-blue-900 border-b-2 border-blue-900 font-bold'
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                }`}
            >
              <ShieldCheck className="w-4 h-4 mr-2" />
              Faculty/Admin
            </button>
            <button
              onClick={() => setActiveTab(UserRole.Company)}
              className={`flex-1 py-4 text-center text-sm font-medium transition-colors duration-200 flex items-center justify-center ${activeTab === UserRole.Company
                ? 'bg-white text-blue-900 border-b-2 border-blue-900 font-bold'
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-building-2 mr-2"><path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z" /><path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2" /><path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2" /><path d="M10 6h4" /><path d="M10 10h4" /><path d="M10 14h4" /><path d="M10 18h4" /></svg>
              Company
            </button>
          </div>

          <div className="py-8 px-4 sm:px-10">
            {error && (
              <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-r-md flex items-center text-sm text-red-700">
                <AlertCircle className="h-5 w-5 mr-3 flex-shrink-0" />
                {error}
              </div>
            )}

            <form className="space-y-5" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  {activeTab === UserRole.Company ? 'Company Name' : 'Full Name'}
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    {activeTab === UserRole.Company ? (
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400"><path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z" /><path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2" /><path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2" /><path d="M10 6h4" /><path d="M10 10h4" /><path d="M10 14h4" /><path d="M10 18h4" /></svg>
                    ) : (
                      <User className="h-5 w-5 text-gray-400" />
                    )}
                  </div>
                  <input id="name" name="name" type="text" required value={formData.name} onChange={handleInputChange} className="focus:ring-blue-900 focus:border-blue-900 block w-full pl-10 sm:text-sm border-gray-300 rounded-md border h-10" />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  {activeTab === UserRole.Student ? 'Institute Email ID' : 'Official Email'}
                </label>
                <div className="mt-1 flex gap-2">
                  <div className="relative rounded-md shadow-sm flex-1">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      disabled={otpSent}
                      className="focus:ring-blue-900 focus:border-blue-900 block w-full pl-10 sm:text-sm border-gray-300 rounded-md border h-10 disabled:bg-gray-100"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleSendOtp}
                    disabled={loading || otpSent || !formData.email}
                    className="bg-blue-100 text-blue-900 px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-200 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                  >
                    {otpSent ? 'OTP Sent' : loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Verify Email'}
                  </button>
                </div>
                {activeTab === UserRole.Student && (
                  <p className="mt-1 text-xs text-gray-500">Only <span className="font-mono text-blue-800">@pccoepune.org</span> addresses are permitted.</p>
                )}
                {successMsg && <p className="mt-1 text-xs text-green-600 font-medium flex items-center"><Check className="h-3 w-3 mr-1" /> {successMsg}</p>}

                {otpSent && (
                  <div className="mt-3 animate-fade-in-down">
                    <label htmlFor="otp" className="block text-sm font-medium text-gray-700">Enter OTP</label>
                    <div className="mt-1">
                      <input
                        id="otp"
                        name="otp"
                        type="text"
                        required
                        value={formData.otp}
                        onChange={handleInputChange}
                        className="focus:ring-blue-900 focus:border-blue-900 block w-full sm:text-sm border-gray-300 rounded-md border h-10 p-2 tracking-widest text-center font-bold"
                        maxLength={6}
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Check your inbox/spam folder.</p>
                  </div>
                )}
              </div>

              <div>
                <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">Contact Number</label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Phone className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="phoneNumber"
                    name="phoneNumber"
                    type="tel"
                    maxLength={10}
                    required
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    className="focus:ring-blue-900 focus:border-blue-900 block w-full pl-10 sm:text-sm border-gray-300 rounded-md border h-10"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    value={formData.password}
                    onChange={handleInputChange}
                    className="focus:ring-blue-900 focus:border-blue-900 block w-full pl-10 sm:text-sm border-gray-300 rounded-md border h-10"
                  />
                </div>
                {/* Visual Strength Meter */}
                {formData.password && (
                  <div className="mt-2 flex items-center space-x-2">
                    <div className="flex-1 flex space-x-1 h-1.5">
                      {[1, 2, 3, 4].map((level) => (
                        <div
                          key={level}
                          className={`flex-1 rounded-full transition-all duration-300 ${passwordStrength >= level
                            ? (passwordStrength < 2 ? 'bg-red-500' : passwordStrength < 3 ? 'bg-yellow-500' : 'bg-green-600')
                            : 'bg-gray-200'
                            }`}
                        />
                      ))}
                    </div>
                    <span className="text-xs text-gray-500 font-medium">
                      {passwordStrength < 2 ? 'Weak' : passwordStrength < 3 ? 'Fair' : 'Strong'}
                    </span>
                  </div>
                )}
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">Confirm Password</label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    required
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="focus:ring-blue-900 focus:border-blue-900 block w-full pl-10 sm:text-sm border-gray-300 rounded-md border h-10"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button type="submit" disabled={loading} className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-sm shadow-sm text-sm font-medium text-white bg-blue-900 hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-900 disabled:opacity-50 uppercase tracking-wide transition-colors">
                  {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Register Account'}
                </button>
              </div>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Already registered?{' '}
                <Link to="/login" className="font-medium text-blue-900 hover:underline">
                  Sign in here
                </Link>
              </p>
            </div>
          </div>
        </div>
        <div className="text-center mt-4">
          <p className="text-xs text-gray-500">&copy; PCCoE Training & Placement Cell</p>
        </div>
      </div>
    </div>
  );
};