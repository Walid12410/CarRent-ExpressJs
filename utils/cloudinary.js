const clouidnary = require("cloudinary");

clouidnary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Cloudinary Upload Image
const cloudinaryUploadImage = async(fileToUpload) =>{
    try {
        const data = await clouidnary.uploader.upload(fileToUpload,{
            resourse_type: 'auto',
        });
        return data;
    } catch (error) {
        throw new Error("Internal Server Error (cloudinary)")
    }
}

// Cloudinary Remove Image
const cloudinaryRemoveImage = async(imagePublicId) =>{
    try {
        const result = await clouidnary.uploader.destroy(imagePublicId);
        return result;
    } catch (error) {
        throw new Error("Internal Server Error (cloudinary)")
    }
}

// Cloudinary Remove Image
const cloudinaryRemoveMultipleImage = async(publicIds) =>{
    try {
        const result = await clouidnary.v2.api.delete_resources(publicIds);
        return result;
    } catch (error) {
        throw new Error("Internal Server Error (cloudinary)")
    }
}

module.exports={
    cloudinaryUploadImage,
    cloudinaryRemoveImage,
    cloudinaryRemoveMultipleImage
}