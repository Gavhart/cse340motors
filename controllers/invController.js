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

/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
    const classification_id = parseInt(req.params.classification_id)
    const invData = await invModel.getInventoryByClassificationId(classification_id)
    if (invData[0].inv_id) {
      return res.json(invData)
    } else {
      next(new Error("No data returned"))
    }
  }

  /* ***************************
 *  build confirm delete inventory (vehicle) view
 * ************************** */
invCont.confirmDelete = async function (req, res, next) {
    const inv_id = parseInt(req.params.inv_id)
    let nav = await utilities.getNav()
    const vehData = await invModel.getInventoryByVehicleId(inv_id)
    const vehName = `${vehData[0].inv_make} ${vehData[0].inv_model}`
    res.render("./inventory/delete-confirm", {
      title: "Delete " + vehName,
      nav,
      errors: null,
      inv_id: vehData[0].inv_id,
      inv_make: vehData[0].inv_make,
      inv_model: vehData[0].inv_model,
      inv_price: vehData[0].inv_price,
      inv_year: vehData[0].inv_year,
    })
  }
  
  /* ****************************************
  *  Delete Inventory Data
  * *************************************** */
  invCont.deleteInventory = async function(req, res, next) {
    let nav = await utilities.getNav()
    const {
      inv_id,
      inv_make,
      inv_model,
      inv_year,
      inv_price,
  } = req.body
    
    const deleteResult = await invModel.deleteInventory(inv_id)
  
    if (deleteResult) {
      req.flash("notice", `The deletion was successful.`)
      res.redirect("/inv/")
    } else {
      req.flash("notice", "Sorry, the vehicle deletion failed.")
      res.status(501).render("./inventory/delete-confirm", {
        title: "Delete " + inv_make + inv_model,
        nav,
        errors: null,
        inv_id,
        inv_make,
        inv_model,
        inv_year,
        inv_price,
      })
    }
  }

  /* ***************************
 *  build edit inventory (vehicle) view
 * ************************** */
invCont.editInventory = async function (req, res, next) {
    const inv_id = parseInt(req.params.inv_id)
    let nav = await utilities.getNav()
    const vehData = await invModel.getInventoryByVehicleId(inv_id)
    const vehClass = await utilities.buildClassSelectOption(vehData[0].classification_id)
    const vehName = `${vehData[0].inv_make} ${vehData[0].inv_model}`
    res.render("./inventory/edit-inventory", {
      title: "Edit " + vehName,
      nav,
      vehClass: vehClass,
      errors: null,
      inv_id: vehData[0].inv_id,
      inv_make: vehData[0].inv_make,
      inv_model: vehData[0].inv_model,
      inv_year: vehData[0].inv_year,
      inv_description: vehData[0].inv_description,
      inv_image: vehData[0].inv_image,
      inv_thumbnail: vehData[0].inv_thumbnail,
      inv_price: vehData[0].inv_price,
      inv_miles: vehData[0].inv_miles,
      inv_color: vehData[0].inv_color,
      classification_id: vehData[0].classification_id
    })
  }
  
  /* ****************************************
  *  Update Inventory Data
  * *************************************** */
  invCont.updateInventory = async function(req, res, next) {
    let nav = await utilities.getNav()
    const {
      inv_id,
      inv_make,
      inv_model,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_year,
      inv_miles,
      inv_color,
      classification_id,
    } = req.body
  
    const updateResult = await invModel.updateInventory(
      inv_id,
      inv_make,
      inv_model,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_year,
      inv_miles,
      inv_color,
      classification_id,
    )
  
    if (updateResult) {
      const itemName = updateResult.inv_make + " " + updateResult.inv_model
      req.flash("notice", `The ${itemName} was successful updated.`)
      res.redirect("/inv/")
    } else {
      const vehClass = await utilities.buildClassSelectOption(classification_id)
      const itemName = `${inv_make} ${inv_model}`
      req.flash("notice", "Sorry, the vehicle update failed.")
      res.status(501).render("./inventory/edit-inventory", {
        title: "Edit " + itemName,
        nav,
        classificationSelect: vehClass,
        errors: null,
        inv_id,
        inv_make,
        inv_model,
        inv_year,
        inv_description,
        inv_image,
        inv_thumbnail,
        inv_price,
        inv_miles,
        inv_color,
        classification_id
      })
    }
  }

  /* ****************************************
*  Process Add New Vehicle
* *************************************** */
invCont.processNewVeh = async function(req, res, next) {
    const {
      inv_make,
      inv_model,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_year,
      inv_miles,
      inv_color,
      classification_id,
    } = req.body
  
    const vehResult = await invModel.addNewVeh(
      inv_make,
      inv_model,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_year,
      inv_miles,
      inv_color,
      classification_id,
    )
    let nav = await utilities.getNav()
  
    if (vehResult) {
      req.flash(
        "notice",
        `Congratulations! You\'ve added ${inv_make} ${inv_model}.`
      )
      res.status(201).render("./inventory/management", {
          title: "Vehicle Management",
          nav,
          errors: null,
      });
    } else {
      req.flash("notice", "Sorry, adding the new vehicle failed.")
      res.status(501).render("./inventory/add-inventory", {
        title: "Add New Vehicle",
        nav,
      })
    }
  }
  
  



module.exports = invCont;
