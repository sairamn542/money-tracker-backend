import cron from "node-cron";
import Loan from "../models/Loan.js";
import Customer from "../models/Customer.js";
import Admin from "../models/Admin.js";
import { sendGmail } from "../services/googleEmailService.js";

cron.schedule("0 9 * * 1", async () => {
// cron.schedule("*/5 * * * *", async () => {
    try {
        console.log("Checking loan reminders...");

        const today = new Date();

        const loans = await Loan.find({
            status: "active",
            remainingAmount: { $gt: 0 },
            dueDate: { $gte: today }
        });

        for (const loan of loans) {

            const customer = await Customer.findOne({
                _id: loan.customerId,
                adminId: loan.adminId
            });

            if (!customer) continue;

            const admin = await Admin.findById(loan.adminId);

            if (!admin || !admin.googleRefreshToken) {
                console.log("Google account not connected for this admin");
                continue;
            }

            await sendGmail(
                admin,
                customer.email,
                "Loan Payment Reminder",
                `Hello ${customer.name},

Your loan payment of ₹${loan.remainingAmount} is still pending.

Due date: ${loan.dueDate.toDateString()}

Please make the payment before the due date.

Thank you,
Money Tracker`
            );

            console.log(`Reminder sent to ${customer.email}`);
        }

        console.log("Reminder check completed.");

    } catch (error) {
        console.log("Reminder error:", error);
    }
});