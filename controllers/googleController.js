import { google } from "googleapis";
import Admin from "../models/Admin.js";
import oauth2Client from "../config/google.js";
import { errorHandler } from "../middleware/errorHandler.js";
import { sendGmail } from "../services/googleEmailService.js";
export const testGmail = async (req, res, next) => {
    try {
        const admin = await Admin.findById(req.user.id);

        if (!admin) {
            return next(errorHandler(404, "Admin not found"));
        }

        if (!admin.googleRefreshToken) {
            return next(errorHandler(400, "Google account is not connected"));
        }

        await sendGmail(
            admin,
            admin.email,
            "Money Tracker Gmail Test",
            "This email was sent using your connected Google account."
        );

        res.status(200).json("Gmail email sent successfully!");
    } catch (error) {
        next(error);
    }
};
export const connectGoogle = async (req, res, next) => {
    try {
        const authUrl = oauth2Client.generateAuthUrl({
            access_type: "offline",
            prompt: "consent",
            scope: [
                "https://www.googleapis.com/auth/gmail.send"
            ],
            state: req.user.id
        });

        res.redirect(authUrl);
    } catch (error) {
        next(error);
    }
};

export const googleCallback = async (req, res, next) => {
    try {
        const { code, state } = req.query;
        console.log("GOOGLE CALLBACK QUERY:", req.query);
        if (!code || !state) {
            return next(errorHandler(400, "Google authorization failed"));
        }

        const { tokens } = await oauth2Client.getToken(code);

        if (!tokens.refresh_token) {
            return next(errorHandler(400, "Google refresh token not received"));
        }

        await Admin.findByIdAndUpdate(state, {
            googleRefreshToken: tokens.refresh_token
        });

        res.send("Google account connected successfully!");
    } catch (error) {
        console.log("GOOGLE CALLBACK ERROR:", error);
        next(error);
    }
};