import mongoose from 'mongoose';
const applicationSchema = new mongoose.Schema({
    job: {
        type: mongoose.Schema.Types.ObjectId, ref: 'Job',
        required: true
    },
    applicant: {
        type: mongoose.Schema.Types.ObjectId, ref: 'User',
        required: true
    },
    resumeUrl: { type: String },
    consentFormUrl: { type: String },
    status: { type: String, enum: ['applied', 'under review', 'accepted', 'rejected', 'selected'], default: 'applied' }
}, { timeseries: true });

export const Application = mongoose.model('Application', applicationSchema);
export default Application;