const express = require("express");
const router = express.Router();
const invProblemControllers = require("../controllers/invProblemControllers/invProblemControllers");
const validateInput = require("../utils/validators/auth");
const verifyAuth = require("../middleware/auth");
const { verify } = require("jsonwebtoken");

router.post("/submit-problem", verifyAuth.token, invProblemControllers.createProblem); //addProblem-done

module.exports = router;