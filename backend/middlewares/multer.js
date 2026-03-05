import multer from "multer";
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import dotenv from 'dotenv';
dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: async (req, file) => {
        return {
            folder: 'tnp_uploads',
            allowed_formats: ['jpg', 'png', 'jpeg', 'pdf', 'doc', 'docx'],
            // Use original filename without extension to help identify files, removing spaces and special chars
            public_id: file.originalname.split('.')[0].replace(/[^a-zA-Z0-9]/g, '_') + '_' + Date.now(),
        };
    },
});

export const upload = multer({ storage: storage });
export const singleUpload = upload.single("file");
