import mongoose from "mongoose"

const AdminSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    googleRefreshToken: {
        type: String
    }
}, { timestamps: true })
const Admin = mongoose.model("Admin", AdminSchema);
export default Admin