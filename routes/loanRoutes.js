import express from "express";
import { verifyUser } from "../middleware/authMiddleware.js";
import { createLoan, getLoanDetails, getLoans, getLoanTransactions, updateLoan } from "../controllers/loanController.js";

const router = express.Router();
router.post("/create-loan", verifyUser, createLoan)
router.get("/get-loan", verifyUser, getLoans)
router.put("/update-loan", verifyUser, updateLoan)
router.get("/get-loandetails/:id", verifyUser, getLoanDetails)
router.get("/get-transaction/:id", verifyUser, getLoanTransactions)

export default router;