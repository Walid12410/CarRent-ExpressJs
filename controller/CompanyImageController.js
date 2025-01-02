const asyncHandler = require("express-async-handler");
const path = require("path");
const fs = require("fs");
const { CompanyImage } = require("../model/CompanyImage");
const { Companies } = require("../model/Company");
const { cloudinaryUploadImage, cloudinaryRemoveImage } = require("../utils/cloudinary");


/**
 * @desc Add image to compnay
 * @Route /api/company/upload-company-image/:id
 * @method POST
 * @access private (Admin Only)
*/
module.exports.AddCompanyImageController = asyncHandler(async (req, res) => {
    let imagePath;
    try {
        const { file } = req;
        const { id: companyID } = req.params;
        const { isDefaultImage } = req.body;
        if (!file || !companyID) return res.status(400).json({ message: "File or Company ID missing" });

        const company = await Companies.findById(companyID);
        if (!company) return res.status(400).json({ message: "Company ID not found" });

        imagePath = path.join(__dirname, `../images/${file.filename}`);
        const result = await cloudinaryUploadImage(imagePath);
        if (!result?.public_id) throw new Error("Image upload failed");

        if (isDefaultImage) await CompanyImage.updateMany({ companyID }, { isDefaultImage: false });

        const newImage = new CompanyImage({
            companyID,
            image: { url: result.secure_url, cloudinary_id: result.public_id },
            isDefaultImage: !!isDefaultImage
        });
        await newImage.save();

        res.status(200).json({ message: "Image uploaded successfully", companyImage: newImage });
    } catch (err) {
        res.status(500).json({ message: err.message });
    } finally {
        if (imagePath && fs.existsSync(imagePath)) fs.unlinkSync(imagePath); // Clean up local image
    }
});


/**
 * @desc Delete Image by id
 * @Route /api/company/upload-company-image/:id
 * @method DELETE
 * @access private (Admin Only)
*/
module.exports.RemovImageCompanyController = asyncHandler(async (req, res) => {
    const image = await CompanyImage.findById(req.params.id);
    if (!image) {
        return res.status(404).json({ message: "Image not found" });
    }

    if (image.cloudinary_id) {
        await cloudinaryRemoveImage(image.cloudinary_id);
    }

    await CompanyImage.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: "Image deleted successfully" });
});


/**
 * @desc change company image
 * @Route /api/company/change-image/:id
 * @method POST
 * @access private (employee only)
*/
module.exports.changeCompanyImageController = asyncHandler(async (req,res)=> {
    if(!req.file) return res.status(400).json({message: "No file provided"});

    const imagePath = path.join(__dirname, `../images/${req.file.filename}`);
    const result = await cloudinaryUploadImage(imagePath);
    const companyImage = await CompanyImage.findById(req.params.id);

    if(companyImage.image && companyImage.image.cloudinary_id){
        await cloudinaryRemoveImage(companyImage.image.cloudinary_id);
    }

    companyImage.image = {
        url: result.secure_url,
        cloudinary_id: result.public_id
    };
    await companyImage.save();

    res.status(200).json({
        message : "Company image uploaded successfully",
        companyImage: {url: result.secure_url, cloudinary_id: result.public_id}
    });

    fs.unlinkSync(imagePath);
});