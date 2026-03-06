
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Create transporter - verify these sensitive fields in environment variables
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, // Use SSL
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS?.replace(/\s+/g, '') // Remove spaces from App Password
    },
    // STRICT TIMEOUTS: Vercel kills requests after 10s. Render blocks SMTP.
    // We must fail fast (3s) so the user gets the OTP fallback in the UI.
    connectionTimeout: 3000,
    greetingTimeout: 3000,
    socketTimeout: 3000,
});

export const sendOtpEmail = async (email, otp) => {
    try {
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Verify your Account - TPC Portal',
            html: `<p>Your OTP for account verification is: <strong>${otp}</strong></p>
                   <p>This OTP is valid for 5 minutes.</p>`
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent:', info.response);
        return { success: true };
    } catch (error) {
        console.error('Email send error:', error);
        return { success: false, error: error.message };
    }
};
