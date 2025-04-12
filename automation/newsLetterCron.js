import cron from "node-cron";
import {Job} from "../models/jobSchema.js";
import {User} from "../models/userSchema.js";
import {sendEmail} from "../utils/sendEmail.js";

export const newsLetterCron  = () => {
    cron.schedule("*/1 * * * *", async () => {
        console.log("Running Cron Job Every Minute"); //for testing purpose
        const jobs = await Job.find({newsLetterSent: false}); //find all jobs where newsLetterSent is false
        for(const job of jobs) { 
            try {
                const filteredUsers = await User.find({ 
                  $or: [                               
                    {"niches.firstNiche": job.jobNiche},
                    {"niches.secondNiche": job.jobNiche},
                    {"niches.thirdNiche": job.jobNiche},
                  ]  
                })
                for(const user of filteredUsers){  //this loop is running for filtered users
                    const subject = `Exciting Job Opportunity in ${job.jobNiche}!`;
                    const message = `Hi ${user.name},\n\nWe have found a new job opportunity that matches your interests in ${job.jobNiche}!\n\nJob Title: ${job.title}\nCompany: ${job.companyName}\nLocation: ${job.location}\nDescription: ${job.description}\n\nDon't miss this opportunity! Visit our platform to apply now.\n\nBest regards,\nThe Job Portal Team`;

                    sendEmail({
                        email: user.email,
                        subject,
                        message
                    })
                }
                job.newsLetterSent = true;   //jo jo users ka job match hota h unhe email chali gayi
                await job.save();
            }catch (error) {
                console.log("Error in Node Cron Catch Block");
                return next(console.error(error || "Somer error in Cron"));
            }
        }
    });
    
}
