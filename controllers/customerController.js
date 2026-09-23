import Customer from "../models/Customer.js";
import { errorHandler } from "../middleware/errorHandler.js";
import cloudinary from "../config/cloudinary.js";

export const createCustomer = async (req, res, next) => {
    const { name, email } = req.body;
    if (!name || !email || !req.file) {
        return next(errorHandler(400, "name, email and avatar are required"))
    }
    try {
        const result = await new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
                { folder: "money-tracker/customers" },
                (error, result) => {
                    if (error) reject(error);
                    else resolve(result);
                }
            );

            stream.end(req.file.buffer);
        });
        const createCustomer = new Customer({
            adminId: req.user.id,
            name,
            email,
            avatar: result.secure_url
        });
        await createCustomer.save();
        res.status(201).json("customer created successfully")
    } catch (err) {
        next(err)
    }
}

//get customers by admin id
export const getCustomers = async (req, res, next) => {
    try {
        const customers = await Customer.find({
            adminId : req.user.id
        });
        res.status(200).json(customers)
    } catch (error) {
        next(error)
    }
}