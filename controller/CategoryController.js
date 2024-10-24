const asyncHandler = require("express-async-handler");
const { Category,
    validationCreateCategory,
    validationUpdateCategory
} = require("../model/Category");
const { CarRent } = require("../model/CarRent");


/**
 * @desc Create new Category
 * @Route /api/category
 * @method POST
 * @access private (only Admin)
*/
module.exports.createNewCategoryController = asyncHandler(async(req,res)=>{
    const { error } = validationCreateCategory(req.body);
    if(error){
        return res.status(400).json({message : error.details[0].message});
    } 

    let category = await Category.findOne({categoryName : req.body.categoryName});
    if(category){
        return res.status(400).json({message : "Category Already Created Before"});
    }

    category = new Category({
        categoryName : req.body.categoryName
    });

    await category.save();

    res.status(201).json({message : "New Category Added Successfully"});
});

/**
 * @desc get all Category
 * @Route /api/category
 * @method GET
 * @access public
*/
module.exports.getAllCategortyController = asyncHandler(async(req,res)=>{
    const categories = await Category.find();
    res.status(200).json(categories);
});


/**
 * @desc Get One Company
 * @Route /api/category/:id
 * @method DELETE
 * @access private (only admin)
*/
module.exports.deleteCategoryController = asyncHandler(async(req,res)=>{
    const category = await Category.findById(req.params.id);
    if(!category){
        return res.status(404).json({message : "Category not found"});
    }

    let carCheck = await CarRent.find({categoryId : req.params.id});
    if(carCheck.length > 0){
        return res.status(404).json({message : "This category is in use by CarRent and cannot be deleted"});
    }

    await Category.findByIdAndDelete(req.params.id);

    res.status(200).json({message : "Category has been deleted successfully"});
});


/**
 * @desc Get One Company
 * @Route /api/category/:id
 * @method PUT
 * @access private (only admin)
*/
module.exports.updateCategoryController = asyncHandler(async(req,res)=>{
    const { error } = validationUpdateCategory(req.body);
    if(error){
        return res.status(400).json({message : error.details[0].message});
    } 

    const updateCategory = await Category.findByIdAndUpdate(req.params.id, {
        $set: {
            categoryName : req.body.categoryName
        }
    },{new: true});

    if(!updateCategory){
        return res.status(404).json({message : "Category not found"});
    }

    res.status(200).json(updateCategory);
});
