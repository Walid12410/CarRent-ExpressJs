const asyncHandler = require("express-async-handler");
const { EmployeeUser } = require("../model/EmployeeUser")


/**
 * @desc Get All Emoloyee
 * @Route /api/employee
 * @method GET
 * @access private (only admin)
*/
module.exports.getAllEmployeeController = asyncHandler(async(req,res)=>{
    const employee = await EmployeeUser.find().populate("companyDetails").select('-password');
    res.status(200).json(employee);
});


/**
 * @desc Delete Employee
 * @Route /api/employee/:id
 * @method Delete
 * @access private (only admin)
*/
module.exports.deleteEmployeeController = asyncHandler(async(req,res)=>{
    const employeeFound = await EmployeeUser.findById(req.params.id);
    if(!employeeFound){
        res.status(404).json({message : 'Employee not found'});
    }else{
        await EmployeeUser.findByIdAndDelete(req.params.id);
        res.status(200).json({message : "Employee deleted successfully"})
    }
});