const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const { validateUserInput } = require("../utils/validators/auth");
const { loginController } = require("../controllers/loginController");
const { logoutController } = require("../controllers/logoutController");
const { verifyToken } = require("../middleware/auth");
const { absenMasukController } = require("../controllers/absenMasukController");
const { verify } = require("jsonwebtoken");

router.get("/users", verifyToken, userController.getUsers);
router.get("/users/:id", userController.getDetailUsers);
router.post("/register", validateUserInput, userController.createUser);
router.put("/users/:id", validateUserInput, userController.updateUser);
router.delete("/users/:id", userController.deleteUser);
router.post("/login", loginController);
router.put("/logout", verifyToken, logoutController);
router.post("/users/:id/absen-masuk", verifyToken, absenMasukController);

module.exports = router;
