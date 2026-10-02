import mongoose from "mongoose";

const LoanTransactionSchema = new mongoose.Schema(
    {
        adminId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Admin",
            required: true
        },

        customerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Customer",
            required: true
        },

        loanId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Loan",
            required: true
        },

        amount: {
            type: Number,
            required: true,
            min: 0
        },

        type: {
            type: String,
            enum: ["taken"],
            default: "taken"
        }
    },
    {
        timestamps: true
    }
);

const LoanTransaction = mongoose.model(
    "LoanTransaction",
    LoanTransactionSchema
);

export default LoanTransaction;