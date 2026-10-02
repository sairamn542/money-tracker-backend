import express from "express";
import { verifyUser } from "../middleware/authMiddleware.js";
import { createCustomer, deleteCustomer, getCustomerById, getCustomers, updateCustomer } from "../controllers/customerController.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();
router.post("/create-customer", verifyUser, upload.single("avatar"), createCustomer)
router.get("/get-customer", verifyUser, getCustomers)
router.get("/get-customer/:id", verifyUser, getCustomerById)
router.delete("/delete-customer/:id", verifyUser, deleteCustomer)
router.put(
    "/update-customer/:id",
    verifyUser,
    upload.single("avatar"),
    updateCustomer
);
export default router;