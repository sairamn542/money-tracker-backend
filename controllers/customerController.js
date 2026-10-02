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
            adminId: req.user.id
        });
        res.status(200).json(customers)
    } catch (error) {
        next(error)
    }
}
export const deleteCustomer = async (req, res, next) => {
    const { id } = req.params;
    try {
        const customer = await Customer.findOne({ _id: id, adminId: req.user.id })
        if (!customer) {
            return next(errorHandler(404, "Customer not found"));
        }
        await Customer.deleteOne({ _id: id, adminId: req.user.id })
        return res.status(201).json("Customer deleted Successfully")
    } catch (error) {
        next(error)
    }
}
export const getCustomerById = async (req, res, next) => {
    const { id } = req.params;
    try {
        const customer = await Customer.findById({ _id: id })
        res.status(200).json(customer)
    } catch (error) {
        next(error)
    }
}
export const updateCustomer = async (req, res, next) => {
    const { id } = req.params;
    const { name, email } = req.body;

    try {
        const customer = await Customer.findOne({
            _id: id,
            adminId: req.user.id
        });

        if (!customer) {
            return next(errorHandler(404, "Customer not found"));
        }

        customer.name = name;
        customer.email = email;

        if (req.file) {
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

            customer.avatar = result.secure_url;
        }

        await customer.save();

        res.status(200).json("Customer updated successfully");
    } catch (error) {
        next(error);
    }
};