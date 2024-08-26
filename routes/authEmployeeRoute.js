const router = require("express").Router();
const { registerEmployeeUserController, loginEmployeeUserController } = require("../controller/authEmployee");
const { verifyTokenAndAdmin } = require("../middlewares/verifyToken");


// api/auth-employee/register
router.post("/register",verifyTokenAndAdmin,registerEmployeeUserController);

// api/auth-employee/login
router.post("/login",loginEmployeeUserController);

module.exports = router;