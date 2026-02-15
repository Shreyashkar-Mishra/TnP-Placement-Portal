import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: {
    type: String,
    required: true,
    unique: true,
    match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  },
  phoneNumber: { type: String, required: true },
  password: { type: String, required: true },
  roles: {
    type: [String],
    enum: ['student', 'admin', 'company'],
    default: ['student']
  },
  college: {
    type: String,
    enum: ['PCCOE', 'PCU'],
  },
  company: { type: mongoose.Schema.Types.ObjectId, ref: 'Company' },
  // profile: {
  profile: {
    bio: { type: String },
    skills: [{ type: String }],
    resume: { type: String }, // URL to resume file
    resumeOriginalName: { type: String },
    profilePhoto: {
      type: String,
      default: ""
    },
    prn: { type: String },
    education: {
      tenthPercent: { type: Number },
      twelfthPercent: { type: Number },
      bachelorsPercent: { type: Number },
      mastersPercent: { type: Number },
      mastersCGPA: { type: Number },
      activeBacklogs: { type: Number, default: 0 },
      passingYear: { type: Number },
      branch: { type: String }
    }
  },
  isApproved: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

export const User = mongoose.model('User', userSchema);
export default User;