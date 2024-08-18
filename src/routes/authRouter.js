const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController/authController");
const validateInput = require("../utils/validators/auth");
const verifyAuth = require("../middleware/auth");
const { verify } = require("jsonwebtoken");

router.post("/login", validateInput.login, authController.login); //login-done
router.put("/logout", verifyAuth.token, authController.logout); //logout-done

module.exports = router;
