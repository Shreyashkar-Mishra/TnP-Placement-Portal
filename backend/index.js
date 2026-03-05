import express from 'express';
import path from "path";
import { fileURLToPath } from "url";
import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './utils/db.js';
import userRoutes from './routes/user.route.js';
import companyRoutes from './routes/company.routes.js';
import jobRoutes from './routes/job.route.js';
import applicationRoutes from './routes/application.route.js';
dotenv.config({});
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Global Request Logger
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

//middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use('/uploads', express.static('uploads'));
const corsOptions = {
  origin: function (origin, callback) {
    // Dynamically allow the request origin to prevent trailing slash or sub-domain CORS issues
    callback(null, origin || true);
  },
  credentials: true,
};
app.use(cors(corsOptions));
const PORT = process.env.PORT || 8000;

//api routes
app.use('/api/v1/user', userRoutes);
app.use('/api/v1/company', companyRoutes);
app.use('/api/v1/job', jobRoutes);

app.use('/api/v1/application', applicationRoutes);

app.get('/', (req, res) => {
  res.send("API is running...");
});


app.listen(PORT, () => {
  connectDB();
  console.log(`Server is running on http://localhost:${PORT}`);
})