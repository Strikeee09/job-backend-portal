import express from "express";
import { login, logout, register, getUser, updateProfile, updatePassword } from "../controllers/userController.js";
import { isAuthenticated } from "../middlewares/auth.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login ); 
router.get("/logout", isAuthenticated, logout);
router.get("/getuser", isAuthenticated, getUser);  // get user details by middleware 
router.put("/update/profile", isAuthenticated, updateProfile); 
router.put("/update/password", isAuthenticated, updatePassword); // update password by middleware


export default router;