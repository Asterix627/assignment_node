const express = require("express");
const router = express.Router();
const invProblemControllers = require("../controllers/invProblemControllers/invProblemControllers");
const validateInput = require("../utils/validators/auth");
const verifyAuth = require("../middleware/auth");
const { verify } = require("jsonwebtoken");

router.post("/submit-problem", verifyAuth.token, invProblemControllers.createProblem); //addProblem-done
router.get("/get-problems", verifyAuth.token, invProblemControllers.getProblems); //getProblems-done
router.get("/get-problems/:id", verifyAuth.token, invProblemControllers.getProblemsByInv); //getProblemsbyInv-done
router.get("/problems-detail/:id", verifyAuth.token, verifyAuth.roles, invProblemControllers.getDetailProblem); //getDetailProblems-done
router.put("/problems-status/:id", verifyAuth.token, verifyAuth.roles, invProblemControllers.updateStatus); //problemsDone-done
router.put("/problems-done/:id", verifyAuth.token, invProblemControllers.problemsDone); //updateStatus-done
router.put("/problems-update/:id", verifyAuth.token, invProblemControllers.editDetailProblems); //editDetails-done
router.delete("/problems/:id", verifyAuth.token, verifyAuth.roles, invProblemControllers.deleteProblems); //deleteProblems-done

module.exports = router;