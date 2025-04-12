import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../middlewares/error.js"; 
import { Application } from "../models/applicationSchema.js";
import { Job } from "../models/jobSchema.js";
import {v2 as cloudinary} from "cloudinary";

export const postApplication = catchAsyncError(async (req, res, next) => {
    const {id} = req.params;
    console.log("BODY:", req.body);
    const body = req.body || {};
    const { name, email, phone, address, coverLetter } = body; //destructuring body
    if(!name || !email || !phone || !address || !coverLetter) {
        return next(new ErrorHandler("Please fill all the fields", 400));
    }

    const jobSeekerInfo = {
        id: req.user._id,
        name,
        email,
        phone,
        address,
        coverLetter,
        role: "Job Seeker",
    };
    1
    const jobDetails = await Job.findById(id);
    if(!jobDetails) {
        return next(new ErrorHandler("Job not found", 404));
    }

    const isAlreadyApplied = await Application.findOne({
        "jobInfo.id": id,
        "jobSeekerInfo.id": req.user._id,
    });
    if(isAlreadyApplied) {
        return next(new ErrorHandler("You have already applied for this job", 400));
    }
    
    if(req.files && req.files.resume){
        const {resume} = req.files; //destructuring resume from files
        try {
            const cloudinaryRespone = await cloudinary.uploader.upload(resume.tempFilePath, {
                folder: "Job_Seeker_Resume",
            });
            if(!cloudinaryRespone || cloudinaryRespone.error) {
                return next(new ErrorHandler("Resume upload failed", 500));
            }
            jobSeekerInfo.resume = {
                public_id: cloudinaryRespone.public_id,
                url: cloudinaryRespone.secure_url,
            };
        } catch (error) {
            return next(new ErrorHandler("Resume upload failed", 500));
        }
    }
    else{
        if(req.user && !req.user.resume.url){
            return next(new ErrorHandler("Please upload your resume", 400));
        }
        jobSeekerInfo.resume = {
            public_id: req.user && req.user.resume.public_id,
            url: req.user && req.user.resume.url,
        };
    }


    const employerInfo = {
        id: jobDetails.jobPostedBy,         //store the employer id in the application
        role: "Employer"
    }

    const jobInfo = {
        jobId: id,
        jobTitle: jobDetails.title
    }

    const application = await Application.create({           //store the application in the database
        jobSeekerInfo,
        employerInfo,
        jobInfo
    });
    res.status(201).json({
        success: true,
        message: "Application submitted successfully",
        application,
    });

});


export const employerGetAllApplication = catchAsyncError(async (req, res, next) => {
    const { _id } = req.user;             //get the employer id from the request (Destructring)
    const applications = await Application.find({
        "employerInfo.id": _id,
        "deletedBy.employer": false,
    });
    res.status(200).json({
        success: true,
        applications,
    });
});


export const jobSeekerGetAllApplication = catchAsyncError(async (req, res, next) => {
    const { _id } = req.user;             //get the employer id from the request (Destructring)
    const applications = await Application.find({
        "jobSeekerInfo.id": _id,
        "deletedBy.jobSeeker": false,
    });
    res.status(200).json({
        success: true,
        applications,
    });
});


export const deleteApplication = catchAsyncError(async (req, res, next) => {
    const { id } = req.params;             //get the application id from the request (Destructring)
    const application = await Application.findById(id);
    
    if(!application) {
        return next(new ErrorHandler("Application not found", 404));
    }

    const { role } = req.user;            //get the role from the request (Destructring)
    switch(role) {
        case "Job Seeker":
            application.deletedBy.jobSeeker = true;
            await application.save();
            break;
        case "Employer":
            application.deletedBy.employer = true;
            await application.save();
            break;
        default:
            console.log("Invalid role");
            break;
    }

    if(application.deletedBy.employer === true && application.deletedBy.jobSeeker === true) {  //if both employer and job seeker have deleted the application
        await application.deleteOne();         //delete the application from the database
    }

    res.status(200).json({
        success: true,
        message: "Application deleted successfully",
    });
       
});