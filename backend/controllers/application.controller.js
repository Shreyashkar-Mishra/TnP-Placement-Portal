import Application from '../models/application.model.js';
import Job from '../models/job.model.js';
export const applyJob = async (req, res) => {
  // Logic to apply for a job here
  try {
    const jobId = req.params.id;
    const userId = req.user;

    // File handling
    let resumeUrl = "";
    let consentFormUrl = "";

    if (req.files) {
      if (req.files.resume && req.files.resume[0]) {
        resumeUrl = req.files.resume[0].path;
      }
      if (req.files.consentForm && req.files.consentForm[0]) {
        consentFormUrl = req.files.consentForm[0].path;
      }
    }

    if (!jobId) {
      return res.status(400).json({ message: 'Job ID is required', success: false });
    }
    //check if user has already applied
    const existingApplication = await Application.findOne({ job: jobId, applicant: userId });
    if (existingApplication) {
      return res.status(400).json({ message: 'You have already applied for this job', success: false });
    }

    //check if job exists
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: 'Job not found', success: false });
    }

    // Check Eligibility
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found', success: false });
    }

    const { education } = user.profile || {};
    const { educationRequirements } = job;

    if (educationRequirements) {
      if (educationRequirements.tenthPercent && (!education?.tenthPercent || education.tenthPercent < educationRequirements.tenthPercent)) {
        return res.status(400).json({ message: `Eligibility failed: Minimum 10th percentage required is ${educationRequirements.tenthPercent}%`, success: false });
      }
      if (educationRequirements.twelfthPercent && (!education?.twelfthPercent || education.twelfthPercent < educationRequirements.twelfthPercent)) {
        return res.status(400).json({ message: `Eligibility failed: Minimum 12th percentage required is ${educationRequirements.twelfthPercent}%`, success: false });
      }
      if (educationRequirements.bachelorsPercent && (!education?.bachelorsPercent || education.bachelorsPercent < educationRequirements.bachelorsPercent)) {
        return res.status(400).json({ message: `Eligibility failed: Minimum Bachelor's percentage required is ${educationRequirements.bachelorsPercent}%`, success: false });
      }
      if (educationRequirements.mastersPercent && (!education?.mastersPercent || education.mastersPercent < educationRequirements.mastersPercent)) {
        return res.status(400).json({ message: `Eligibility failed: Minimum Master's percentage required is ${educationRequirements.mastersPercent}%`, success: false });
      }
    }

    //create application
    const application = await Application.create({
      job: jobId,
      applicant: userId,
      resumeUrl,
      consentFormUrl
    });

    job.applications.push(application._id);
    await job.save();
    return res.status(201).json({ message: 'Applied for job successfully', success: true, application });

  } catch (error) { console.log({ message: error.message }) }
};

export const getAppliedJobs = async (req, res) => {
  // Logic to get applied jobs here
  try {
    const userId = req.user;
    const applications = await Application.find({ applicant: userId }).populate({ path: 'job', populate: { path: 'company' } }).sort({ createdAt: -1 });
    if (!applications) {
      return res.status(404).json({ message: 'No applications found', success: false });
    }
    return res.status(200).json({ message: 'Applications fetched successfully', success: true, applications });
  } catch (error) { console.log({ message: error.message }) }
};

import User from '../models/user.model.js'; // Ensure User is imported

export const getApplicants = async (req, res) => {
  // Logic to get applicants for a job here
  try {
    const jobId = req.params.id;
    const userId = req.user;

    // Fetch the calling user to check role
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found', success: false });
    }

    const job = await Job.findById(jobId).populate({ path: 'applications', populate: { path: 'applicant' } });
    if (!job) {
      return res.status(404).json({ message: 'Job not found', success: false });
    }

    let applications = job.applications;

    // If company, show only accepted applications
    if (user.role === 'company') {
      applications = applications.filter(app => app.status === 'accepted');
    }

    return res.status(200).json({ message: 'Applicants fetched successfully', success: true, applicants: applications });

  } catch (error) { console.log({ message: error.message }) }
}

export const updateApplicationStatus = async (req, res) => {
  // Logic to update application status here
  try {
    const applicationId = req.params.id;
    const { status } = req.body;
    if (!status) {
      return res.status(400).json({ message: 'Status is required', success: false });
    }
    //find application by id
    const application = await Application.findOne({ _id: applicationId });
    if (!application) {
      return res.status(404).json({ message: 'Application not found', success: false });
    }
    //update status
    application.status = status.toLowerCase();
    await application.save();
    return res.status(200).json({ message: 'Application status updated successfully', success: true, application });
  } catch (error) { console.log({ message: error.message }) }
}

export const getPlacementCount = async (req, res) => {
  try {
    const count = await Application.countDocuments({ status: 'selected' });
    return res.status(200).json({ count, success: true });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server error", success: false });
  }
}

import ExcelJS from 'exceljs';

export const downloadApplicantsExcel = async (req, res) => {
  try {
    const jobId = req.params.jobId;
    const userId = req.user;
    const job = await Job.findById(jobId).populate('company');
    if (!job) return res.status(404).json({ message: "Job not found", success: false });

    // Check if requester is admin (to show consent form)
    const requester = await User.findById(userId);
    const isAdmin = requester.role === 'admin';

    const applications = await Application.find({ job: jobId }).populate({
      path: 'applicant',
      select: 'name email phoneNumber profile'
    });

    //Sort by PRN
    applications.sort((a, b) => {
      const prnA = a.applicant.profile?.prn || '';
      const prnB = b.applicant.profile?.prn || '';
      return prnA.localeCompare(prnB);
    });

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Applicants');

    // Company Name Row
    let companyName = 'Unknown Company';
    if (job.company && typeof job.company === 'object') {
      companyName = job.company.name;
    }

    worksheet.addRow([`Applicants for ${job.title} at ${companyName}`]);
    worksheet.mergeCells('A1:L1'); // Expanded merge for more columns
    worksheet.getRow(1).font = { bold: true, size: 16 };
    worksheet.getRow(1).alignment = { horizontal: 'center' };

    // Headers
    const headers = ['PRN', 'Name', 'Email', 'Phone', 'Status', 'Branch', '10th %', '12th %', 'Bachelor %', 'Master %', 'Resume Link'];
    if (isAdmin) {
      headers.push('Consent Form Link');
    }

    worksheet.addRow(headers);
    const headerRow = worksheet.getRow(2);
    headerRow.font = { bold: true };
    headerRow.eachCell((cell) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFE0E0E0' }
      };
      cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
    });

    // Data
    applications.forEach(app => {
      const student = app.applicant;
      const profile = student.profile || {};
      const education = profile.education || {};

      const resumeLink = app.resumeUrl ? { text: 'View Resume', hyperlink: `http://localhost:8000/${app.resumeUrl}` } : 'N/A';
      const consentLink = app.consentFormUrl ? { text: 'View Consent', hyperlink: `http://localhost:8000/${app.consentFormUrl}` } : 'N/A';

      const rowData = [
        profile.prn || 'N/A',
        student.name,
        student.email,
        student.phoneNumber,
        app.status.toUpperCase(),
        education.branch || 'N/A',
        education.tenthPercent || 'N/A',
        education.twelfthPercent || 'N/A',
        education.bachelorsPercent || 'N/A',
        education.mastersPercent || 'N/A',
        resumeLink
      ];

      if (isAdmin) {
        rowData.push(consentLink);
      }

      worksheet.addRow(rowData);
    });

    // adjust column widths
    const colWidths = [
      { width: 15 }, { width: 25 }, { width: 30 }, { width: 15 }, { width: 15 }, { width: 20 },
      { width: 10 }, { width: 10 }, { width: 15 }, { width: 15 }, { width: 15 }
    ];
    if (isAdmin) {
      colWidths.push({ width: 15 });
    }
    worksheet.columns = colWidths;

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename=applicants-${jobId}.xlsx`);

    await workbook.xlsx.write(res);
    res.end();

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error", success: false });
  }
}

export const downloadAttendanceSheet = async (req, res) => {
  try {
    const jobId = req.params.jobId;
    const job = await Job.findById(jobId).populate('company');
    if (!job) return res.status(404).json({ message: "Job not found", success: false });

    // Check if requester is admin - STRICTLY ADMIN ONLY
    const userId = req.user;
    const requester = await User.findById(userId);
    if (requester.role !== 'admin') {
      return res.status(403).json({ message: "Access denied. Admins only.", success: false });
    }

    const applications = await Application.find({ job: jobId }).populate({
      path: 'applicant',
      select: 'name profile'
    });

    //Sort by PRN
    applications.sort((a, b) => {
      const prnA = a.applicant.profile?.prn || '';
      const prnB = b.applicant.profile?.prn || '';
      return prnA.localeCompare(prnB);
    });

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Attendance');

    // Company Name Row
    let companyName = 'Unknown Company';
    if (job.company && typeof job.company === 'object') {
      companyName = job.company.name;
    }

    worksheet.addRow([`${companyName} - Attendance Sheet`]);
    worksheet.mergeCells('A1:C1');
    worksheet.getRow(1).font = { bold: true, size: 18 };
    worksheet.getRow(1).alignment = { horizontal: 'center', vertical: 'middle' };
    worksheet.getRow(1).height = 40;

    // Headers
    worksheet.addRow(['PRN', 'Candidate Name', 'Signature']);
    const headerRow = worksheet.getRow(2);
    headerRow.font = { bold: true, size: 12 };
    headerRow.alignment = { horizontal: 'center', vertical: 'middle' };
    headerRow.height = 25;
    headerRow.eachCell((cell) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFDDDDDD' }
      };
      cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'medium' }, right: { style: 'thin' } };
    });

    // Data
    applications.forEach((app, index) => {
      const student = app.applicant;
      const profile = student.profile || {};

      const row = worksheet.addRow([
        profile.prn || 'N/A',
        student.name,
        '' // Empty signature column
      ]);

      // Style the data rows
      row.height = 30; // More height for signature
      row.alignment = { vertical: 'middle' };
      row.getCell(1).alignment = { horizontal: 'center', vertical: 'middle' }; // Center PRN

      // Add borders
      row.eachCell((cell) => {
        cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
      });
    });

    // Column widths
    worksheet.getColumn(1).width = 20; // PRN
    worksheet.getColumn(2).width = 40; // Name
    worksheet.getColumn(3).width = 30; // Signature

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename=attendance-${jobId}.xlsx`);

    await workbook.xlsx.write(res);
    res.end();

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error", success: false });
  }
}