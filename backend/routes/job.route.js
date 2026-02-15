import express from 'express';
import isAuthenticated from '../middlewares/isAuthenticated.js';
import { upload } from '../middlewares/multer.js';
import { getAllJobs, postJob, getAdminJobs, getJobById, getCompanyJobs, getJobApplicants, updateJob, deleteJob } from '../controllers/job.controller.js';

const router = express.Router();
router.route("/register").post(isAuthenticated, upload.single('consentForm'), postJob);
router.route("/get").get(isAuthenticated, getAllJobs);
router.route("/get/:id").get(isAuthenticated, getJobById);
router.route("/getAdmin").get(isAuthenticated, getAdminJobs);
router.route("/getCompany").get(isAuthenticated, getCompanyJobs);
router.route("/getApplicants/:id").get(isAuthenticated, getJobApplicants);
router.route("/update/:id").put(isAuthenticated, updateJob);
router.route("/delete/:id").delete(isAuthenticated, deleteJob);
export default router;