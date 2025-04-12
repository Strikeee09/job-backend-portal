import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../middlewares/error.js";
import {User} from "../models/userSchema.js";
import {v2 as cloudinary} from "cloudinary";
import { sendToken } from "../utils/jwtToken.js";

export const register = catchAsyncError(async (req, res, next) => {
    const body = req.body || {}          
    try{                                                                  //requesting user for data
        const {
             name, 
             email,
             phone, 
             address, 
             password, 
             role, 
             firstNiche, 
             secondNiche, 
             thirdNiche,  
             coverLetter,
            } = req.body;

            if(!name || !email || !phone || !address || !password || !role){        // check if all required fields are provided
                return next(new ErrorHandler("Please fill all fields.", 400));
            }

            if(role === "Job seeker" && (!firstNiche || !secondNiche || !thirdNiche)){        // check if the user is a job seeker and if they provided their preferred job niches
                return next(new ErrorHandler("Please provide your preferred job niches.", 400));
            }

            const existingUser = await User.findOne({email});              // check if the user already exists in the database
            if(existingUser){
                return next(new ErrorHandler("User already exists.", 400));
            }

            const userData = {                     // create a new user object if user is not registered
                name,
                email,
                phone,
                address,
                password,
                role,
                niches: {
                    firstNiche,
                    secondNiche,
                    thirdNiche
                },
                coverLetter
            };           //ek baar bina resume k kar...wo to ho hi jayega   a 

            if(req.files && req.files.resume){   
                console.log(req.files.resume);     // check if a resume file is provided
                const{resume} = req.files;            // get the resume file from the request
                if(resume){                        
                    try{                              // upload the resume to Cloudinary
                        console.log(resume.tempFilePath);   // log the temporary file path of the resume
                        const cloudinaryResponse = await cloudinary.uploader.upload(resume.tempFilePath, { 
                            folder: "Job_Seeker_Resume"                  // folder name in Cloudinary
                        });

                        console.log(cloudinaryResponse);         // log the response from Cloudinary
                        if(!cloudinaryResponse || cloudinaryResponse.error){ // check if the upload was successful
                            return next(
                                new ErrorHandler("Resume upload failed", 500) 
                            );
                        }
                        console.log(cloudinaryResponse.secure_url); // log the secure URL of the uploaded resume
                        userData.resume = cloudinaryResponse.secure_url;

                    }
                    catch(error){                        // handle any errors during upload
                        return next(new ErrorHandler("Resume upload failed", 500));           
                }
            }
        }
        const user = await User.create(userData);          // create a new user in the database
        sendToken(user, 201, res, "User registered successfully");     // send JWT token in response
             
    }catch(error){
        next(error);                                   // handle any errors  
    }

});

// It checks if the user exists, verifies the password, and sends a JWT token in the response.
export const login = catchAsyncError(async (req, res, next) => {
    const {role, email, password} = req.body;         // get user credentials from request body
    if(!role || !email || !password){                // check if all required fields are provided
        return next(new ErrorHandler("Please fill all fields.", 400));
    }

    const user = await User.findOne({email}).select("+password");       // find user in the database using email // select("+password") is used to include the password field in the response
    if(!user){
        return next(new ErrorHandler("Invalid email or password ", 400));   // handle invalid email or password
    }      
    
    const isPasswordMatched = await user.comparePassword(password);         // compare entered password with hashed password in the database
    if(!isPasswordMatched){
        return next(new ErrorHandler("Invalid email or password ", 400));   // handle invalid email or password
    }

    if(user.role !== role){                                              // check if the user role matches the provided role
        return next(new ErrorHandler("Invalid role", 400));                // handle invalid role
    }

    sendToken(user, 200, res, "User logged in successfully");           // send JWT token in response
});

export const logout = catchAsyncError(async (req, res, next) => {
    res.status(200).cookie("token","",{
        expires: new Date(Date.now()),                               
        httpOnly: true,
    }).json({
        success: true,
        message: "Logged out successfully",
    })
});         // clear the JWT token cookie and send a response

export const getUser = catchAsyncError(async (req, res, next) => {
    const user = req.user;          // find user by ID from the token
    res.status(200).json({  
        success: true,  
        user,         // send user data in response     
    });
});

export const updateProfile = catchAsyncError(async (req, res, next) => {
    const newUserData = {                // create a new user object with updated data
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        address: req.body.address,
        niches: {
            firstNiche: req.body.firstNiche,
            secondNiche: req.body.secondNiche,
            thirdNiche: req.body.thirdNiche
        },
    }
    const {firstNiche, secondNiche, thirdNiche} = newUserData.niches;            // destructure the niches from newUserData

    if(req.user.role === "Employer" && (!firstNiche || !secondNiche || !thirdNiche)){        // check if the user is a job seeker and if they provided their preferred job niches
        return next(new ErrorHandler("Please provide your preferred job niches.", 400));
    }
    // check if the user is a job seeker and if they provided their preferred job niches
    if(req.files ){
        const {resume} = req.files.resume;           // get the resume file from the request
        if(resume){
            const currentResumeId = req.user.resume.public_id;          // get the current resume ID from the user object
            if(currentResumeId){
                await cloudinary.uploader.destroy(currentResumeId);          // delete the current resume from Cloudinary
            }

            const newResume = await cloudinary.uploader.upload(resume.tempFilePath, {
                folder: "Job_Seeker_Resume"                                // folder name in Cloudinary
            });
            newUserData.resume = {    //object which was created to store the resume data 
                public_id: newResume.public_id,
                url: newResume.secure_url
            };
        }           
    }

    const user = await User.findByIdAndUpdate(req.user._id, newUserData, {
        new: true,
        runValidators: true,
        useFindAndModify: false,
    }); // update the user in the database
      
    res.status(200).json({
        success: true,
        message: "Profile updated successfully",
        user,
    });
});

export const updatePassword = catchAsyncError(async (req, res, next) => {
    const user = await User.findById(req.user._id).select("+password");         // find user by ID from the token

    const isPasswordMatched = await user.comparePassword(req.body.oldPassword);         // compare entered password with hashed password in the database

    if(!isPasswordMatched){
        return next(new ErrorHandler("Old password is incorrect", 400));       // handle invalid old password
    }

    if(req.body.newPassword !== req.body.confirmPassword){
        return next(new ErrorHandler("New password and confirm password do not match", 400));       // handle password mismatch
    }
    user.password = req.body.newPassword;         // update the password in the database
    await user.save();         // save the updated user object in the database
    sendToken(user, 200, res, "Password updated successfully");         // send JWT token in response

});