import express from "express";
import { verifyUser } from "../middleware/authMiddleware.js";
import {
    connectGoogle,
    googleCallback,
    testGmail
} from "../controllers/googleController.js";

const router = express.Router();

router.get("/connect", verifyUser, connectGoogle);
router.get("/callback", googleCallback);
router.get("/test-email", verifyUser, testGmail);

export default router;