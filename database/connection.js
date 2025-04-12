import mongoose from "mongoose";

export const connectDB = () => {
    mongoose.connect(process.env.MONGO_URI, {
        dbName: "Job_Portal"
    }).then(() => {
        console.log("Connected to MongoDB successfully")  
    }).catch(err => {
        console.log(`Error connecting to MongoDB:", ${err}`)  
    }) 
        
  
}
    