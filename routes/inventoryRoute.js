// Needed Resources 
//const invValidate = require('../utilities/account-validation')
const express = require("express")
const router = new express.Router()
const utilities = require("../utilities/")
const invController = require("../controllers/invController")
//const revController = require("../controllers/reviewsController")


// Build inventory by classification view route
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));

// Build inventory by detail view route
router.get("/detail/:inv_id", utilities.handleErrors(invController.buildByInventoryId));

// Add New Classification Route
router.get("/addNewClass", utilities.checkEmpAuth,
    utilities.handleErrors(invController.addNewClass)
);

// Add New Vehicle Route
router.get("/addNewVeh",  utilities.checkEmpAuth,
    utilities.handleErrors(invController.addNewVeh)
);

// Build vehicle management Route
router.get("/", utilities.checkEmpAuth, utilities.handleErrors(invController.buildVehicleMgmt));

// Route to modify inventory (vehicle) details
router.get("/edit/:inv_id",  utilities.checkEmpAuth, utilities.handleErrors(invController.editInventory));

// Route to delete inventory (vehicle) item
router.get("/delete/:inv_id", utilities.checkEmpAuth, utilities.handleErrors(invController.confirmDelete));

// Route to delete inventory (vehicle)
router.post("/delete/", utilities.handleErrors(invController.deleteInventory))




module.exports = router;