import express from 'express';
import { isAuthenticated, isAuthourized } from '../middlewares/auth.js';
import { postApplication, employerGetAllApplication, jobSeekerGetAllApplication, deleteApplication} from '../controllers/applicationController.js';

const router = express.Router();

router.post("/post/:id", isAuthenticated, isAuthourized("Job Seeker"), postApplication);

router.get("/employer/getall", isAuthenticated, isAuthourized("Employer"), employerGetAllApplication);

router.get("/jobseeker/getall", isAuthenticated, isAuthourized("Job Seeker"), jobSeekerGetAllApplication);

router.delete("/delete/:id", isAuthenticated, deleteApplication);

export default router;