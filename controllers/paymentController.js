import { errorHandler } from "../middleware/errorHandler.js";
import Loan from "../models/Loan.js"
import Payment from "../models/Payment.js";
export const createPayment = async (req, res, next) => {
    const { loanId, amount } = req.body;
    if (!loanId || !amount) {
        return next(errorHandler(400, "LoanId and amount is required"))
    }
    if (amount <= 0) {
        return next(errorHandler(400, "Payment amount must be greater than 0"));
    }
    try {
        const loan = await Loan.findOne({
            _id: loanId,
            adminId: req.user.id
        });
        if (!loan) return next(errorHandler(400, "Loan not found"))
        if (amount > loan.remainingAmount) return next(errorHandler(400, "Payment amount is greater than remaining amount"))
        await Payment.create({
            adminId: req.user.id,
            customerId: loan.customerId,
            loanId: loan._id,
            amount
        });
        loan.remainingAmount -= amount
        if (loan.remainingAmount === 0) {
            loan.status = "paid"
        }
        await loan.save()
        res.status(201).json("Payment created successfully")
    } catch (error) {
        next(error)
    }
}