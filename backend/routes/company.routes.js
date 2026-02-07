import express from 'express';
import isAuthenticated from '../middlewares/isAuthenticated.js';
import { registerCompany, getCompanyById, getCompanies } from '../controllers/company.controller.js';

const router = express.Router();

console.log("Company routes loaded");
router.route("/register").post(isAuthenticated, registerCompany);
router.route("/get/:id").get(isAuthenticated, getCompanyById);
router.route("/get").get(isAuthenticated, getCompanies);

export default router;