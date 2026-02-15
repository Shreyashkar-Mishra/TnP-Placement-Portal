import express from 'express';
import { login, logout, register, updateProfile, sendOtp, getPendingAdmins, approveAdmin, getStudentCount, getUserProfile, getAllStudents, updateUserRole } from "../controllers/user.controller.js";
import isAuthenticated from '../middlewares/isAuthenticated.js';
import { singleUpload } from '../middlewares/multer.js';

const router = express.Router();


router.route("/register").post(register);
router.route("/login").post(login);
router.route("/logout").get(logout);
router.route("/profile/update").put(isAuthenticated, singleUpload, updateProfile);
router.route("/me").get(isAuthenticated, getUserProfile);

router.route("/send-otp").post(sendOtp);
router.route("/admin/pending").get(isAuthenticated, getPendingAdmins);
router.route("/admin/approve/:id").post(isAuthenticated, approveAdmin);
router.route("/admin/studentCount").get(isAuthenticated, getStudentCount);
router.route("/admin/students").get(isAuthenticated, getAllStudents);
router.route("/admin/update-role").post(isAuthenticated, updateUserRole);

export default router;