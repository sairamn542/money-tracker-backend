import express from "express";
import { verifyUser } from "../middleware/authMiddleware.js";
import { createPayment } from "../controllers/paymentController.js";

const route = express.Router();

route.post("/create-payment", verifyUser, createPayment)

export default route;