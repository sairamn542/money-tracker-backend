import express from "express";
import { createAdmin, logout, signinAdmin, testEmail } from "../controllers/adminController.js";
const router = express.Router();
router.post("/create-admin", createAdmin)
router.post("/admin-login", signinAdmin)
router.get("/test-email", testEmail)
router.post("/logout", logout)
export default router