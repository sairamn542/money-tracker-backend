import express from "express";
import { runReminders, sendAdminReminders } from "../controllers/reminderController.js";
import { verifyUser } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/run", runReminders)
router.get("/send", verifyUser, sendAdminReminders)

export default router;