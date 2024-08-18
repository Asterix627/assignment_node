const express = require("express");
const router = express.Router();
const absenControllers = require("../controllers/absenControllers/absenController");
const verifyAuth = require("../middleware/auth");
const { verify } = require("jsonwebtoken");

router.post("/users/:id/absen-masuk", verifyAuth.token, absenControllers.absenMasuk); //absenmasuk-done
router.get("/absen", verifyAuth.token, verifyAuth.roles, absenControllers.getAllAbsen ); //getAllAbsen-done
router.get("/absen/:id", verifyAuth.token, verifyAuth.roles, absenControllers.getAbsenByUserId); //getAbsenbyId-done

module.exports = router;
