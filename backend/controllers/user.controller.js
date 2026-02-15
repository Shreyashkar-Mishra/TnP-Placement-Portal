import { Company } from '../models/company.model.js';
import { User } from '../models/user.model.js';
import { OTP } from '../models/otp.model.js';
import { sendOtpEmail } from '../utils/email.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';

// Generate numeric OTP
const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString();

export const sendOtp = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email is required", success: false });

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "User already exists", success: false });

    const otp = generateOtp();

    // Remove existing OTP for this email
    await OTP.deleteMany({ email });

    // Save new OTP
    await OTP.create({ email, otp });

    // Log OTP for debugging/offline usage
    console.log(`[DEV ONLY] OTP for ${email}: ${otp}`);

    // Send Email
    const sent = await sendOtpEmail(email, otp);
    if (!sent.success) {
      console.error("Failed to send OTP email:", sent.error);
      // Allow proceeding even if email fails (for dev/wifi issues), user can check terminal
      return res.status(200).json({ message: "OTP generated. Check server logs if email not received.", success: true });
    }

    return res.status(200).json({ message: "OTP sent successfully", success: true });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server error", success: false });
  }
};

export const register = async (req, res) => {
  try {
    const { name, email, phoneNumber, password, role, otp, college } = req.body;

    if (!name || !email || !phoneNumber || !password || !role || !otp) {
      return res.status(400).json({ message: 'All required fields including OTP must be filled', success: false });
    }
    if (role === 'student' && !college) {
      return res.status(400).json({ message: 'College is required for students', success: false });
    }

    // Verify OTP
    const otpRecord = await OTP.findOne({ email, otp });
    if (!otpRecord) {
      return res.status(400).json({ message: "Invalid or expired OTP", success: false });
    }

    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'User already exists', success: false });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Admins are NOT approved by default
    const isApproved = role === 'admin' ? false : true;

    let companyId = null;
    if (role === 'company') {
      let company = await Company.findOne({
        $or: [{ email: email }, { name: name }]
      });
      if (!company) {
        company = await Company.create({
          name: name,
          email: email,
        });
      }
      companyId = company._id;
    }

    const newUser = await User.create({
      name,
      email,
      phoneNumber,
      password: hashedPassword,
      roles: [role],
      college: role === 'student' ? college : undefined,
      company: companyId,
      isApproved
    });

    if (role === 'company' && companyId) {
      await Company.findByIdAndUpdate(companyId, { userId: newUser._id });
    }

    // Clear OTP after successful registration
    await OTP.deleteMany({ email });

    return res.status(201).json({
      message: role === 'admin' ? 'Registration successful. Please wait for admin approval.' : 'User registered successfully',
      success: true,
      approved: isApproved
    });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
}

export const login = async (req, res) => {
  try {
    const { email, password, role } = req.body;
    if (!email || !password || !role) {
      return res.status(400).json({ message: 'All required fields must be filled', success: false });
    }
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password', success: false });
    }

    // Check approval status
    if (user.isApproved === false) {
      return res.status(403).json({ message: 'Your account is pending approval by an administrator.', success: false });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Invalid email or password', success: false });
    }
    if (role != user.roles[0]) {
      return res.status(400).json({ message: 'Role mismatch', success: false });
    }
    const tokenData = {
      id: user._id,
    };
    const token = await jwt.sign(tokenData, process.env.JWT_SECRET, { expiresIn: '1d' });

    user = {
      id: user._id,
      name: user.name,
      email: user.email,
      phoneNumber: user.phoneNumber,
      roles: user.roles,
      college: user.college
    }
    return res.status(200).cookie('token', token, { maxAge: 1 * 24 * 60 * 60 * 1000, httpOnly: true, sameSite: 'strict' }).json({ message: 'Login succesful', success: true, user: user });

  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
  }
};

export const logout = async (req, res) => {
  // Logout logic here
  try {
    return res.status(200).cookie('token', '', { maxAge: 0 }).json({ message: 'Logout successful', success: true });
  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
  }
}
export const updateProfile = async (req, res) => {
  try {
    // Resume upload removed as per new requirements
    let { name, phoneNumber, email, profile } = req.body;

    if (typeof profile === 'string') {
      try {
        profile = JSON.parse(profile);
      } catch (e) {
        console.error("Error parsing profile JSON", e);
        return res.status(400).json({ message: 'Invalid profile data format', success: false });
      }
    }

    const userId = req.user;
    let user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found', success: false });
    }

    // Role-specific validation for students
    if (user.roles.includes('student')) {
      const edu = profile?.education || {};

      // Mandatory fields check
      if (!edu.branch || !edu.tenthPercent || !edu.twelfthPercent || !edu.bachelorsPercent) {
        return res.status(400).json({ message: 'Branch, 10th%, 12th%, and Bachelors% are mandatory.', success: false });
      }

      // Master's validation: Either Percent OR CGPA required
      // Note: Logic assumes if they reached Master's section they must fill it. 
      // If Master's is optional generally but mandatory if filling, that's different. 
      // User request: "make the fields of Branch,10th %,12th %,Bachelor's % and Master's % mandatory" 
      // This implies every student MUST have a Master's degree?? 
      // "allow students to give CGPA as well in MCA , if Master's percentage not known"
      // This suggests it's mandatory. I will enforce it.

      // Master's validation: Either Percent OR CGPA required
      if (!edu.mastersPercent && !edu.mastersCGPA) {
        return res.status(400).json({ message: "Master's Percentage or CGPA is required.", success: false });
      }

      // CGPA to Percentage Conversion (if CGPA provided and Percent not)
      // OR always overwrite percent if CGPA is provided? User said "whatever cgpa student enters multiply it by 9.5 and store it"
      // Let's ensure if mastersCGPA is present, we calculate mastersPercent = mastersCGPA * 9.5
      if (edu.mastersCGPA) {
        edu.mastersPercent = edu.mastersCGPA * 9.5;
      }
    }

    if (name) user.name = name;
    if (email) user.email = email;
    if (phoneNumber) user.phoneNumber = phoneNumber;
    if (profile) {
      user.profile = {
        ...user.profile,
        ...profile,
        education: {
          ...user.profile?.education,
          ...profile.education,
          // Explicitly save activeBacklogs if provided at top level of profile or inside education?
          // Schema has activeBacklogs inside profile.education
          activeBacklogs: profile.education?.activeBacklogs !== undefined ? profile.education.activeBacklogs : user.profile?.education?.activeBacklogs
        }
      };

      // Explicitly remove resume fields if they exist to clean up
      if (user.profile.resume) user.profile.resume = undefined;
      if (user.profile.resumeOriginalName) user.profile.resumeOriginalName = undefined;
    }

    await user.save();

    // Return updated user without resume info
    const updatedUser = {
      id: user._id,
      name: user.name,
      email: user.email,
      phoneNumber: user.phoneNumber,
      roles: user.roles,
      college: user.college,
      profile: user.profile
    }
    return res.status(200).json({ message: 'Profile updated successfully', success: true, user: updatedUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message, success: false });
  }

}

export const getPendingAdmins = async (req, res) => {
  try {
    const admins = await User.find({ roles: 'admin', isApproved: false }).select('-password');
    return res.status(200).json({ admins, success: true });
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false });
  }
};

export const approveAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByIdAndUpdate(id, { isApproved: true }, { new: true });
    if (!user) return res.status(404).json({ message: "User not found", success: false });

    return res.status(200).json({ message: "Admin approved successfully", success: true });
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false });
  }
};

export const getStudentCount = async (req, res) => {
  try {
    const count = await User.countDocuments({ roles: 'student' });
    return res.status(200).json({ count, success: true });
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false });
  }
};

export const getUserProfile = async (req, res) => {
  try {
    const userId = req.user;
    const user = await User.findById(userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found', success: false });
    }
    // ensure profile exists in response even if empty
    const userObj = user.toObject();
    if (!userObj.profile) userObj.profile = {};

    return res.status(200).json({ success: true, user: userObj });
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false });
  }
};

export const getAllStudents = async (req, res) => {
  try {
    const students = await User.find({ roles: 'student' }).select('-password');
    return res.status(200).json({ success: true, students });
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false });
  }
};

export const updateUserRole = async (req, res) => {
  try {
    const { userId, role } = req.body;
    if (!userId || !role) {
      return res.status(400).json({ message: "UserId and Role are required", success: false });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found", success: false });
    }

    if (!user.roles.includes(role)) {
      user.roles.push(role);
      await user.save();
    }

    return res.status(200).json({ message: "User role updated successfully", success: true });
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false });
  }
};
