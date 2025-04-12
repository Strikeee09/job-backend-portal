import mongoose from "mongoose";

const jobSchema = new mongoose.Schema({
    title : {
        type : String,
        required : true
    },
    jobType : {
        type : String,
        required : true,
        enum : ["Full-time", "Part-time", "Internship"]
    },
    location : {
        type : String,
        required : true
    },
    companyName : {
        type : String,
        required : true
    },
    introduction : {
        type : String,
    },
    responsibilities : {
        type : String,
        required : true
    },
    qualifications : {
        type : String,
        required : true
    },
    offers : {
        type : String,
    },
    salary : {
        type : String,
        required : true
    },
    hiringMultipleCandidates : {
        type: Boolean,  
        default: false,       
    },
    personalWebsite : {
       title : String,
       url : String
    },
    jobNiche : {
        type : String,
        required : true
    },
    newsLetterSent :{
        type : Boolean,
        default : false
    },
    jobPostedOn : {
        type : Date,
        default : Date.now
    },
    jobPostedBy : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
        required : true
    },

})


export const Job = mongoose.model("Job", jobSchema);         //create a model for the job schema and export it