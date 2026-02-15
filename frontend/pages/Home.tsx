import React from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, Building2, Users, BookOpen, Award, CheckCircle } from 'lucide-react';

export const Home: React.FC = () => {
  return (
    <div className="bg-white">
      {/* Formal Hero Section */}
      <div className="relative bg-blue-900">
        <div className="absolute inset-0">
          <img
            className="w-full h-full object-cover opacity-20"
            src="https://images.unsplash.com/photo-1541339907198-e08756dedf3f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80"
            alt="University Campus"
          />
        </div>
        <div className="relative max-w-7xl mx-auto py-24 px-4 sm:py-32 sm:px-6 lg:px-8">
          <div className="text-center md:text-left md:w-2/3">
            <h1 className="text-4xl font-serif font-bold tracking-tight text-white sm:text-5xl lg:text-6xl mb-6">
              Training & Placement Cell
            </h1>
            <p className="mt-6 text-xl text-blue-100 max-w-3xl font-light leading-relaxed">
              Bridging the gap between academia and industry. We are committed to providing comprehensive career guidance and placement opportunities for our engineering graduates.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <Link to="/register" className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-sm text-blue-900 bg-yellow-500 hover:bg-yellow-400 md:py-4 md:text-lg transition-colors shadow-md">
                Student Registration
              </Link>
              <Link to="/login" className="inline-flex items-center justify-center px-8 py-3 border border-white text-base font-medium rounded-sm text-white hover:bg-white hover:text-blue-900 md:py-4 md:text-lg transition-colors backdrop-blur-sm bg-white/10">
                Portal Login
              </Link>
            </div>
          </div>
        </div>
        <div className="h-4 bg-yellow-500 w-full absolute bottom-0"></div>
      </div>

      {/* Director's Message / Vision */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:flex lg:items-center lg:justify-between gap-12">
            <div className="lg:w-1/2">
              <h2 className="text-3xl font-serif font-bold text-blue-900 mb-6">Our Vision</h2>
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                To empower students with the skills and opportunities required to excel in their professional careers. The placement cell works tirelessly to maintain strong relationships with industry leaders and provide a platform for students to showcase their talents.
              </p>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <CheckCircle className="h-6 w-6 text-green-600 mr-3 mt-1" />
                  <span className="text-gray-700">Holistic development through soft skills training and mock interviews.</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-6 w-6 text-green-600 mr-3 mt-1" />
                  <span className="text-gray-700">Consistent track record of 90%+ placements in core and IT sectors.</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-6 w-6 text-green-600 mr-3 mt-1" />
                  <span className="text-gray-700">Industry-institute interaction through guest lectures and internships.</span>
                </li>
              </ul>
            </div>
            <div className="mt-10 lg:mt-0 lg:w-1/2 relative">
              <div className="bg-gray-100 p-2 rounded-sm shadow-xl transform rotate-2">
                <img src="/10.jpeg" alt="Students in library" className="w-full h-auto rounded-sm" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Statistics Strip */}
      <div className="bg-slate-900 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <div className="text-center p-6 border-r border-slate-700 last:border-0">
              <p className="text-5xl font-serif font-bold text-yellow-500">92%</p>
              <p className="mt-2 text-sm font-medium text-blue-200 uppercase tracking-widest">Placement Rate</p>
            </div>
            <div className="text-center p-6 border-r border-slate-700 last:border-0">
              <p className="text-5xl font-serif font-bold text-yellow-500">350+</p>
              <p className="mt-2 text-sm font-medium text-blue-200 uppercase tracking-widest">Recruiters</p>
            </div>
            <div className="text-center p-6 border-r border-slate-700 last:border-0">
              <p className="text-5xl font-serif font-bold text-yellow-500">20 LPA</p>
              <p className="mt-2 text-sm font-medium text-blue-200 uppercase tracking-widest">Highest Package</p>
            </div>
            <div className="text-center p-6">
              <p className="text-5xl font-serif font-bold text-yellow-500">1200+</p>
              <p className="mt-2 text-sm font-medium text-blue-200 uppercase tracking-widest">Students Placed</p>
            </div>
          </div>
        </div>
      </div>

      {/* Information Cards */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-serif font-bold text-center text-blue-900 mb-12">Placement Process</h2>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="bg-white rounded-sm shadow-md p-8 border-t-4 border-blue-900">
              <div className="flex justify-center mb-6">
                <BookOpen className="h-12 w-12 text-blue-900" />
              </div>
              <h3 className="text-xl font-bold text-center text-gray-900 mb-4">Registration & Profiling</h3>
              <p className="text-gray-600 text-center text-sm leading-relaxed">
                Students register on the portal and create detailed academic profiles, uploading resumes and verifying their credentials.
              </p>
            </div>

            <div className="bg-white rounded-sm shadow-md p-8 border-t-4 border-blue-900">
              <div className="flex justify-center mb-6">
                <Building2 className="h-12 w-12 text-blue-900" />
              </div>
              <h3 className="text-xl font-bold text-center text-gray-900 mb-4">Recruitment Drives</h3>
              <p className="text-gray-600 text-center text-sm leading-relaxed">
                Top companies visit for campus recruitment. Students apply for eligible jobs and participate in selection processes.
              </p>
            </div>

            <div className="bg-white rounded-sm shadow-md p-8 border-t-4 border-blue-900">
              <div className="flex justify-center mb-6">
                <Award className="h-12 w-12 text-blue-900" />
              </div>
              <h3 className="text-xl font-bold text-center text-gray-900 mb-4">Selection & Offer</h3>
              <p className="text-gray-600 text-center text-sm leading-relaxed">
                Selected candidates receive offers. The placement cell facilitates the onboarding process and ensures a smooth transition.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};