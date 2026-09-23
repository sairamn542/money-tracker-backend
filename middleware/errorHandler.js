// export const errorHandler = (err, req, res, next) => {
//     const statusCode = err.statusCode || 500;
//     res.status(statusCode).json({
//         success : false,
//         message : err.message || "something went wrong"
//     })
// }

export const errorHandler = (statusCode, message) => {
    const err = new Error();
    err.statusCode = statusCode;
    err.message = message;
    return err;
};