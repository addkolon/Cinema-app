import { Router } from "express";
import { handleLogin, verifyToken } from "../controllers/userController.js";

const userRouter = Router();

userRouter.post('/api/user/login', handleLogin);


export default userRouter;


