const router = require("express").Router();
const { getAllCompanyLocationController,
    createNewCompanyLocation,
    updateCompanyLocationController,
    deleteCompanyLocationController,
    getOneCompanyLocationController
} = require("../controller/CompanyLocationController");
const validationObjectId = require("../middlewares/validateObjectID");
const verifyEmployeeToken = require("../middlewares/EmployeeToken");

// api/company-location/:id
router.route("/:id")
    .post(validationObjectId, verifyEmployeeToken, createNewCompanyLocation)
    .put(validationObjectId, verifyEmployeeToken, updateCompanyLocationController)
    .delete(validationObjectId, verifyEmployeeToken, deleteCompanyLocationController)
    .get(validationObjectId, getOneCompanyLocationController);


// api/company-location/
router.route("/")
    .get(getAllCompanyLocationController);


module.exports = router;