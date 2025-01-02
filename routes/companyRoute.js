const router = require("express").Router();
const validationObjectId = require("../middlewares/validateObjectID");
const { verifyTokenAndAdmin } = require("../middlewares/verifyToken");
const { getAllCompaniesController,
    ceateNewCompanyController,
    getOneCompanyController,
    updateCompanyController,
    deleteCompanyController,
    CountAllCompaniesController
} = require("../controller/CompanyController");
const { AddCompanyImageController, RemovImageCompanyController, changeCompanyImageController } = require("../controller/CompanyImageController");
const photoUpload = require("../middlewares/uploadProfilePhoto");
const verifyEmployeeToken = require("../middlewares/verifyEmloyeeToken");

// api/company/list
router.route("/list")
    .get(getAllCompaniesController)
    .post(verifyTokenAndAdmin, ceateNewCompanyController);

// api/company/list/:id
router.route("/list/:id")
    .get(validationObjectId, getOneCompanyController)
    .put(validationObjectId, verifyEmployeeToken, updateCompanyController)
    .delete(validationObjectId, verifyTokenAndAdmin, deleteCompanyController)

// api/company/change-image/:id
router.route("/change-image/:id")
    .post(verifyEmployeeToken, validationObjectId, photoUpload.single("image"), changeCompanyImageController);

// api/company/upload-company-image
router.route("/upload-company-image/:id")
    .post(verifyTokenAndAdmin, validationObjectId, photoUpload.single("image"), AddCompanyImageController);

// api/company/Remove-company-image/:id
router.route("/remove-company-image/:id")
    .delete(verifyTokenAndAdmin, validationObjectId, RemovImageCompanyController);

// api/company/count
router.route("/count")
    .get(verifyTokenAndAdmin, CountAllCompaniesController);

module.exports = router;