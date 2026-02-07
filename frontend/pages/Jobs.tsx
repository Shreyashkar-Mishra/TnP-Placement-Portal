import React, { useEffect, useState } from 'react';
import { JobService, ApplicationService } from '../services/api';
import { Job } from '../types';
import { Search, MapPin, IndianRupee, Clock, Briefcase, Building2, CheckCircle, Info, X } from 'lucide-react';

export const Jobs: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [appliedJobIds, setAppliedJobIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [applying, setApplying] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      await Promise.all([fetchJobs(), fetchAppliedStatus()]);
      setLoading(false);
    };
    init();
  }, []);

  const fetchJobs = async (keyword = '') => {
    const res = await JobService.getAllJobs(keyword);
    if (res.success && res.jobs) {
      setJobs(res.jobs);
    }
  };

  const fetchAppliedStatus = async () => {
    try {
      const res = await ApplicationService.getAppliedJobs();
      if (res.success && res.applications) {
        const ids = new Set(res.applications.map((app: any) => app.job._id));
        setAppliedJobIds(ids);
      }
    } catch (error) {
      console.error("Failed to fetch application status", error);
    }
  }

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await fetchJobs(searchTerm);
    setLoading(false);
  };

  const handleApply = async (jobId: string) => {
    setApplying(jobId);
    setMessage(null);
    try {
      const res = await ApplicationService.applyJob(jobId);
      if (res.success) {
        setMessage({ type: 'success', text: 'Application submitted successfully!' });
        setAppliedJobIds(prev => new Set(prev).add(jobId));
      } else {
        setMessage({ type: 'error', text: res.message || 'Failed to apply' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'An error occurred' });
    } finally {
      setApplying(null);
      // Clear message after 3 seconds
      setTimeout(() => setMessage(null), 3000);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-serif font-bold text-blue-900 mb-2">Career Opportunities</h1>
          <p className="text-gray-500 text-sm">Explore and apply for campus placement drives.</p>
        </div>
        <form onSubmit={handleSearch} className="flex w-full md:w-auto mt-4 md:mt-0">
          <div className="relative flex-grow md:w-80">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-l-sm leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-900 focus:border-blue-900 sm:text-sm h-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button type="submit" className="bg-blue-900 text-white px-6 py-2 rounded-r-sm hover:bg-blue-800 transition-colors uppercase tracking-wide text-sm font-medium h-10">
            Search
          </button>
        </form>
      </div>

      {message && (
        <div className={`mb-6 p-4 rounded-sm border-l-4 ${message.type === 'success' ? 'bg-green-50 border-green-500 text-green-700' : 'bg-red-50 border-red-500 text-red-700'}`}>
          {message.text}
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="animate-pulse bg-white rounded-sm shadow-sm border border-gray-200 h-64"></div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {jobs.map((job) => {
            const isApplied = appliedJobIds.has(job._id);
            return (
              <div key={job._id} className="bg-white overflow-hidden shadow-sm rounded-sm border border-gray-200 hover:shadow-md transition-shadow flex flex-col group relative">
                <div className="p-6 flex-grow">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-12 w-12 bg-blue-900 rounded-sm flex items-center justify-center">
                      <Building2 className="h-6 w-6 text-white" />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-900 transition-colors">{job.title}</h3>
                      <p className="text-sm text-gray-500 font-medium">
                        {typeof job.company === 'object' ? job.company.name : 'Company Info Hidden'}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 space-y-2">
                    <div className="flex items-center text-sm text-gray-600">
                      <MapPin className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                      {job.location}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <IndianRupee className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                      {job.salary.toLocaleString('en-IN')} LPA
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Clock className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                      Deadline: <span className="text-red-600 ml-1">{new Date(job.applicationDeadline).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <p className="mt-4 text-sm text-gray-500 line-clamp-3 leading-relaxed">{job.description}</p>
                </div>

                <div className="bg-gray-50 px-6 py-4 flex justify-between items-center border-t border-gray-100">
                  <button
                    onClick={() => setSelectedJob(job)}
                    className="text-gray-500 hover:text-blue-900 transition-colors"
                    title="View Details"
                  >
                    <Info className="h-5 w-5" />
                  </button>

                  <button
                    onClick={() => !isApplied && handleApply(job._id)}
                    disabled={applying === job._id || isApplied}
                    className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 uppercase tracking-wide
                    ${isApplied
                        ? 'bg-green-600 text-white cursor-default hover:bg-green-700'
                        : 'bg-blue-900 text-white hover:bg-blue-800 focus:ring-blue-900'
                      } disabled:opacity-50`}
                  >
                    {isApplied ? (
                      <>
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Applied
                      </>
                    ) : (
                      applying === job._id ? 'Processing...' : 'Apply Now'
                    )}
                  </button>
                </div>
              </div>
            )
          })}
          {jobs.length === 0 && (
            <div className="col-span-full text-center py-12 bg-gray-50 rounded-sm border border-dashed border-gray-300">
              <p className="text-gray-500">No active opportunities found at this moment.</p>
            </div>
          )}
        </div>
      )}

      {/* Info Modal */}
      {selectedJob && (
        <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" onClick={() => setSelectedJob(null)}></div>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="flex justify-between items-start">
                  <h3 className="text-2xl font-bold text-gray-900" id="modal-title">
                    {selectedJob.title}
                  </h3>
                  <button onClick={() => setSelectedJob(null)} className="text-gray-400 hover:text-gray-500">
                    <X className="h-6 w-6" />
                  </button>
                </div>
                <div className="mt-2">
                  <p className="text-blue-900 font-semibold text-lg">{typeof selectedJob.company === 'object' ? selectedJob.company.name : ''}</p>

                  <div className="mt-4 grid grid-cols-2 gap-4 text-sm text-gray-600">
                    <div><span className="font-semibold">Role:</span> {selectedJob.role}</div>
                    <div><span className="font-semibold">Location:</span> {selectedJob.location}</div>
                    <div><span className="font-semibold">Salary:</span> {selectedJob.salary.toLocaleString('en-IN')} LPA</div>
                    <div><span className="font-semibold">Type:</span> {selectedJob.jobType}</div>
                    <div><span className="font-semibold">Work Mode:</span> {selectedJob.workMode}</div>
                    <div><span className="font-semibold">Positions:</span> {selectedJob.positionsAvailable}</div>
                  </div>

                  <div className="mt-6">
                    <h4 className="text-md font-bold text-gray-900 mb-2">Description</h4>
                    <p className="text-sm text-gray-600 whitespace-pre-wrap">{selectedJob.description}</p>
                  </div>

                  {selectedJob.educationRequirements && (
                    <div className="mt-6 bg-gray-50 p-4 rounded-md">
                      <h4 className="text-md font-bold text-gray-900 mb-2">Eligibility Criteria</h4>
                      <ul className="list-disc pl-5 text-sm text-gray-600 space-y-1">
                        {selectedJob.educationRequirements.tenthPercent && <li>10th: {selectedJob.educationRequirements.tenthPercent}%</li>}
                        {selectedJob.educationRequirements.twelfthPercent && <li>12th: {selectedJob.educationRequirements.twelfthPercent}%</li>}
                        {selectedJob.educationRequirements.bachelorsPercent && <li>Bachelor's: {selectedJob.educationRequirements.bachelorsPercent}%</li>}
                        {selectedJob.educationRequirements.mastersPercent && <li>Master's: {selectedJob.educationRequirements.mastersPercent}%</li>}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};