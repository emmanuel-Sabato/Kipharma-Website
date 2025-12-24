const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Storage for product images
const productStorage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'kipharma/products',
        allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
        transformation: [{ width: 500, height: 500, crop: 'fill' }]
    }
});

// Storage for team member images
const teamStorage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'kipharma/team',
        allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
        transformation: [{ width: 400, height: 400, crop: 'fill', gravity: 'face' }]
    }
});

// Storage for partner logos
const partnerStorage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'kipharma/partners',
        allowed_formats: ['jpg', 'jpeg', 'png', 'webp', 'svg'],
        transformation: [{ width: 300, height: 300, crop: 'fit' }]
    }
});

// Create multer upload instances
const uploadProduct = multer({ storage: productStorage });
const uploadTeam = multer({ storage: teamStorage });
const uploadPartner = multer({ storage: partnerStorage });

// Helper to delete image from Cloudinary
const deleteImage = async (publicId) => {
    try {
        if (publicId) {
            await cloudinary.uploader.destroy(publicId);
        }
    } catch (error) {
        console.error('Cloudinary delete error:', error);
    }
};

// Extract public ID from Cloudinary URL
const getPublicIdFromUrl = (url) => {
    if (!url || !url.includes('cloudinary')) return null;
    const parts = url.split('/');
    const filename = parts[parts.length - 1];
    const folder = parts[parts.length - 2];
    const publicId = `${folder}/${filename.split('.')[0]}`;
    return publicId;
};

module.exports = {
    cloudinary,
    uploadProduct,
    uploadTeam,
    uploadPartner,
    deleteImage,
    getPublicIdFromUrl
};
