import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import validator from "validator";

const userSchema = new mongoose.Schema({
    name : {
        type : String,
        required : [true, "Please enter your name"],
        minLength : [3, "Name must be at least 3 characters"],
        maxLength : [30, "Name cannot exceed 30 characters"]
    },
    email : {
        type : String,
        required : [true, "Please enter your email"],
        unique : true,
        validate : [validator.isEmail, "Please enter a valid email address"]
    },
    phone : {
        type : Number,
        required : [true, "Please enter your phone number"]
    },
    address : {
        type : String,
        required : [true, "Please enter your address"]
    },
    niches : {
        firstNiche : String,
        secondNiche : String,
        thirdNiche : String
    },
    password : {
        type : String,
        required : [true, "Please enter your password"],
        minLength : [8, "Password must be at least 8 characters"],
        maxLength : [32, "Password cannot exceed 32 characters"],
        select : false
    },
    resume : {
        type:String,
        default : ""
    },
    coverLetter : {
        type : String      
    },
    role : {
        type : String,
        required : true,
        enum : ["Job Seeker", "Employer"]

    },
    createdAt : {
        type : Date,
        default : Date.now
    },
    
});

userSchema.pre("save", async function (next) {           //pre save middleware to hash password before saving it to the database
    if(!this.isModified("password")){
        next();                                         //if password is not modified, move to the next middleware
    }
    this.password = await bcrypt.hash(this.password, 10);         //hash the password using bcrypt
});

userSchema.methods.comparePassword = async function (enteredPassword) {      //compare password method to compare entered password with hashed password
    return await bcrypt.compare(enteredPassword, this.password);         //compare the entered password with the hashed password in the database
};


userSchema.methods.getJwtToken = function () {                     // Generate JWT token using the user object i.e function in userSchema.js
    return jwt.sign({id : this._id}, process.env.JWT_SECRET_KEY, {   //sign is used to create a token //its a payload containing the user id
        expiresIn : process.env.JWT_EXPIRE,
    });
};
    



export const User = mongoose.model("User", userSchema);