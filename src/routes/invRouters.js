const express = require("express");
const router = express.Router();
const invControllers = require("../controllers/invControllers/invControllers");
const validateInput = require("../utils/validators/auth");
const verifyAuth = require("../middleware/auth");
const { verify } = require("jsonwebtoken");

router.post("/submit-inventory", verifyAuth.token, verifyAuth.roles, invControllers.createInventory);
router.get("/inventory", invControllers.getInventory);
router.get("/inventory/:id", invControllers.getDetailInventory);
router.put("/inventory/:id",verifyAuth.token, verifyAuth.roles, invControllers.updateInventory);
router.delete("/inventory/:id",verifyAuth.token, verifyAuth.roles, invControllers.deleteInventory);

module.exports = router;
