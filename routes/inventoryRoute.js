const express = require("express")
const utilities = require("../utilities")
const router = new express.Router() 
const invController = require("../controllers/invController")
const invValidate = require('../utilities/account-validation')

// Route to build inventory by classification view

router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));
router.get("/detail/:inv_id", utilities.handleErrors(invController.buildByInventoryId));
router.get("/detail/", utilities.handleErrors(invController.buildByInventoryId501));
router.get("/", utilities.handleErrors(invController.buildManagement));
router.get("/add-classification", utilities.handleErrors(invController.buildAddClassification));
router.get("/add-inventory", utilities.handleErrors(invController.buildAddInventory));

// Route to delete inventory (vehicle)
router.post("/delete/", utilities.handleErrors(invController.deleteInventory))

// Route to update inventory (vehicle) details
router.post("/update/",
    invValidate.addNewVehRules(),
    invValidate.checkUpdateData,
    utilities.handleErrors(invController.updateInventory))



module.exports = router;