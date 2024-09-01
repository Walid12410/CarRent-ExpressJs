const router = require("express").Router();
const validationObjectId = require("../middlewares/validateObjectID");
const { verifyTokenAndAdmin } = require("../middlewares/verifyToken");
const {getAllCompaniesController,
    ceateNewCompanyController,
    getOneCompanyController,
    updateCompanyController,
    deleteCompanyController,
    CountAllCompaniesController
} = require("../controller/companyController");
const { AddCompanyImageController, RemovImageCompanyController } = require("../controller/CompanyImageController");
const photoUpload = require("../middlewares/uploadProfilePhoto");

// api/company/list
router.route("/list")
.get(getAllCompaniesController)
.post(verifyTokenAndAdmin , ceateNewCompanyController);
 
// api/company/list/:id
router.route("/list/:id")
.get(validationObjectId, getOneCompanyController)
.put(validationObjectId,verifyTokenAndAdmin,updateCompanyController)
.delete(validationObjectId,verifyTokenAndAdmin , deleteCompanyController)

// api/company/upload-company-image
router.route("/upload-company-image/:id")
.post(verifyTokenAndAdmin,validationObjectId,photoUpload.single("image"), AddCompanyImageController);

// api/company/Remove-company-image/:id
router.route("/remove-company-image/:id")
.delete(verifyTokenAndAdmin, validationObjectId , RemovImageCompanyController);         

// api/company/count
router.route("/count")
.get(verifyTokenAndAdmin,CountAllCompaniesController);

module.exports = router;