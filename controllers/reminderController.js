import Loan from "../models/Loan.js";
import Customer from "../models/Customer.js";
import Admin from "../models/Admin.js";
import { sendGmail } from "../services/googleEmailService.js";

const REMINDER_SECRET = process.env.REMINDER_SECRET;


// =====================================================
// External Scheduler Reminder
// Uses REMINDER_SECRET
// =====================================================

export const runReminders = async (req, res) => {

    // Check reminder secret
    if (req.headers["x-reminder-secret"] !== REMINDER_SECRET) {
        return res.status(401).json({
            message: "Unauthorized"
        });
    }

    try {

        console.log("Checking loan reminders...");

        const loans = await Loan.find({
            status: "active",
            remainingAmount: { $gt: 0 }
        });

        let sentCount = 0;

        for (const loan of loans) {

            const customer = await Customer.findOne({
                _id: loan.customerId,
                adminId: loan.adminId
            });

            if (!customer) {
                continue;
            }

            const admin = await Admin.findById(loan.adminId);

            if (!admin || !admin.googleRefreshToken) {
                console.log(
                    "Google account not connected for this admin"
                );
                continue;
            }

            await sendGmail(
                admin,
                customer.email,
                "Loan Payment Reminder",
                `Hello ${customer.name},

Your loan payment of ₹${loan.remainingAmount} is still pending.

Due date: ${loan.dueDate
                    ? loan.dueDate.toDateString()
                    : "Not specified"
                }

Please make the payment before the due date.

Thank you,
Money Tracker`
            );

            sentCount++;

            console.log(
                `Reminder sent to ${customer.email}`
            );
        }

        console.log("Reminder check completed.");

        return res.status(200).json({
            message: "Reminder job completed",
            sentCount
        });

    } catch (error) {

        console.log("Reminder error:", error);

        return res.status(500).json({
            message: "Reminder job failed"
        });
    }
};


// =====================================================
// Manual Reminder From Frontend
// Uses access_token + verifyUser
// =====================================================

export const sendAdminReminders = async (req, res) => {

    try {

        console.log(
            "Sending reminders for admin:",
            req.user.id
        );

        const loans = await Loan.find({
            adminId: req.user.id,
            status: "active",
            remainingAmount: { $gt: 0 }
        });

        let sentCount = 0;

        const admin = await Admin.findById(req.user.id);

        if (!admin) {
            return res.status(404).json({
                message: "Admin not found"
            });
        }

        if (!admin.googleRefreshToken) {
            return res.status(400).json({
                message: "Please connect your Google account first"
            });
        }

        for (const loan of loans) {

            const customer = await Customer.findOne({
                _id: loan.customerId,
                adminId: req.user.id
            });

            if (!customer) {
                continue;
            }

            await sendGmail(
                admin,
                customer.email,
                "Loan Payment Reminder",
                `Hello ${customer.name},

Your loan payment of ₹${loan.remainingAmount} is still pending.

Due date: ${loan.dueDate
                    ? loan.dueDate.toDateString()
                    : "Not specified"
                }

Please make the payment before the due date.

Thank you,
Money Tracker`
            );

            sentCount++;

            console.log(
                `Reminder sent to ${customer.email}`
            );
        }

        console.log(
            `Manual reminder completed. Sent: ${sentCount}`
        );

        return res.status(200).json({
            message: `Reminders sent successfully to ${sentCount} customer(s)`,
            sentCount
        });

    } catch (error) {

        console.log("Admin reminder error:", error);

        return res.status(500).json({
            message: "Failed to send reminders"
        });
    }
};