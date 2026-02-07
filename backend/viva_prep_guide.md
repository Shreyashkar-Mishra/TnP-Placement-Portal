# Backend Viva Preparation Guide: TPC Portal

Since you are explicitly mentioning that the **Frontend is AI-generated**, your Viva will focus heavily on the **Backend**, **Database**, and **System Architecture**.

Here is the sequence of topics you should master to explain your project confidently.

---

## 1. Project Overview (The "Elevator Pitch")
Start by explaining what the project *does* before how it *works*.
> "This is a **Training and Placement Cell (TPC) Portal** designed to streamline the recruitment process. It connects **Students**, **Recruiters (Companies)**, and **Admins**. Students can apply for jobs, companies can post openings, and admins manage the entire process."

---

## 2. Tech Stack (Backend Only)
Be ready to list these technologies immediately.
*   **Runtime Environment:** Node.js
*   **Framework:** Express.js (for building the REST API)
*   **Database:** MongoDB (NoSQL database)
*   **ODM (Object Data Modeling):** Mongoose (to interact with MongoDB)
*   **Authentication:** JWT (JSON Web Tokens) with Cookies
*   **Security:** `bcryptjs` (Password hashing) & `cors` (Cross-Origin Resource Sharing)
*   **File Handling:** `multer` (for Resume uploads) & `exceljs` (for report generation)

---

## 3. System Architecture (MVC Pattern)
Explain that your project follows a structured **Model-View-Controller (MVC)** pattern (modified for API usage).

1.  **Models (`/models`)**: Define the database structure (Schema).
2.  **Controllers (`/controllers`)**: Contain the main logic (functions like `login`, `register`, `postJob`).
3.  **Routes (`/routes`)**: Map URL endpoints (e.g., `/api/v1/user/login`) to controller functions.
4.  **Middlewares (`/middlewares`)**: Functions that run *before* the controller (e.g., `isAuthenticated` checks if a user is logged in).

---

## 4. Key Database Models (Schema)
You should know the fields of your main models.
*   **User:** Stores Name, Email, Password, Role (`student`, 'company', 'admin'), and Profile details (Education, Resume URL).
*   **Company:** Stores Company Name, Description, Location, and Website.
*   **Job:** Stores Title, Description, Salary, Requirements, and links to the `Company` that posted it.
*   **Application:** Links a `User` to a `Job`, tracking status (Applied, Selected, Rejected).

---

## 5. Key Workflows (The "How it works" part)
Pick these 2-3 specific flows and learn them inside out.

### A. Authentication Flow (Login/Register)
1.  **Register:**
    *   User enters details -> Backend checks if email exists.
    *   **OTP Verification:** You use an `OTP` model to verify emails before registration.
    *   **Password Hashing:** You use `bcrypt.hash(password, 10)` so raw passwords are never stored.
2.  **Login:**
    *   Backend verifies email & password (`bcrypt.compare`).
    *   If correct, it generates a **JWT Token**.
    *   The token is sent back in an **HTTP-Only Cookie** (secure, prevents XSS attacks).

### B. Authorization (Protection)
*   Explain the `isAuthenticated` middleware.
*   "Before allowing access to sensitive routes (like applying for a job), the backend checks if the request has a valid JWT token in the cookies."

### C. File Uploads
*   "I used `multer` middleware to handle resume uploads. It saves the file to the `./uploads` directory and stores the file path in the user's document in MongoDB."

---

## 6. Common Viva Questions & Answers

**Q: Why use MongoDB instead of SQL?**
**A:** MongoDB is flexible (NoSQL). Since student profiles and job descriptions can vary in structure, a document-based store is more suitable than rigid SQL tables. Also, it works appropriately with JavaScript (JSON).

**Q: How do you handle security?**
**A:**
1.  **Passwords:** Hashed using `bcrypt` (never stored plain).
2.  **Sessions:** Stateless JWT authentication (server doesn't store session data, just validates the token).
3.  **Validation:** Input validation checks (e.g., ensuring all fields are present).

**Q: What is `dotenv` used for?**
**A:** To manage environment variables like `PORT`, `MONGO_URI`, and `JWT_SECRET` so sensitive keys aren't hardcoded in the code.

**Q: How do you handle User Roles?**
**A:** The `User` model has a `role` field (`student`, `company`, `admin`). The backend checks this field before allowing actions (e.g., only 'company' role can post jobs).

---

## 7. Explanation Strategy for "AI Frontend"
When you say the frontend is AI-generated, immediately pivot to the backend to show *your* contribution:
> "To speed up development, I used AI tools to generate the UI components. This allowed me to focus all my effort on building a robust, secure **Backend API**, designing the **Database Schema**, and implementing complex logic like **Authentication** and **File Uploads**."
