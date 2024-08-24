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


// api/company/list
router.route("/list")
      .get(getAllCompaniesController)
      .post(verifyTokenAndAdmin , ceateNewCompanyController);
 
// api/company/list/:id
router.route("/list/:id")
      .get(validationObjectId, getOneCompanyController)
      .put(validationObjectId,verifyTokenAndAdmin,updateCompanyController)
      .delete(validationObjectId,verifyTokenAndAdmin , deleteCompanyController)
       
// api/company/count
router.route("/count")
      .get(verifyTokenAndAdmin,CountAllCompaniesController);



module.exports = router;