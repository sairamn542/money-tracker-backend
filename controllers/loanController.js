import { errorHandler } from "../middleware/errorHandler.js";
import Customer from "../models/Customer.js";
import Loan from "../models/Loan.js";

export const createLoan = async (req, res, next) => {
    const { customerId, amount, dueDate } = req.body;
    if (!customerId || !amount || !dueDate) return next(errorHandler(400, "All fields are required"));
    try {
        const customer = await Customer.findOne({
            adminId: req.user.id,
            _id: customerId
        });
        if (!customer) return next(errorHandler(400, "Customer Not Found"))
        await Loan.create({ adminId: req.user.id, customerId, amount, remainingAmount: amount, dueDate })
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