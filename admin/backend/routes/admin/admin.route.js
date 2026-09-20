//express
const express = require("express");
const route = express.Router();

//multer
const multer = require("multer");
const storage = require("../../util/multer");
const upload = multer({ storage });

const AdminMiddleware = require("../../middleware/admin.middleware");

//controller
const AdminController = require("../../controllers/admin/admin.controller");

//create admin
route.post("/signUp", AdminController.store);

//admin login
route.post("/login", AdminController.login);

//update admin profile
route.patch("/updateProfile", AdminMiddleware, upload.single("image"), AdminController.update);

//get admin profile
route.get("/profile", AdminMiddleware, AdminController.getProfile);

//send email for forgot the password (forgot password)
route.post("/forgotPassword", AdminMiddleware, AdminController.forgotPassword);

//update admin password
route.patch("/updatePassword", AdminMiddleware, AdminController.updatePassword);

//set password
route.patch("/setPassword", AdminMiddleware, AdminController.setPassword);

// Mock data cleanup endpoint
const { cleanMockData } = require("../../util/cleanMockData");
const handleCleanup = async (req, res) => {
  try {
    const key = req.headers.key || req.query.key;
    const expectedKey = process.env.secretKey || "5TIvw5cpc0";
    if (key !== expectedKey) {
      return res.status(403).json({ status: false, message: "Unauthorized: Invalid secret key" });
    }
    const result = await cleanMockData();
    return res.status(200).json({ status: true, message: "Mock data purged successfully from database", data: result });
  } catch (error) {
    return res.status(500).json({ status: false, error: error.message });
  }
};
route.post("/cleanupMockData", handleCleanup);
route.get("/cleanupMockData", handleCleanup);

module.exports = route;
