import express from "express";
import { verifyUser } from "../middleware/authMiddleware.js";
import { createCustomer, getCustomers } from "../controllers/customerController.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();
router.post("/create-customer", verifyUser, upload.single("avatar"), createCustomer)
router.get("/get-customer", verifyUser, getCustomers)

export default router;