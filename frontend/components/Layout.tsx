import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, GraduationCap, Menu, X, Phone, Mail, Globe } from 'lucide-react';
import { AuthService } from '../services/api';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, logout, role, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const handleLogout = async () => {
    await AuthService.logout();
    logout();
    navigate('/login');
  };

  const isActive = (path: string) => location.pathname === path ? "text-blue-900 border-b-2 border-blue-900 font-bold" : "text-gray-700 hover:text-blue-900 hover:bg-gray-50";

  const handlePlaceholderClick = (e: React.MouseEvent) => {
    e.preventDefault();
    alert("This page still needs to be created.");
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 font-sans">
      {/* Institutional Top Bar */}
      <div className="bg-blue-900 text-white py-2 text-xs font-medium tracking-wide">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <div className="flex space-x-6">
            <span className="flex items-center"><Phone className="h-3 w-3 mr-2" /> +91 20 2765 3168</span>
            <span className="flex items-center"><Mail className="h-3 w-3 mr-2" /> tpo@pccoepune.org</span>
          </div>
          <div className="hidden md:flex space-x-4">
            <a href="#" onClick={handlePlaceholderClick} className="hover:text-yellow-400 transition-colors">Alumni</a>
            <span className="text-blue-700">|</span>
            <a href="#" onClick={handlePlaceholderClick} className="hover:text-yellow-400 transition-colors">Faculty</a>
            <span className="text-blue-700">|</span>
            <a href="https://mca.pccoepune.com/" target="_blank" rel="noopener noreferrer" className="flex items-center hover:text-yellow-400 transition-colors"><Globe className="h-3 w-3 mr-1" /> Main Website</a>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <nav className="bg-white shadow-md border-b-4 border-yellow-500 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-24">
            <div className="flex items-center cursor-pointer" onClick={() => navigate('/')}>
              <div className="flex-shrink-0 flex items-center">
                <div className="bg-blue-900 p-2 rounded-full">
                  <GraduationCap className="h-8 w-8 text-white" />
                </div>
              </div>
              <div className="ml-4 flex flex-col justify-center h-full">
                <span className="text-2xl font-serif font-bold text-blue-900 leading-none tracking-tight">PCCoE</span>
                <span className="text-sm text-gray-600 font-medium uppercase tracking-wider mt-1">Training & Placement Cell</span>
              </div>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-8">
              {isAuthenticated ? (
                <>
                  {role !== 'company' && (
                    <Link to="/dashboard" className={`py-2 text-sm uppercase tracking-wide transition-all ${isActive('/dashboard')}`}>
                      Dashboard
                    </Link>
                  )}
                  {role === 'student' && (
                    <>
                      <Link to="/jobs" className={`py-2 text-sm uppercase tracking-wide transition-all ${isActive('/jobs')}`}>
                        Opportunities
                      </Link>
                      <Link to="/profile" className={`py-2 text-sm uppercase tracking-wide transition-all ${isActive('/profile')}`}>
                        Profile
                      </Link>
                    </>
                  )}
                  {role === 'admin' && (
                    <>
                      <Link to="/admin/post-job" className={`py-2 text-sm uppercase tracking-wide transition-all ${isActive('/admin/post-job')}`}>
                        Post Job
                      </Link>
                      <Link to="/admin/companies" className={`py-2 text-sm uppercase tracking-wide transition-all ${isActive('/admin/companies')}`}>
                        Register Company
                      </Link>
                      <Link to="/admin/approvals" className={`py-2 text-sm uppercase tracking-wide transition-all ${isActive('/admin/approvals')}`}>
                        Approvals
                      </Link>
                    </>
                  )}
                  {role === 'company' && (
                    <>
                      <Link to="/company/dashboard" className={`py-2 text-sm uppercase tracking-wide transition-all ${isActive('/company/dashboard')}`}>
                        Dashboard
                      </Link>
                      <Link to="/post-job" className={`py-2 text-sm uppercase tracking-wide transition-all ${isActive('/post-job')}`}>
                        Post Job
                      </Link>
                    </>
                  )}

                  <div className="flex items-center ml-6 pl-6 border-l border-gray-300 space-x-4">
                    <div className="flex flex-col items-end">
                      <span className="text-sm font-bold text-blue-900">{user?.name}</span>
                      <span className="text-xs text-gray-500 uppercase tracking-wider">{role}</span>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="p-2 text-gray-400 hover:text-red-700 transition-colors"
                      title="Logout"
                    >
                      <LogOut className="h-5 w-5" />
                    </button>
                  </div>
                </>
              ) : (
                <div className="flex items-center space-x-4">
                  <Link to="/login" className="text-gray-700 hover:text-blue-900 font-medium text-sm uppercase tracking-wide">
                    Login
                  </Link>
                  <Link to="/register" className="bg-blue-900 hover:bg-blue-800 text-white px-6 py-2.5 rounded-sm text-sm font-medium transition-colors shadow-sm uppercase tracking-wide">
                    Register
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="flex items-center md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 rounded-md text-gray-600 hover:text-blue-900 focus:outline-none"
              >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200 bg-white">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {isAuthenticated ? (
                <>
                  <Link to="/dashboard" className="block px-3 py-2 text-base font-medium text-blue-900 border-l-4 border-transparent hover:bg-gray-50 hover:border-blue-900">Dashboard</Link>
                  {role === 'student' && (
                    <>
                      <Link to="/jobs" className="block px-3 py-2 text-base font-medium text-gray-700 border-l-4 border-transparent hover:bg-gray-50 hover:border-blue-900">Opportunities</Link>
                      <Link to="/applications" className="block px-3 py-2 text-base font-medium text-gray-700 border-l-4 border-transparent hover:bg-gray-50 hover:border-blue-900">Applications</Link>
                      <Link to="/profile" className="block px-3 py-2 text-base font-medium text-gray-700 border-l-4 border-transparent hover:bg-gray-50 hover:border-blue-900">Profile</Link>
                    </>
                  )}
                  {role === 'admin' && (
                    <>
                      <Link to="/admin/companies" className="block px-3 py-2 text-base font-medium text-gray-700 border-l-4 border-transparent hover:bg-gray-50 hover:border-blue-900">Recruiters</Link>
                    </>
                  )}
                  <button onClick={handleLogout} className="w-full text-left block px-3 py-2 text-base font-medium text-red-700 hover:bg-red-50">Logout</button>
                </>
              ) : (
                <>
                  <Link to="/login" className="block px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50">Login</Link>
                  <Link to="/register" className="block px-3 py-2 text-base font-medium text-blue-900 hover:bg-gray-50">Register</Link>
                </>
              )}
            </div>
          </div>
        )}
      </nav>

      <main className="flex-grow">
        {children}
      </main>

      <footer className="bg-slate-900 text-white border-t-4 border-yellow-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <h3 className="text-xl font-serif font-bold text-yellow-500 mb-4">Pimpri Chinchwad College of Engineering</h3>
              <p className="text-gray-300 text-sm leading-relaxed max-w-sm">
                Dedicated to serving the society by providing quality education and promoting interaction with the industry. The Training & Placement Cell ensures the best opportunities for every student.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-bold text-white mb-4 uppercase text-sm tracking-wider">Quick Links</h4>
              <ul className="space-y-2 text-sm text-gray-300">
                <li><a href="#" onClick={handlePlaceholderClick} className="hover:text-yellow-400 transition-colors">Placement Statistics</a></li>
                <li><a href="#" onClick={handlePlaceholderClick} className="hover:text-yellow-400 transition-colors">Our Recruiters</a></li>
                <li><a href="#" onClick={handlePlaceholderClick} className="hover:text-yellow-400 transition-colors">Student Resources</a></li>
                <li><a href="#" onClick={handlePlaceholderClick} className="hover:text-yellow-400 transition-colors">Contact Us</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-bold text-white mb-4 uppercase text-sm tracking-wider">Contact</h4>
              <ul className="space-y-2 text-sm text-gray-300">
                <li className="flex items-start"><span className="font-bold mr-2">Address:</span> Sector - 26, Pradhikaran, Nigdi, Pune - 411044</li>
                <li className="flex items-center"><span className="font-bold mr-2">Email:</span> tpo@pccoepune.org</li>
                <li className="flex items-center"><span className="font-bold mr-2">Phone:</span> +91 20 2765 3168</li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-800 text-center text-xs text-gray-500">
            <p>&copy; {new Date().getFullYear()} PCCoE Training & Placement Cell. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};