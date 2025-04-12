import express from "express";
import {config} from "dotenv"
import cors from "cors"
import cookieParser from "cookie-parser";
import {connectDB} from "./database/connection.js"
import { errorMiddleware } from "./middlewares/error.js";
import fileUpload from "express-fileupload";
import userRouter from "./routes/userRouter.js"; 
import jobRouter from "./routes/jobRouter.js"; 
import applicationRouter from "./routes/applicationRouter.js"; 
import {newsLetterCron} from "./automation/newsLetterCron.js"; 


const app = express();
config({path: "./config/config.env"});

app.use(cors({                //configure cors to allow requests from the frontend
    origin : [process.env.FRONTEND_URL],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
})
);

app.use(cookieParser());  //middleware for cookies
app.use(express.json()); //middleware for json data
app.use(express.urlencoded({extended: true})); //middleware for urlencoded data

app.use(    //middleware for file upload
    fileUpload({
        useTempFiles: true,
        tempFileDir: "/tmp/",  //temporary directory for file upload
    })
);



app.get('/', (req, res) => {
    res.send("Server is running"); //test route to check if server is running
});



app.use("/api/v1/user", userRouter);
app.use("/api/v1/job", jobRouter);  //user router for user related routes (same rahega sabkeliye)
app.use("/api/v1/application", applicationRouter);


newsLetterCron();
connectDB();          //connect to database 

app.use(errorMiddleware); //error middleware

export default app;