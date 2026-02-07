import { Company } from "../models/company.model.js";

export const registerCompany = async (req, res) => {
    try {
        const { companyName, email } = req.body;
        if (!companyName || !email) {
            return res.status(400).json({ message: "Company name and email are required", success: false });
        }

        let company = await Company.findOne({ email });
        if (company) {
            return res.status(400).json({ message: "Company already registered with this email", success: false });
        }

        company = await Company.create({
            name: companyName,
            email
        });

        return res.status(201).json({
            message: "Company registered successfully.",
            success: true,
            company
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Server error", success: false });
    }
}

export const getCompanyById = async (req, res) => {
    try {
        const companyId = req.params.id;
        const company = await Company.findById(companyId);
        if (!company) {
            return res.status(404).json({ message: "Company not found", success: false });
        }
        return res.status(200).json({
            company,
            success: true
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Server error", success: false });
    }
}


export const getCompanies = async (req, res) => {
    try {
        const companies = await Company.find({});
        return res.status(200).json({
            companies,
            success: true
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Server error", success: false });
    }
}
