import express from 'express';
import isAuthenticated from '../middlewares/isAuthenticated.js';
import { applyJob, getAppliedJobs, getApplicants, updateApplicationStatus, getPlacementCount, downloadApplicantsExcel } from '../controllers/application.controller.js';


const router = express.Router();

router.route("/apply/:id").get(isAuthenticated, applyJob);
router.route("/applied").get(isAuthenticated, getAppliedJobs);
router.route("/applicants/:id").get(isAuthenticated, getApplicants);
router.route("/status/:id/update").post(isAuthenticated, updateApplicationStatus);

router.route("/getPlacementCount").get(isAuthenticated, getPlacementCount);
router.route("/download-excel/:jobId").get(isAuthenticated, downloadApplicantsExcel);

export default router;


