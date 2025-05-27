import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import * as multer from 'multer';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'images-coffee',
    format: async () => 'png',
    public_id: (req, file) => `${Date.now()}-${file.originalname}`,
  } as any,
});

export const upload = multer({ storage });
export const cloudinaryInstance = cloudinary;
