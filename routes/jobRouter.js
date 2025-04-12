import express from "express";
import { isAuthenticated, isAuthourized } from "../middlewares/auth.js";
import { postJob, getAllJobs, getASingleJob, getMyJobs, deleteJob } from "../controllers/jobController.js";


const router = express.Router();

router.post("/post", isAuthenticated, isAuthourized("Employer"), postJob);
router.get("/getall", getAllJobs); // get all jobs
router.get("/getmyjobs", isAuthenticated, isAuthourized("Employer"), getMyJobs); // get my jobs
router.delete("/delete/:id", isAuthenticated, isAuthourized("Employer"), deleteJob); // delete job
router.get("/get/:id", isAuthenticated, getASingleJob); 

export default router;