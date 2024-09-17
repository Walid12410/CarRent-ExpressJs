const router = require("express").Router();
const { getAllEmployeeController, deleteEmployeeController } = require("../controller/employeeController");
const validationObjectId = require("../middlewares/validateObjectID");
const { verifyTokenAndAdmin } = require("../middlewares/verifyToken");
  

// /api/employee
router.route("/") 
.get(verifyTokenAndAdmin,getAllEmployeeController);


// /api/employee/:id
router.route("/:id") 
.delete(validationObjectId,verifyTokenAndAdmin,deleteEmployeeController);


module.exports = router;