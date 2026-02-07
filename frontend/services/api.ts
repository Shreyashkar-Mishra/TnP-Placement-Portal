
import { UserRole } from '../types';

const BASE_URL = 'http://localhost:8000/api/v1';

// Helper to handle fetch with credentials (cookies)
const fetchWithAuth = async (endpoint: string, options: RequestInit = {}) => {
  const defaultHeaders = {
    'Content-Type': 'application/json',
  };

  // If body is FormData, let browser set Content-Type (don't override)
  if (options.body instanceof FormData) {
    delete defaultHeaders['Content-Type'];
  }

  const config = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
    credentials: 'include' as RequestCredentials, // Essential for the httpOnly token cookie
  };

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, config);

    // Handle non-JSON responses (like 404 HTML pages or 500 errors)
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.indexOf("application/json") !== -1) {
      const data = await response.json();
      return data;
    } else {
      // If backend sends text/html error or empty body
      const text = await response.text();
      return { success: false, message: text || `Server Error: ${response.status}` };
    }

  } catch (error) {
    console.error('API Error:', error);
    return { success: false, message: 'Network error. Ensure backend is running on port 8000 and CORS is configured.' };
  }
};

export const AuthService = {
  // Backend: router.route("/login").post(login);
  login: async (email: string, password: string, role: string) => {
    return fetchWithAuth('/user/login', {
      method: 'POST',
      body: JSON.stringify({ email, password, role }),
    });
  },

  getProfile: async () => {
    return fetchWithAuth('/user/me');
  },

  // Backend: router.route("/register").post(register);
  register: async (data: any) => {
    return fetchWithAuth('/user/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  sendOtp: async (email: string) => {
    return fetchWithAuth('/user/send-otp', {
      method: 'POST',
      body: JSON.stringify({ email })
    });
  },

  getPendingAdmins: async () => {
    return fetchWithAuth('/user/admin/pending');
  },

  approveAdmin: async (id: string) => {
    return fetchWithAuth(`/user/admin/approve/${id}`, {
      method: 'POST'
    });
  },

  getStudentCount: async () => {
    return fetchWithAuth('/user/admin/studentCount');
  },

  // Backend: router.route("/logout").get(logout);
  logout: async () => {
    return fetchWithAuth('/user/logout');
  },

  // Backend: router.route("/profile/update").put(isAuthenticated, updateProfile);
  updateProfile: async (formData: FormData) => {
    return fetchWithAuth('/user/profile/update', {
      method: 'PUT',
      body: formData,
    });
  },

  forgotPassword: async (email: string) => {
    // Placeholder as backend logic wasn't provided for this specific route
    return new Promise<{ success: boolean; message: string }>((resolve) => {
      setTimeout(() => {
        resolve({ success: true, message: 'If an account exists, a reset link has been sent.' });
      }, 1000);
    });
  }
};

export const JobService = {
  // Backend: router.route("/get").get(isAuthenticated, getAllJobs);
  getAllJobs: async (keyword: string = '') => {
    return fetchWithAuth(`/job/get?keyword=${keyword}`);
  },

  // Backend: router.route("/get/:id").get(isAuthenticated, getJobById);
  getJobById: async (id: string) => {
    return fetchWithAuth(`/job/get/${id}`);
  },

  // Backend: router.route("/getAdmin").get(isAuthenticated, getAdminJobs);
  getAdminJobs: async () => {
    return fetchWithAuth('/job/getAdmin');
  },

  // Backend: router.route("/register").post(isAuthenticated, postJob);
  postJob: async (jobData: any) => {
    return fetchWithAuth('/job/register', {
      method: 'POST',
      body: JSON.stringify(jobData),
    });
  },

  getCompanyJobs: async () => {
    return fetchWithAuth('/job/getCompany');
  },

  getJobApplicants: async (jobId: string) => {
    return fetchWithAuth(`/job/getApplicants/${jobId}`);
  },

  updateJob: async (id: string, jobData: any) => {
    return fetchWithAuth(`/job/update/${id}`, {
      method: 'PUT',
      body: JSON.stringify(jobData),
    });
  },

  deleteJob: async (id: string) => {
    return fetchWithAuth(`/job/delete/${id}`, {
      method: 'DELETE'
    });
  }
};

export const ApplicationService = {
  // Backend: router.route("/apply/:id").get(isAuthenticated, applyJob);
  applyJob: async (jobId: string) => {
    return fetchWithAuth(`/application/apply/${jobId}`);
  },

  // Backend: router.route("/applied").get(isAuthenticated, getAppliedJobs);
  getAppliedJobs: async () => {
    return fetchWithAuth('/application/applied');
  },

  // Backend: router.route("/applicants/:id").get(isAuthenticated, getApplicants);
  getApplicants: async (jobId: string) => {
    return fetchWithAuth(`/application/applicants/${jobId}`);
  },

  // Backend: router.route("/status/:id/update").post(isAuthenticated, updateApplicationStatus);
  updateStatus: async (applicationId: string, status: string) => {
    return fetchWithAuth(`/application/status/${applicationId}/update`, {
      method: 'POST',
      body: JSON.stringify({ status }),
    });
  },

  getPlacementCount: async () => {
    return fetchWithAuth('/application/getPlacementCount');
  },

  downloadExcel: async (jobId: string) => {
    // We cannot use fetchWithAuth directly because it expects JSON.
    // We need to handle blob response.
    try {
      const response = await fetch(`http://localhost:8000/api/v1/application/download-excel/${jobId}`, {
        headers: {
          // 'Content-Type': 'application/json', // Do NOT set content type for download request
        },
        credentials: 'include'
      });
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `applicants-${jobId}.xlsx`;
        document.body.appendChild(a);
        a.click();
        a.remove();
      } else {
        console.error("Download failed");
      }
    } catch (e) {
      console.error(e);
    }
  }
};

export const CompanyService = {
  // Backend: router.route("/register").post(isAuthenticated, registerCompany);
  register: async (companyData: any) => {
    return fetchWithAuth('/company/register', {
      method: 'POST',
      body: JSON.stringify(companyData),
    });
  },

  // Backend: router.route("/get").get(isAuthenticated, getCompanies);
  getAll: async () => {
    return fetchWithAuth('/company/get');
  }
};
