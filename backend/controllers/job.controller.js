import Job from '../models/job.model.js';
//admin post karega job
// export const postJob = async (req, res) => {
//   // Logic to post a job here

//   try{const{title,description,educationRequirements,location,salary,position,companyId}=req.body;
//     const userId=req.user;
//     if(!title || !description || !educationRequirements || !location || !salary || !position||!companyId){
//         return res.status(400).json({message:'All fields are required',success:false});
//     }
//     const job= await Job.create({
//         title,
//         description,
//         educationRequirements,
//         location,
//         salary:Number(salary),
//         role:position,
//         company:companyId,
//         createdBy:userId
// })
//     return res.status(201).json({message:'Job posted successfully',success:true,job})
// }catch(error){
//     console.log({message:error.message})
// }
// }
export const postJob = async (req, res) => {
  try {
    const {
      title,
      description,
      educationRequirements,
      location,
      salary,
      position,
      positionsAvailable,
      applicationDeadline,
      jobType,
      workMode
    } = req.body;

    const userId = req.user;

    // Check if user is linked to a company or is admin
    const user = await import('../models/user.model.js').then(m => m.User.findById(userId).populate('company'));

    let companyId = null;

    if (user.roles.includes('admin')) {
      companyId = req.body.companyId;
      if (!companyId) {
        return res.status(400).json({ message: "Admin must select a company to post a job.", success: false });
      }
    } else if (user.roles.includes('company')) {
      if (!user.company) {
        return res.status(403).json({ message: "Company profile not found.", success: false });
      }
      companyId = user.company._id;
    } else {
      return res.status(403).json({ message: "Unauthorized to post jobs.", success: false });
    }

    if (
      !title || !description || !educationRequirements ||
      !location || !salary || !position ||
      !positionsAvailable || !applicationDeadline ||
      !jobType || !workMode
    ) {
      return res.status(400).json({ message: "All fields are required", success: false });
    }

    const job = await Job.create({
      title,
      description,
      educationRequirements,
      location,
      salary: Number(salary),
      role: position,
      company: companyId,
      positionsAvailable,
      applicationDeadline,
      jobType,
      workMode,
      createdBy: userId
    });

    return res.status(201).json({
      message: "Job posted successfully",
      success: true,
      job
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message, success: false });
  }
};

//student
export const getAllJobs = async (req, res) => {
  // Logic to get all jobs here
  try {
    const keyword = req.query.keyword || "";
    const query = {
      $or: [
        { title: { $regex: keyword, $options: "i" } },
        { description: { $regex: keyword, $options: "i" } },
        { location: { $regex: keyword, $options: "i" } },
      ]
    }
    const jobs = await Job.find(query).populate({ path: 'company' }).sort({ createdAt: -1 });
    if (!jobs) {
      return res.status(404).json({ message: 'No jobs found', success: false });
    }
    return res.status(200).json({ message: 'Jobs fetched successfully', success: true, jobs });
  } catch (error) {
    console.log({ message: error.message })
  }
}
//student
export const getJobById = async (req, res) => {
  // Logic to get a job by ID here
  try {
    const jobId = req.params.id;
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: 'Job not found', success: false });
    }
    return res.status(200).json({ message: 'Job fetched successfully', success: true, job });
  } catch (error) {
    console.log({ message: error.message })
  }
}
//admin kitne jobs post kiye (Overview for all jobs)
export const getAdminJobs = async (req, res) => {
  // Logic to get all jobs for admin dashboard
  try {
    // Admin should see ALL jobs
    const jobs = await Job.find({}).populate('company').sort({ createdAt: -1 });
    if (!jobs) {
      return res.status(404).json({ message: 'No jobs found', success: false });
    }
    return res.status(200).json({ message: 'Jobs fetched successfully', success: true, jobs });
  } catch (error) {
    console.log({ message: error.message })
  }
}

export const getCompanyJobs = async (req, res) => {
  try {
    const userId = req.user;
    const user = await import('../models/user.model.js').then(m => m.User.findById(userId).populate('company'));

    if (!user || !user.company) {
      return res.status(404).json({ message: "Company not found for this user", success: false });
    }

    const jobs = await Job.find({ company: user.company._id }).sort({ createdAt: -1 });
    return res.status(200).json({ message: "Jobs fetched successfully", success: true, jobs });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server error", success: false });
  }
}

export const getJobApplicants = async (req, res) => {
  try {
    const jobId = req.params.id;
    const Application = (await import('../models/application.model.js')).Application;

    // Ensure the job belongs to the logged-in company? 
    // For now just fetch applicants.

    const applications = await Application.find({ job: jobId }).populate('applicant');

    return res.status(200).json({
      message: "Applicants fetched successfully",
      success: true,
      applications
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server error", success: false });
  }
}

export const updateJob = async (req, res) => {
  try {
    const jobId = req.params.id;
    // User check logic if needed, but isAuthenticated does basic auth. 
    // For finer adaptation, check if user.company matches job.company if strictly restricted, but requirements say "give admin and company capability"

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: "Job not found", success: false });
    }

    // Update job fields
    const updatedJob = await Job.findByIdAndUpdate(jobId, req.body, { new: true });

    // Reset applications: Delete all applications for this job
    const Application = (await import('../models/application.model.js')).Application;
    await Application.deleteMany({ job: jobId });

    // Also clear the applications array in the job document
    job.applications = [];
    await job.save();

    return res.status(200).json({ message: "Job updated and applications reset successfully", success: true, job: updatedJob });

  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server error", success: false });
  }
}

export const deleteJob = async (req, res) => {
  try {
    const jobId = req.params.id;

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: "Job not found", success: false });
    }

    await Job.findByIdAndDelete(jobId);

    // Delete all associated applications
    const Application = (await import('../models/application.model.js')).Application;
    await Application.deleteMany({ job: jobId });

    return res.status(200).json({ message: "Job and associated applications deleted successfully", success: true });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server error", success: false });
  }
}