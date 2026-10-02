import { errorHandler } from "../middleware/errorHandler.js";
import Customer from "../models/Customer.js";
import Loan from "../models/Loan.js";
import LoanTransaction from "../models/LoanTransaction.js";
import Payment from "../models/Payment.js";
export const createLoan = async (req, res, next) => {
    const { customerId, amount, dueDate } = req.body;
    if (!customerId || !amount || !dueDate) return next(errorHandler(400, "All fields are required"));
    try {
        const customer = await Customer.findOne({
            adminId: req.user.id,
            _id: customerId
        });
        if (!customer) return next(errorHandler(400, "Customer Not Found"))
        const loan = await Loan.create({ adminId: req.user.id, customerId, amount, remainingAmount: amount, dueDate })
        await LoanTransaction.create({
            adminId: req.user.id,
            customerId,
            loanId: loan._id,
            amount,
            type: "taken"
        })
        res.status(201).json("Loan created successfully")
    } catch (error) {
        next(error)
    }
}

export const getLoans = async (req, res, next) => {
    try {
        const loans = await Loan.find({ adminId: req.user.id }).populate("customerId", "name email avatar")
        res.status(200).json(loans)
    } catch (error) {
        next(error)
    }
}
export const updateLoan = async (req, res, next) => {
    const { loanId, amount } = req.body;

    if (!loanId || !amount) {
        return next(errorHandler(400, "LoanId and amount are required"));
    }

    if (amount <= 0) {
        return next(errorHandler(400, "Amount must be greater than 0"));
    }

    try {
        const loan = await Loan.findOne({
            _id: loanId,
            adminId: req.user.id
        });

        if (!loan) {
            return next(errorHandler(404, "Loan not found"));
        }

        loan.amount += amount;
        loan.remainingAmount += amount;

        loan.status = "active";

        await loan.save();
        await LoanTransaction.create({
            adminId: req.user.id,
            customerId: loan.customerId,
            loanId: loan._id,
            amount,
            type: "taken"
        })
        res.status(200).json("Loan amount added successfully");
    } catch (error) {
        next(error);
    }
};

export const getLoanDetails = async (req, res, next) => {
    const { id } = req.params;
    const loan = await Loan.findOne({ _id: id, adminId: req.user.id }).populate("customerId", "name email avatar")
    if (!loan) return next(errorHandler(404, "Loan not found"));
    res.status(200).json(loan)
}

export const getLoanTransactions = async (req, res, next) => {
    const { id } = req.params;

    try {
        const takenTransactions = await LoanTransaction.find({
            loanId: id,
            adminId: req.user.id
        }).lean();

        const paymentTransactions = await Payment.find({
            loanId: id,
            adminId: req.user.id
        }).lean();

        const history = [
            ...takenTransactions.map((transaction) => ({
                _id: transaction._id,
                amount: transaction.amount,
                type: "taken",
                createdAt: transaction.createdAt
            })),

            ...paymentTransactions.map((payment) => ({
                _id: payment._id,
                amount: payment.amount,
                type: "paid",
                createdAt: payment.createdAt
            }))
        ].sort(
            (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
        );

        res.status(200).json(history);

    } catch (error) {
        next(error);
    }
};