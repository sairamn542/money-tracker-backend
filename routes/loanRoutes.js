import express from "express";
import { verifyUser } from "../middleware/authMiddleware.js";
import { createLoan, getLoans } from "../controllers/loanController.js";

const router = express.Router();
router.post("/create-loan", verifyUser, createLoan)
router.get("/get-loan", verifyUser, getLoans)

export default router;