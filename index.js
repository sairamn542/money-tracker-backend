import express from "express";
import dotenv from "dotenv";
import cors from "cors"
import mongoose from "mongoose";
import adminRoutes from "./routes/adminRoutes.js"
import customerRoute from "./routes/customerRoutes.js"
import loanRoute from "./routes/loanRoutes.js"
import paymentRoute from "./routes/paymentRoute.js"
import reminderRoute from "./routes/reminderRoutes.js"
import googleRoute from "./routes/googleRoute.js"
import cookieParser from "cookie-parser"
import { errorHandler } from "./middleware/errorHandler.js";
dotenv.config()
// import "./jobs/reminderJob.js"
mongoose.connect(process.env.MONGO_URI).then(() => {
    console.log("Connected To DB")
}).catch((error) => {
    console.log(error)
})
const app = express()
app.use(cors({
    // origin: "http://localhost:5173",
    origin: "https://sairam-money-tracker.netlify.app/",
    credentials: true
}));
app.use(express.json())
app.use(cookieParser())
app.use("/api/admin", adminRoutes)
app.use("/api/customer/", customerRoute)
app.use("/api/loan/", loanRoute)
app.use("/api/payment/", paymentRoute)
app.use("/api/reminder", reminderRoute)
app.use("/api/google/", googleRoute)
app.use(errorHandler)
const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {
    console.log(`App listening on port ${PORT}`);
});