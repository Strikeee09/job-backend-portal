import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../middlewares/error.js";
import {Job} from "../models/jobSchema.js";

export const postJob = catchAsyncError(async (req, res, next) => {
    console.log("Request body:", req.body); 
   const body = req.body || {}                                                                           //requesting user for data
        const {
            title,
            jobType,
            location,
            companyName,
            introduction,
            responsibilities,
            qualifications,
            offers,
            salary,
            hiringMultipleCandidates,
            personalWebsiteTitle,
            personalWebsiteUrl,
            jobNiche,
            jobPostedBy,
        } = req.body;
        if(
            !title ||
            !jobType ||
            !location ||
            !companyName ||
            !introduction ||
            !responsibilities ||
            !qualifications ||
            !offers ||
            !salary ||
            !jobNiche 
        ){
            return next(new ErrorHandler("Please fill all fields.", 400));
        }

        if((personalWebsiteTitle && !personalWebsiteUrl) || 
        (!personalWebsiteTitle && personalWebsiteUrl)){
            return next(new ErrorHandler("Please provide both personal website title and URL.", 400));
        }

        const job = await Job.create({
            title,
            jobType,
            location,
            companyName,
            introduction,
            responsibilities,
            qualifications,
            offers,
            salary,
            hiringMultipleCandidates,
            personalWebsite: {
                title: personalWebsiteTitle,
                url: personalWebsiteUrl,
            },
            jobNiche,
            jobPostedBy: req.user._id,
        })

        res.status(201).json({
            success: true,
            message: "Job posted successfully",
            job,                                  
        });
});


export const getAllJobs = catchAsyncError(async (req, res, next) => {
    const {city, niche, searchKeyword} = req.query;          // Destructure the query parameters from the request
    const query = {};                  // Initialize an empty query object 
    if(city) {
        query.location = city;         // If city is provided, add it to the query object
    } 
    if (niche) {
        query.jobNiche = niche;           // If niche is provided, add it to the query object
    }
    if (searchKeyword) {
        query.$or = [             // If searchKeyword is provided, add it to the query object
            { title: { $regex: searchKeyword, $options: "i" } },           // Search by title (case-insensitive)
            { companyName: { $regex: searchKeyword, $options: "i" } },       // Search by company name (case-insensitive)
            { location: { $regex: searchKeyword, $options: "i" } },         // Search by location (case-insensitive)
        ];
    }
    
    const jobs = await Job.find(query);
    res.status(200).json({
        success: true,
        message: "Jobs fetched successfully",
        jobs,                       // Send the fetched jobs in the response
        count: jobs.length,            // Send the count of fetched jobs in the response
    });
 
});


export const getMyJobs = catchAsyncError(async (req, res, next) => {
   const myJobs = await Job.find({jobPostedBy: req.user._id});         // Find jobs posted by the user
   res.status(200).json({
        success: true,
        message: "Jobs fetched successfully",
        myJobs,                       // Send the fetched jobs in the response
    });
});


export const deleteJob = catchAsyncError(async (req, res, next) => {
    const {id} = req.params;                   // Get the job ID from the request parameters
    const job = await Job.findById(id);         // Find the job by ID   
    if(!job) {
        return next(new ErrorHandler("Oops! Job not found", 404));         // If job not found, send error
    }
    await job.deleteOne();         // Delete the job from the database
    res.status(200).json({
        success: true,
        message: "Job deleted successfully",
    });
});


export const getASingleJob = catchAsyncError(async (req, res, next) => {
    const {id} = req.params;                   // Get the job ID from the request parameters
    const job = await Job.findById(id);         // Find the job by ID   
    if(!job) {
        return next(new ErrorHandler("Job not found", 404));         // If job not found, send error
    }
    res.status(200).json({
        success: true,
        message: "Job fetched successfully",
        job,                       // Send the fetched job in the response
    });
});
