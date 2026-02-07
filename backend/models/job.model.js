// import mongoose from 'mongoose';

// const jobSchema = new mongoose.Schema({
//   title: { type: String, required: true },
//   description: { type: String, required: true },
//   company: { type: String, required: true },
//   location: { type: String, required: true },
//   salary: { type: Number, required: true },
//   postedDate: { type: Date, default: Date.now },
//   role: { type: String, required: true },
//   positionsAvailable: { type: Number, required: true },
//   applicationDeadline: { type: Date, required: true },
//   educationRequirements: {
//     tenthCGPA: { type: Number },
//     twelfthCGPA: { type: Number },
//     bachelorsCGPA: { type: Number },
//     mastersCGPA: { type: Number }
//   },
//   company:{
//     type: mongoose.Schema.Types.ObjectId, ref: 'Company',
//     required: true
//   },
//   createdBy: {
//     type: mongoose.Schema.Types.ObjectId, ref: 'User',
//     required: true
//   },
//   applications: [{
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Application'
//   }]
// }, { timestamps: true });

// const Job = mongoose.model('Job', jobSchema);
// export default Job;
import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },

  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true
  },

  location: { type: String, required: true },
  salary: { type: Number, required: true },
  postedDate: { type: Date, default: Date.now },
  role: { type: String, required: true },

  positionsAvailable: { type: Number, required: true },
  applicationDeadline: { type: Date, required: true },

  educationRequirements: {
    tenthPercent: Number,
    twelfthPercent: Number,
    bachelorsPercent: Number,
    mastersPercent: Number
  },

  jobType: {
    type: String,
    enum: ['Full-time', 'Part-time', 'Contract', 'Internship'],
    required: true
  },

  workMode: {
    type: String,
    enum: ['On-site', 'Remote', 'Hybrid'],
    required: true
  },

  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  applications: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Application'
  }]
}, { timestamps: true });

export default mongoose.model("Job", jobSchema);
