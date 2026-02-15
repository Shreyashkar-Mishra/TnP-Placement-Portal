# REST API Workflow Explainer: Creating the Job API

This document explains the complete workflow of creating a REST API in this project, using the **Job API** as a concrete example. The process follows the standard **MVC (Model-View-Controller)** pattern used in Express.js applications.

The workflow consists of 4 main steps:
1.  **Model**: Define the data structure (Schema).
2.  **Controller**: Implement the business logic (Functions).
3.  **Routes**: Define the API endpoints (URLs).
4.  **Main Application**: Register the routes in the main server file (`index.js`).

---

## Step 1: Create the Model (Data Structure)

**File:** `backend/models/job.model.js`

The first step is to define what a "Job" looks like in our database. We use **Mongoose** to create a Schema. This ensures that every job saved has a consistent structure (title, description, company, etc.).

```javascript
/* backend/models/job.model.js */
import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    
    // Relationship: Link to the Company model
    company: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company',
        required: true
    },
    
    // Relationship: Link to the User model (who posted the job)
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, { timestamps: true });

export default mongoose.model("Job", jobSchema);
```

**Key Concept:**
*   **Schema**: A blueprint for your data.
*   **Model**: The interface to interact with the database (creating, finding, updating documents).

---

## Step 2: Create the Controller (Logic)

**File:** `backend/controllers/job.controller.js`

Next, we write the logic that runs when a user hits an API endpoint. This is where we validate input, interact with the database using the Model, and send back a response.

**Example: Posting a Job (`postJob`)**

```javascript
/* backend/controllers/job.controller.js */
import Job from '../models/job.model.js';

export const postJob = async (req, res) => {
    try {
        const { title, description, ...otherFields } = req.body;
        const userId = req.user; // Got from authentication middleware (isAuthenticated)

        // 1. Validation
        if (!title || !description) {
            return res.status(400).json({
                message: "All fields are required",
                success: false
            });
        }

        // 2. Database Interaction (Using the Model)
        const job = await Job.create({
            title,
            description,
            // ... other fields
            createdBy: userId
        });

        // 3. Send Response
        return res.status(201).json({
            message: "Job posted successfully",
            success: true,
            job
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Server error",
            success: false
        });
    }
};
```

**Key Concept:**
*   **Request (`req`)**: Contains data sent by the client (body, params, query).
*   **Response (`res`)**: Used to send data back to the client.

---

## Step 3: Create the Routes (Endpoints)

**File:** `backend/routes/job.route.js`

Now we need to expose the controller functions to the outside world via URLs. We use `express.Router()` to define these endpoints. We can also add middleware like `isAuthenticated` here to protect routes.

```javascript
/* backend/routes/job.route.js */
import express from 'express';
import isAuthenticated from '../middlewares/isAuthenticated.js';
import { postJob, getAllJobs } from '../controllers/job.controller.js';

const router = express.Router();

// Define the endpoints
// POST /api/v1/job/register -> Calls postJob (Protected by isAuthenticated)
router.route("/register").post(isAuthenticated, postJob);

// GET /api/v1/job/get -> Calls getAllJobs (Protected by isAuthenticated)
router.route("/get").get(isAuthenticated, getAllJobs);

export default router;
```

**Key Concept:**
*   **Middleware**: Functions that run *before* the controller (e.g., checking if a user is logged in).
*   **HTTP Methods**: `post` (create), `get` (read), `put` (update), `delete` (remove).

---

## Step 4: Register Routes in Main App

**File:** `backend/index.js`

Finally, we need to tell the main Express app to use the routes we just defined. This is done in the entry point of the application.

```javascript
/* backend/index.js */
import express from 'express';
// ... other imports
import jobRoutes from './routes/job.route.js'; // Import the routes

const app = express();

// ... middleware setup (cors, json parser, etc.)

// Register the API Routes
// All routes in jobRoutes will be prefixed with /api/v1/job
app.use('/api/v1/job', jobRoutes); 

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running at port ${PORT}`);
});
```

---

## Summary of the Flow

When a client sends a request to post a job:

1.  **Request**: `POST http://localhost:3000/api/v1/job/register`
2.  **`index.js`**: Matches `/api/v1/job` prefix and forwards to `jobRoutes` (in `job.route.js`).
3.  **`job.route.js`**: Matches `/register` and method `POST`.
4.  **Middleware**: `isAuthenticated` runs. If authorized using JWT, it passes control (`next()`) to the controller.
5.  **Controller**: `postJob` runs. It validates data and saves to DB using `Job` model.
6.  **Response**: Server sends back `{ message: "Job posted successfully", ... }` to the client.
