const express = require("express");
const router = express.Router();
const userController = require("../controllers/userControllers/userController");
const { validateUserInput } = require("../utils/validators/auth");
const { loginController } = require("../controllers/userControllers/loginController");
const { logoutController } = require("../controllers/userControllers/logoutController");
const { verifyToken, verifyRoles } = require("../middleware/auth");
const { absenMasukController } = require("../controllers/absenControllers/absenMasukController");
const { verify } = require("jsonwebtoken");
const { getAbsenControllers, getAbsenByUserId } = require("../controllers/absenControllers/getAbsenControllers");

router.get("/users", verifyToken, userController.getUsers);
router.get("/users/:id", userController.getDetailUsers);
router.post("/register", validateUserInput, userController.createUser);
router.put("/users/:id", validateUserInput, userController.updateUser);
router.delete("/users/:id", verifyToken, verifyRoles, userController.deleteUser);
router.post("/login", loginController);
router.put("/logout", verifyToken, logoutController);
router.post("/users/:id/absen-masuk", verifyToken, absenMasukController);
router.put("/users/:id/role", verifyToken, verifyRoles, userController.updateRole);
router.get("/absen", verifyToken, verifyRoles, getAbsenControllers);
router.get("/absen/:id", verifyToken, verifyRoles, getAbsenByUserId);

module.exports = router;
