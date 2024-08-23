const express = require("express");
const router = express.Router();
const categoryControllers = require("../controllers/categoryController/categoryController");
const verifyAuth = require("../middleware/auth");
const { verify } = require("jsonwebtoken");

router.post("/submit-kategori", verifyAuth.roles, categoryControllers.createCategory); //addCategory-done
router.get("/kategori", categoryControllers.getAllCategory); //getAllCategory-done
router.get("/kategori/:id", categoryControllers.getCategoryById); //getCategoryById-done
router.put("/kategori/:id", verifyAuth.roles, categoryControllers.updateCategory ) //updateCategory-done
router.delete("/kategori/:id", verifyAuth.roles, categoryControllers.deleteCategory); //deleteCategory-done

module.exports=router;