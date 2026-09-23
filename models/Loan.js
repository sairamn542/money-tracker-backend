import mongoose from "mongoose"

const LoanSchema = new mongoose.Schema({
    adminId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Admin",
        required: true,
    },
    customerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Customer",
        required: true
    },
    amount: {
        type: Number,
        required: true,
        min: 0
    },
    remainingAmount: {
        type: Number,
        required: true,
        min: 0
    },
    dueDate: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        enum: ["active", "paid", "overdue"],
        default: "active"
    }
}, { timestamps: true })

const Loan = mongoose.model("Loan", LoanSchema);
export default Loan;