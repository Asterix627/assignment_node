const express = require("express");
const router = express.Router();
const userController = require("../controllers/userControllers/userController");
const validateInput = require("../utils/validators/auth");
const verifyAuth = require("../middleware/auth");
const { verify } = require("jsonwebtoken");

router.post("/register", validateInput.register, userController.createUser); //register-done
router.get("/users", verifyAuth.token, userController.getUsers); //getUser-done
router.get("/users/:id", userController.getDetailUsers); //getUserbyID-done
router.put("/users/:id", validateInput.register, userController.updateUser); //updateUserbyID-done
router.delete("/users/:id", verifyAuth.token, verifyAuth.roles, userController.deleteUser); //deleteuser-done, di FE kasih peringatan data pelaporan dan absen akan ikut terhapus
router.put("/users/:id/role", verifyAuth.token, verifyAuth.roles, userController.updateRole); //updateAdmin-done
router.put("/users/:id/role", verifyAuth.token, verifyAuth.roles, userController.updateRole); //updateDetailUser-done

module.exports = router;
