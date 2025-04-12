import { catchAsyncError } from "./catchAsyncError.js";
import ErrorHandler from "./error.js";
import jwt from "jsonwebtoken";
import { User } from "../models/userSchema.js";


export const isAuthenticated = catchAsyncError(async (req, res, next) => {
    const { token } = req.cookies; // Get token from cookies
    if (!token) {
        return next(new ErrorHandler("Please login to access this resource", 400)); // If token is not present, send error
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);      // Verify the token using JWT secret
  
    req.user = await User.findById(decoded.id) ;

    next();  // Call the next middleware or route handler 
});

export const isAuthourized = (...roles) => {  // Middleware to check user different roles
    return (req, res, next) => {               // Return a function that takes req, res, and next as arguments
        if (!roles.includes("Employer")) {  //if match then function will return true
            return next(
                new ErrorHandler(`Role: ${req.user.role} is not allowed to access this resource`, 403)); // If not, send error
        }
        next();                                // Call the next middleware or route handler
    };
};