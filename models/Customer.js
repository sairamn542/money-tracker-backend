import mongoose from "mongoose"

const CustomerSchema = new mongoose.Schema({
    adminId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Admin",
        required: true
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    avatar: {
        type: String
    }
}, { timestamps: true });
const Customer = mongoose.model("Customer", CustomerSchema);
export default Customer;