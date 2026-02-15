
import React, { useState, useEffect } from 'react';
import { JobService, CompanyService } from '../services/api';
import { Company } from '../types';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const PostJob: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const editJobId = searchParams.get('jobId');
  const isEditMode = !!editJobId;

  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(false);
  const [consentFile, setConsentFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    educationRequirements: {
      tenthPercent: '',
      twelfthPercent: '',
      bachelorsPercent: '',
      mastersPercent: '',
      maxBacklogs: '0'
    },
    location: '',
    salary: '',
    position: '',
    companyId: '',
    positionsAvailable: '',
    applicationDeadline: '',
    jobType: '',
    workMode: ''
  });

  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    // Load Companies if Admin
    if (user.roles.includes('admin') && !user.roles.includes('company')) {
      const fetchCompanies = async () => {
        try {
          const res = await CompanyService.getAll();
          if (res.success && res.companies) {
            setCompanies(res.companies);
          }
        } catch (e) { console.error("Failed to load companies"); }
      };
      fetchCompanies();
    } else if (user.roles.includes('company')) {
      setFormData(prev => ({ ...prev, companyId: 'SELF' }));
    }

    // Load Job Data if Editing
    if (isEditMode && editJobId) {
      const fetchJob = async () => {
        try {
          const res = await JobService.getJobById(editJobId);
          if (res.success && res.job) {
            const j = res.job;
            setFormData({
              title: j.title || '',
              description: j.description || '',
              educationRequirements: {
                tenthPercent: j.educationRequirements?.tenthPercent || '',
                twelfthPercent: j.educationRequirements?.twelfthPercent || '',
                bachelorsPercent: j.educationRequirements?.bachelorsPercent || '',
                mastersPercent: j.educationRequirements?.mastersPercent || '',
                maxBacklogs: j.educationRequirements?.maxBacklogs?.toString() || '0'
              },
              location: j.location || '',
              salary: j.salary?.toString() || '',
              position: j.role || '', // DB uses 'role', form uses 'position'
              companyId: typeof j.company === 'object' ? j.company._id : j.company || '',
              positionsAvailable: j.positionsAvailable?.toString() || '',
              applicationDeadline: j.applicationDeadline ? new Date(j.applicationDeadline).toISOString().split('T')[0] : '',
              jobType: j.jobType || '',
              workMode: j.workMode || ''
            });
          }
        } catch (error) {
          console.error("Failed to load job details", error);
        }
      };
      fetchJob();
    }

  }, [user, isEditMode, editJobId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          // @ts-ignore
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const data = new FormData();
    data.append('title', formData.title);
    data.append('description', formData.description);
    data.append('location', formData.location);
    data.append('salary', formData.salary);
    data.append('position', formData.position);
    data.append('positionsAvailable', formData.positionsAvailable);
    data.append('applicationDeadline', formData.applicationDeadline);
    data.append('jobType', formData.jobType);
    data.append('workMode', formData.workMode);

    if (formData.companyId) data.append('companyId', formData.companyId);

    // Flatten education requirements
    data.append('educationRequirements[tenthPercent]', formData.educationRequirements.tenthPercent || '0');
    data.append('educationRequirements[twelfthPercent]', formData.educationRequirements.twelfthPercent || '0');
    data.append('educationRequirements[bachelorsPercent]', formData.educationRequirements.bachelorsPercent || '0');
    if (formData.educationRequirements.mastersPercent) {
      data.append('educationRequirements[mastersPercent]', formData.educationRequirements.mastersPercent);
    }
    data.append('educationRequirements[maxBacklogs]', formData.educationRequirements.maxBacklogs || '0');

    if (consentFile) {
      data.append('consentForm', consentFile);
    }

    try {
      let res;
      if (isEditMode && editJobId) {
        // Update not supporting file upload yet in this flow or same endpoint?
        // Usually update uses JSON. If we want file update, we need multipart/form-data on PUT too.
        // For now, assuming only POST supports file upload as per plan.
        // Existing updateJob controller uses req.body directly. 
        // Let's warn user or just send JSON for update if file not changed?
        // Simplest: Don't support file update in Edit mode for now, or assume backend handles JSON update.
        // Detailed Refactor: Backend updateJob needs to handle file.
        // Current task focus: Creating a job with consent form.
        res = await JobService.updateJob(editJobId, formData); // Fallback to JSON for edit
      } else {
        res = await JobService.postJob(data); // FormData for create
      }

      if (res.success) {
        alert(isEditMode ? 'Job updated successfully. Applications have been reset.' : 'Job posted successfully.');
        if (user?.roles.includes('company')) {
          navigate('/company/dashboard');
        } else {
          navigate('/dashboard');
        }
      } else {
        alert('Failed to save job: ' + res.message);
      }
    } catch (error: any) {
      console.error(error);
      alert('Error saving job');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
        <div className="md:grid md:grid-cols-3 md:gap-6">
          <div className="md:col-span-1">
            <h3 className="text-lg font-medium leading-6 text-gray-900">{isEditMode ? 'Edit Job' : 'Post a Job'}</h3>
            <p className="mt-1 text-sm text-gray-500">
              {isEditMode
                ? 'Update job details. NOTE: Saving changes will reset all existing applications for this job.'
                : 'Create a new opening for students. Ensure you select a registered company.'}
            </p>
          </div>
          <div className="mt-5 md:mt-0 md:col-span-2">
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-6 gap-6">

                <div className="col-span-6 sm:col-span-3">
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700">Job Title</label>
                  <input type="text" name="title" id="title" required value={formData.title} onChange={handleChange} className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md border p-2" />
                </div>

                {user?.roles.includes('admin') && !isEditMode && (
                  <div className="col-span-6 sm:col-span-3">
                    <label htmlFor="companyId" className="block text-sm font-medium text-gray-700">Company</label>
                    <select id="companyId" name="companyId" required value={formData.companyId} onChange={handleChange} className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                      <option value="">Select Company</option>
                      {companies.map(c => (
                        <option key={c._id} value={c._id}>{c.name}</option>
                      ))}
                    </select>
                    {companies.length === 0 && <p className="text-xs text-red-500 mt-1">No companies found. Register a company first.</p>}
                  </div>
                )}

                {/* For Admin Edit Mode, maybe show company but disable it or allow change if needed. Assuming keeping same company for simplicity or hidden fields */}

                <div className="col-span-6">
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                  <textarea name="description" id="description" rows={3} required value={formData.description} onChange={handleChange} className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md border p-2"></textarea>
                </div>

                <div className="col-span-6 sm:col-span-3">
                  <label htmlFor="location" className="block text-sm font-medium text-gray-700">Location</label>
                  <input type="text" name="location" id="location" required value={formData.location} onChange={handleChange} className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md border p-2" />
                </div>

                <div className="col-span-6 sm:col-span-3">
                  <label htmlFor="salary" className="block text-sm font-medium text-gray-700">Salary (LPA)</label>
                  <input type="number" name="salary" id="salary" required value={formData.salary} onChange={handleChange} className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md border p-2" />
                </div>

                <div className="col-span-6 sm:col-span-3">
                  <label htmlFor="jobType" className="block text-sm font-medium text-gray-700">Job Type</label>
                  <select name="jobType" id="jobType" required value={formData.jobType} onChange={handleChange} className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                    <option value="">Select Type</option>
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Contract">Contract</option>
                    <option value="Internship">Internship</option>
                  </select>
                </div>

                <div className="col-span-6 sm:col-span-3">
                  <label htmlFor="workMode" className="block text-sm font-medium text-gray-700">Work Mode</label>
                  <select name="workMode" id="workMode" required value={formData.workMode} onChange={handleChange} className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                    <option value="">Select Mode</option>
                    <option value="On-site">On-site</option>
                    <option value="Remote">Remote</option>
                    <option value="Hybrid">Hybrid</option>
                  </select>
                </div>



                <div className="col-span-6 sm:col-span-3">
                  <label htmlFor="positionsAvailable" className="block text-sm font-medium text-gray-700">No. of Openings</label>
                  <input type="number" name="positionsAvailable" id="positionsAvailable" required value={formData.positionsAvailable} onChange={handleChange} className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md border p-2" />
                </div>

                <div className="col-span-6 sm:col-span-3">
                  <label htmlFor="applicationDeadline" className="block text-sm font-medium text-gray-700">Deadline</label>
                  <input type="date" name="applicationDeadline" id="applicationDeadline" required value={formData.applicationDeadline} onChange={handleChange} className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md border p-2" />
                </div>

                <div className="col-span-6">
                  <label className="block text-sm font-medium text-gray-700">Consent Form Format (PDF/DOC)</label>
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                    <div className="space-y-1 text-center">
                      <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                        <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      <div className="flex text-sm text-gray-600">
                        <label htmlFor="consent-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                          <span>Upload a file</span>
                          <input id="consent-upload" name="file" type="file" className="sr-only" onChange={(e) => setConsentFile(e.target.files ? e.target.files[0] : null)} accept=".pdf,.doc,.docx" />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs text-gray-500">PDF, DOC up to 10MB</p>
                      {consentFile && <p className="text-sm text-green-600">{consentFile.name}</p>}
                    </div>
                  </div>
                </div>

                <div className="col-span-6">
                  <fieldset className="border border-gray-200 rounded-md p-4">
                    <legend className="text-sm font-medium text-gray-700 px-2">Minimum Education Requirements (Percentage)</legend>
                    <div className="grid grid-cols-2 gap-4 mt-2">
                      <div>
                        <label className="text-xs text-gray-500">10th %</label>
                        <input type="number" step="0.1" name="educationRequirements.tenthPercent" value={formData.educationRequirements.tenthPercent} onChange={handleChange} className="block w-full border-gray-300 rounded-md border p-1 text-sm" />
                      </div>
                      <div>
                        <label className="text-xs text-gray-500">12th %</label>
                        <input type="number" step="0.1" name="educationRequirements.twelfthPercent" value={formData.educationRequirements.twelfthPercent} onChange={handleChange} className="block w-full border-gray-300 rounded-md border p-1 text-sm" />
                      </div>
                      <div>
                        <label className="text-xs text-gray-500">Bachelors %</label>
                        <input type="number" step="0.1" name="educationRequirements.bachelorsPercent" value={formData.educationRequirements.bachelorsPercent} onChange={handleChange} className="block w-full border-gray-300 rounded-md border p-1 text-sm" />
                      </div>
                      <div>
                        <label className="text-xs text-gray-500">Master's % (if applicable)</label>
                        <input type="number" step="0.1" name="educationRequirements.mastersPercent" value={formData.educationRequirements.mastersPercent} onChange={handleChange} className="block w-full border-gray-300 rounded-md border p-1 text-sm" />
                      </div>
                      <div className="col-span-2">
                        <label className="text-xs text-gray-500">Max Allowed Active Backlogs</label>
                        <select name="educationRequirements.maxBacklogs" value={formData.educationRequirements.maxBacklogs} onChange={handleChange} className="block w-full border-gray-300 rounded-md border p-1 text-sm">
                          <option value="0">0</option>
                          <option value="1">1</option>
                          <option value="2">2</option>
                          <option value="3">3</option>
                          <option value="4">4</option>
                          <option value="5">5+</option>
                        </select>
                      </div>
                    </div>
                  </fieldset>
                </div>
              </div>

              <div className="mt-5 flex justify-end">
                <button type="button" onClick={() => navigate(user?.roles.includes('company') ? '/company/dashboard' : '/dashboard')} className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none">
                  Cancel
                </button>
                <button type="submit" disabled={loading} className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none disabled:opacity-50">
                  {loading ? 'Saving...' : (isEditMode ? 'Update Job' : 'Post Job')}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
