const router = require("express").Router();
const { createNewCategoryController,
    getAllCategortyController,
    updateCategoryController,
    deleteCategoryController
} = require("../controller/CategoryController");
const validationObjectId = require("../middlewares/validateObjectID");
const { verifyTokenAndAdmin } = require("../middlewares/verifyToken");

// api/category/
router.route("/")
    .post(verifyTokenAndAdmin, createNewCategoryController)
    .get(getAllCategortyController);


// api/category/:id
router.route("/:id")
    .put(validationObjectId, verifyTokenAndAdmin, updateCategoryController)
    .delete(validationObjectId, verifyTokenAndAdmin, deleteCategoryController);



module.exports = router;