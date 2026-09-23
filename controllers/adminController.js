import { errorHandler } from "../middleware/errorHandler.js";
import Admin from "../models/Admin.js";
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { sendEmail } from "../services/emailService.js";
export const createAdmin = async (req, res, next) => {
    const { name, email, password } = req.body;
    const hashedPassword = bcrypt.hashSync(password, 10)
    const newAdmin = new Admin({ name, email, password: hashedPassword })
    try {
        await newAdmin.save();
        res.status(201).json("Admin Created Successfully")
    } catch (error) {
        next(error)
    }
}

export const signinAdmin = async (req, res, next) => {
    const { email, password } = req.body;
    try {
        const validAdmin = await Admin.findOne({ email });
        if (!validAdmin) return next(errorHandler(400, "user not found"))
        const validatePassword = bcrypt.compareSync(password, validAdmin.password)
        if (!validatePassword) return next(errorHandler(401, "invalid credentials"))
        const token = jwt.sign({ id: validAdmin._id }, process.env.JWT_SECRET)
        const { password: pass, ...admin } = validAdmin._doc
        res.cookie("access_token", token, { httpOnly: true }).status(200).json(admin)
    } catch (error) {
        next(error)
    }
}

export const logout = async (req, res, next) => {
    res.clearCookie("access_token")
    res.status(200).json("Logged out Successfully")
}

export const testEmail = async (req, res, next) => {
    try {
        await sendEmail(
            "shaikameer5241@gmail.com",
            "Money Tracker Test",
            "Email system is working successfully!"
        );

        res.status(200).json("Email sent successfully");
    } catch (error) {
        next(error);
    }
};