import { google } from "googleapis";
import dotenv from "dotenv";

dotenv.config();

export const sendGmail = async (admin, to, subject, text) => {
    const auth = new google.auth.OAuth2(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET,
        process.env.GOOGLE_REDIRECT_URI
    );

    auth.setCredentials({
        refresh_token: admin.googleRefreshToken
    });

    const gmail = google.gmail({
        version: "v1",
        auth
    });

    const message = [
        `To: ${to}`,
        `Subject: ${subject}`,
        "Content-Type: text/plain; charset=UTF-8",
        "",
        text
    ].join("\r\n");

    const raw = Buffer.from(message).toString("base64url");

    await gmail.users.messages.send({
        userId: "me",
        requestBody: {
            raw
        }
    });
};