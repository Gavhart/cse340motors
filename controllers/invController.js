const invModel = require("../models/inventory-model");
const utilities = require("../utilities/");

const invCont = {};

/* ***************************
 * Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
    const classification_id = req.params.classificationId;
    const data = await invModel.getInventoryByClassificationId(classification_id);
    const grid = await utilities.buildClassificationGrid(data);
    let nav = await utilities.getNav();
    const className = data[0].classification_name;
    res.render("./inventory/classification", {
        title: className + " vehicles",
        nav,
        grid,
    });
};

/* ***************************
 * Build inventory by Inventory id
 * ************************** */
invCont.buildByInventoryId = async function (req, res, next) {
    try {
        const inv_id = req.params.inv_id;
        const vehicleData = await invModel.getVehicleByInventoryId(inv_id);
        let nav = await utilities.getNav();
        const title = vehicleData.inv_year + ' ' + vehicleData.inv_make + ' ' + vehicleData.inv_model;

        // Uncomment and fix if buildInventoryGrid is available and needed
        // const grid = await utilities.buildInventoryGrid(vehicleData);

        res.render('./inventory/detail', {
            title: title,
            nav,
            // grid, // Ensure grid is defined if uncommented
            data: vehicleData,
            message: null,
            errors: null,
        });
    } catch (err) {
        next(err);
    }
};

invCont.buildManagement = async function (req, res, next) {
    let nav = await utilities.getNav();
    const title = "Vehicle Management";
    res.render("./inventory/management", {
        title: title,
        nav,
        errors: null,
    });
};

invCont.buildAddClassification = async function (req, res, next) {
    let nav = await utilities.getNav();
    const title = "Add New Classification";
    res.render("./inventory/add-classification", {
        title: title,
        nav,
        errors: null,
    });
};

invCont.buildAddInventory = async function (req, res, next) {
    let nav = await utilities.getNav();
    const title = "Add New Vehicle";
    let classificationList = await utilities.buildClassificationList();
    res.render("./inventory/add-inventory", {
        title: title,
        nav,
        classificationList,
        errors: null,
    });
};

invCont.buildByInventoryId501 = async function (req, res, next) {
    let nav = await utilities.getNav();
    res.render("errors/error", {
        title: '501' || 'Server Error',
        message: 'Sorry, no id was selected.',
        nav,
        errors: null,
    });
    next({status: 501, message: 'Sorry, no id was selected.'});
};

module.exports = invCont;
