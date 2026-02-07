import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { ApplicationService, JobService, CompanyService, AuthService } from '../services/api';
import { UserRole, Application, Job } from '../types';
import { Briefcase, FileCheck, XCircle, Clock, Users, Building2, Edit, Trash2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const StatCard: React.FC<{ title: string; value: number; icon: React.ReactNode; color: string }> = ({ title, value, icon, color }) => (
  <div className="bg-white overflow-hidden shadow-sm rounded-sm border border-gray-200">
    <div className="p-5">
      <div className="flex items-center">
        <div className={`flex-shrink-0 rounded-sm p-3 ${color}`}>
          {icon}
        </div>
        <div className="ml-5 w-0 flex-1">
          <dl>
            <dt className="text-sm font-medium text-gray-500 truncate uppercase tracking-wider">{title}</dt>
            <dd>
              <div className="text-2xl font-serif font-bold text-gray-900">{value}</div>
            </dd>
          </dl>
        </div>
      </div>
    </div>
  </div>
);

const StudentDashboard = () => {
  const [applications, setApplications] = useState<Application[]>([]);

  useEffect(() => {
    // Mock data fetch - replace with real API call
    const fetchApps = async () => {
      const res = await ApplicationService.getAppliedJobs();
      if (res.success && res.applications) {
        setApplications(res.applications);
      }
    };
    fetchApps();
  }, []);

  const stats = {
    applied: applications.length,
    accepted: applications.filter(a => a.status === 'accepted').length,
    rejected: applications.filter(a => a.status === 'rejected').length,
    pending: applications.filter(a => a.status === 'applied' || a.status === 'under review').length,
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-serif font-bold text-blue-900">Student Dashboard</h2>
        <p className="text-sm text-gray-500">Overview of your placement activities.</p>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Applications" value={stats.applied} icon={<Briefcase className="h-6 w-6 text-white" />} color="bg-blue-900" />
        <StatCard title="Selections" value={stats.accepted} icon={<FileCheck className="h-6 w-6 text-white" />} color="bg-green-700" />
        <StatCard title="In Process" value={stats.pending} icon={<Clock className="h-6 w-6 text-white" />} color="bg-yellow-600" />
        <StatCard title="Rejected" value={stats.rejected} icon={<XCircle className="h-6 w-6 text-white" />} color="bg-red-700" />
      </div>

      <div className="bg-white shadow-sm rounded-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Recent Applications</h3>
        </div>

        {applications.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {applications.slice(0, 5).map((app) => (
                  <tr key={app._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                      {typeof app.job.company === 'object' ? app.job.company.name : 'Unknown Company'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-600">{app.job.title}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-sm border
                        ${app.status === 'accepted' ? 'bg-green-50 text-green-800 border-green-200' :
                          app.status === 'selected' ? 'bg-blue-100 text-blue-800 border-blue-200' :
                            app.status === 'rejected' ? 'bg-red-50 text-red-800 border-red-200' :
                              'bg-yellow-50 text-yellow-800 border-yellow-200'}`}>
                        {app.status === 'accepted' ? 'Application Approved, Recruitment in Process' :
                          app.status === 'selected' ? 'Congratulations! You are Selected' :
                            app.status === 'rejected' ? 'Not Eligible' :
                              app.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-500 text-sm">
                      {new Date(app.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-6 text-center text-gray-500">
            <p>You haven't applied to any jobs yet.</p>
          </div>
        )}
        <div className="bg-gray-50 px-6 py-3 border-t border-gray-200">
          <Link to="/jobs" className="text-blue-900 hover:text-blue-700 font-medium text-sm flex items-center">Browse all jobs &rarr;</Link>
        </div>
      </div>
    </div>
  );
};

const AdminDashboard = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [companyCount, setCompanyCount] = useState(0);
  const [placementCount, setPlacementCount] = useState(0);
  const [studentCount, setStudentCount] = useState(0);

  useEffect(() => {
    const fetchJobs = async () => {
      const res = await JobService.getAdminJobs();
      if (res.success && res.jobs) {
        setJobs(res.jobs);
      }
    }
    const fetchCompanies = async () => {
      const res = await CompanyService.getAll();
      if (res.success && res.companies) {
        setCompanyCount(res.companies.length);
      }
    }
    const fetchPlacements = async () => {
      try {
        const res = await ApplicationService.getPlacementCount();
        if (res.success) {
          setPlacementCount(res.count);
        }
      } catch (e) { console.error("Failed to fetch placement count"); }
    }
    const fetchStudents = async () => {
      try {
        const res = await AuthService.getStudentCount();
        if (res.success) {
          setStudentCount(res.count);
        }
      } catch (e) { console.error("Failed to fetch student count"); }
    }
    fetchJobs();
    fetchCompanies();
    fetchPlacements();
    fetchStudents();
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-serif font-bold text-blue-900">Admin Portal</h2>
        <p className="text-sm text-gray-500">Manage recruitment drives and student data.</p>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Active Jobs" value={jobs.length} icon={<Briefcase className="h-6 w-6 text-white" />} color="bg-blue-900" />
        <StatCard title="Students" value={studentCount} icon={<Users className="h-6 w-6 text-white" />} color="bg-indigo-700" />
        <StatCard title="Placements" value={placementCount} icon={<FileCheck className="h-6 w-6 text-white" />} color="bg-green-700" />
        <StatCard title="Company Recruiting Now" value={companyCount} icon={<Building2 className="h-6 w-6 text-white" />} color="bg-slate-700" />
      </div>

      <div className="bg-white shadow-sm rounded-sm border border-gray-200">
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Posted Jobs Overview</h3>
          <Link to="/admin/post-job" className="bg-blue-900 text-white px-4 py-2 rounded-sm text-sm hover:bg-blue-800 transition-colors uppercase tracking-wide">Post New Job</Link>
        </div>

        {jobs.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Posted Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {jobs.slice(0, 5).map((job) => (
                  <tr key={job._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{job.title}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                      {typeof job.company === 'object' ? job.company.name : 'ID: ' + job.company}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-500 text-sm">
                      {new Date(job.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-3">
                        <Link to={`/admin/job/${job._id}/applicants`} className="text-blue-600 hover:text-blue-900 border border-blue-200 bg-blue-50 px-3 py-1 rounded text-xs transition-colors hover:bg-blue-100">Applicants</Link>
                        <Link to={`/admin/post-job?jobId=${job._id}`} className="text-indigo-600 hover:text-indigo-900 p-1 hover:bg-indigo-50 rounded transition-colors" title="Edit Job">
                          <Edit className="h-5 w-5" />
                        </Link>
                        <button
                          onClick={async () => {
                            if (window.confirm('Are you sure you want to delete this job? All applications will be removed.')) {
                              const res = await JobService.deleteJob(job._id);
                              if (res.success) {
                                setJobs(prev => prev.filter(j => j._id !== job._id));
                              } else {
                                alert("Failed to delete job");
                              }
                            }
                          }}
                          className="text-red-500 hover:text-red-700 p-1 hover:bg-red-50 rounded transition-colors"
                          title="Delete Job"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-6 text-center text-gray-500">No jobs posted yet.</div>
        )}
      </div>
    </div>
  );
};

export const Dashboard: React.FC = () => {
  const { role } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (role === UserRole.Company) {
      navigate('/company/dashboard');
    }
  }, [role, navigate]);

  if (role === UserRole.Company) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {role === UserRole.Student ? <StudentDashboard /> : <AdminDashboard />}
    </div>
  );
};