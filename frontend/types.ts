
export enum UserRole {
  Student = 'student',
  Admin = 'admin',
  Company = 'company'
}

export interface User {
  _id: string; // Mongoose default ID
  name: string;
  email: string;
  phoneNumber: string;
  roles: string[];
  // Profile fields are optional based on backend logic
  // Profile fields are optional based on backend logic
  profile?: {
    bio?: string;
    skills?: string[];
    resume?: string;
    resumeOriginalName?: string;
    profilePhoto?: string;
    prn?: string;
    education?: {
      tenthPercent?: number;
      twelfthPercent?: number;
      bachelorsPercent?: number;
      mastersPercent?: number;
      passingYear?: number;
      branch?: string;
    };
  };
}

export interface Company {
  _id: string;
  name: string;
  email: string;
  description?: string;
  website?: string;
  userId?: string; // Reference to creator
}

export interface EducationRequirements {
  tenthCGPA?: number;
  twelfthCGPA?: number;
  bachelorsCGPA?: number;
  mastersCGPA?: number;
}

export interface Job {
  _id: string;
  title: string;
  description: string;
  // Backend populates company, so it can be an object OR a string ID if population fails
  company: Company | string;
  location: string;
  salary: number;
  role: string; // Mapped from 'position' in frontend to 'role' in backend model
  positionsAvailable: number;
  applicationDeadline: string;
  educationRequirements: EducationRequirements;
  createdBy: string | User;
  createdAt: string;
}

export interface Application {
  _id: string;
  job: Job;
  applicant: User;
  status: 'applied' | 'under review' | 'accepted' | 'rejected';
  createdAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  // Specific keys based on backend responses
  user?: User;
  company?: Company;
  companies?: Company[];
  job?: Job;
  jobs?: Job[];
  application?: Application;
  applications?: Application[];
  applicants?: Application[];
}
